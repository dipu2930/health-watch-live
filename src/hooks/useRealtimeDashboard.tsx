import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Subscribes to real-time changes on dashboard tables and
 * automatically invalidates the relevant React Query caches.
 */
export const useRealtimeDashboard = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("dashboard-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "outbreak_reports" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["outbreak_reports"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard_stats"] });
          queryClient.invalidateQueries({ queryKey: ["state_map_data"] });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "alerts" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["alerts"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard_stats"] });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "nlp_signals" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["nlp_signals"] });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "predictions" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["predictions"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};
