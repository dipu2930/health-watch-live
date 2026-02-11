import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useStates = () => {
  return useQuery({
    queryKey: ["states"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("states")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });
};

export const useDiseases = () => {
  return useQuery({
    queryKey: ["diseases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("diseases")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });
};

export const useAlerts = () => {
  return useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select(`
          *,
          states:state_id(name, code),
          diseases:disease_id(name)
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
  });
};

export const useNLPSignals = () => {
  return useQuery({
    queryKey: ["nlp_signals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nlp_signals")
        .select(`
          *,
          states:state_id(name, code)
        `)
        .order("detected_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
  });
};

export const usePredictions = (stateId?: string) => {
  return useQuery({
    queryKey: ["predictions", stateId],
    queryFn: async () => {
      let query = supabase
        .from("predictions")
        .select(`
          *,
          states:state_id(name, code),
          diseases:disease_id(name)
        `)
        .order("prediction_date", { ascending: true })
        .limit(30);
      
      if (stateId) {
        query = query.eq("state_id", stateId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: true,
  });
};

export const useOutbreakReports = () => {
  return useQuery({
    queryKey: ["outbreak_reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("outbreak_reports")
        .select(`
          *,
          states:state_id(name, code),
          diseases:disease_id(name)
        `)
        .eq("status", "active")
        .order("report_date", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard_stats"],
    queryFn: async () => {
      // Get total active cases from outbreak reports
      const { data: outbreakData, error: outbreakError } = await supabase
        .from("outbreak_reports")
        .select("case_count")
        .eq("status", "active");
      
      if (outbreakError) throw outbreakError;
      
      const totalCases = outbreakData?.reduce((sum, report) => sum + (report.case_count || 0), 0) || 0;
      
      // Get active alerts count
      const { count: alertsCount, error: alertsError } = await supabase
        .from("alerts")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);
      
      if (alertsError) throw alertsError;
      
      // Get states count
      const { count: statesCount, error: statesError } = await supabase
        .from("states")
        .select("*", { count: "exact", head: true });
      
      if (statesError) throw statesError;
      
      // Get total population
      const { data: populationData, error: populationError } = await supabase
        .from("states")
        .select("population");
      
      if (populationError) throw populationError;
      
      const totalPopulation = populationData?.reduce((sum, state) => sum + (Number(state.population) || 0), 0) || 0;
      
      return {
        totalCases,
        alertsCount: alertsCount || 0,
        statesMonitored: statesCount || 0,
        totalPopulation,
      };
    },
  });
};

// Fetch weather data for states
export const useWeatherData = () => {
  return useQuery({
    queryKey: ["weather_data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("weather_data")
        .select(`
          *,
          states:state_id(name, code)
        `)
        .order("record_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

// Fetch outbreak breakdown by state and disease
export const useOutbreaksByStateDisease = () => {
  return useQuery({
    queryKey: ["outbreaks_by_state_disease"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("outbreak_reports")
        .select(`
          state_id,
          case_count,
          severity,
          diseases:disease_id(name)
        `)
        .eq("status", "active");
      if (error) throw error;
      return data;
    },
  });
};

// Helper to get state-specific data for the map
export const useStateMapData = () => {
  return useQuery({
    queryKey: ["state_map_data"],
    queryFn: async () => {
      const { data: states, error: statesError } = await supabase
        .from("states")
        .select("*");
      
      if (statesError) throw statesError;
      
      const { data: outbreaks, error: outbreaksError } = await supabase
        .from("outbreak_reports")
        .select("state_id, case_count, severity")
        .eq("status", "active");
      
      if (outbreaksError) throw outbreaksError;
      
      // Aggregate cases by state
      const stateCases: Record<string, { cases: number; severity: string }> = {};
      outbreaks?.forEach((outbreak) => {
        if (outbreak.state_id) {
          if (!stateCases[outbreak.state_id]) {
            stateCases[outbreak.state_id] = { cases: 0, severity: "low" };
          }
          stateCases[outbreak.state_id].cases += outbreak.case_count || 0;
          if (outbreak.severity === "critical" || stateCases[outbreak.state_id].severity === "critical") {
            stateCases[outbreak.state_id].severity = "critical";
          } else if (outbreak.severity === "high" || stateCases[outbreak.state_id].severity === "high") {
            stateCases[outbreak.state_id].severity = "high";
          } else if (outbreak.severity === "medium" || stateCases[outbreak.state_id].severity === "medium") {
            stateCases[outbreak.state_id].severity = "medium";
          }
        }
      });
      
      return states?.map((state) => ({
        id: state.code,
        name: state.name,
        cases: stateCases[state.id]?.cases || 0,
        riskLevel: stateCases[state.id]?.severity || "low",
        population: state.population,
        healthFacilities: state.health_facilities_count,
        stateUuid: state.id,
      }));
    },
  });
};
