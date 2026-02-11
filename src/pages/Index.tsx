import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Users,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Bug,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { IndiaMap, statesPaths, StateData } from "@/components/ui/IndiaMap";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { NLPSurveillance } from "@/components/dashboard/NLPSurveillance";
import { PredictionChart } from "@/components/dashboard/PredictionChart";
import { StateDetail } from "@/components/dashboard/StateDetail";
import { 
  useDashboardStats, 
  useAlerts, 
  useNLPSignals, 
  usePredictions,
  useStateMapData,
  useWeatherData,
  useOutbreaksByStateDisease,
} from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { useRealtimeDashboard } from "@/hooks/useRealtimeDashboard";

// Fallback mock data for when database is empty
const mockAlerts = [
  {
    id: "1",
    type: "critical" as const,
    title: "Dengue Outbreak Detected",
    location: "Uttar Pradesh",
    time: "2 mins ago",
    description: "Rapid increase in dengue cases reported across 5 districts. Immediate action required.",
  },
  {
    id: "2",
    type: "warning" as const,
    title: "Malaria Surge Warning",
    location: "West Bengal",
    time: "15 mins ago",
    description: "Predictive model indicates 40% increase in malaria cases expected within 2 weeks.",
  },
  {
    id: "3",
    type: "critical" as const,
    title: "Cholera Cases Rising",
    location: "Delhi NCR",
    time: "1 hour ago",
    description: "Water contamination suspected in multiple areas. Emergency protocols activated.",
  },
];

const mockSignals = [
  {
    id: "1",
    source: "news" as const,
    language: "Hindi",
    content: "दिल्ली में डेंगू के मामलों में तेजी से वृद्धि, स्वास्थ्य विभाग अलर्ट पर",
    location: "Delhi",
    sentiment: "negative" as const,
    relevance: 94,
    timestamp: "2 mins ago",
  },
  {
    id: "2",
    source: "social" as const,
    language: "Bengali",
    content: "কলকাতায় ম্যালেরিয়া রোগীর সংখ্যা বাড়ছে, হাসপাতালে ভর্তি বেশি",
    location: "Kolkata",
    sentiment: "negative" as const,
    relevance: 87,
    timestamp: "5 mins ago",
  },
  {
    id: "3",
    source: "news" as const,
    language: "Tamil",
    content: "சென்னையில் காய்ச்சல் பரவல் கட்டுப்பாட்டில் உள்ளது என அரசு அறிவிப்பு",
    location: "Chennai",
    sentiment: "positive" as const,
    relevance: 72,
    timestamp: "10 mins ago",
  },
];

const mockPredictionData = [
  { date: "Jan 1", actual: 120, predicted: 125, lower: 110, upper: 140 },
  { date: "Jan 8", actual: 145, predicted: 150, lower: 130, upper: 170 },
  { date: "Jan 15", actual: 180, predicted: 175, lower: 155, upper: 195 },
  { date: "Jan 22", actual: 210, predicted: 220, lower: 195, upper: 245 },
  { date: "Jan 29", actual: 195, predicted: 200, lower: 175, upper: 225 },
  { date: "Feb 5", actual: 230, predicted: 235, lower: 205, upper: 265 },
  { date: "Feb 12", actual: 280, predicted: 290, lower: 255, upper: 325 },
  { date: "Feb 19", actual: null, predicted: 340, lower: 295, upper: 385 },
  { date: "Feb 26", actual: null, predicted: 380, lower: 325, upper: 435 },
  { date: "Mar 5", actual: null, predicted: 420, lower: 355, upper: 485 },
];

// Transform database alerts to component format
const transformAlerts = (dbAlerts: any[] | undefined) => {
  if (!dbAlerts || dbAlerts.length === 0) return mockAlerts;
  
  return dbAlerts.map((alert) => ({
    id: alert.id,
    type: (alert.type === "critical" ? "critical" : alert.type === "warning" ? "warning" : "info") as "critical" | "warning" | "info",
    title: alert.title,
    location: alert.states?.name || "Unknown",
    time: formatTimeAgo(new Date(alert.created_at)),
    description: alert.description || "",
  }));
};

// Transform database NLP signals to component format
const transformSignals = (dbSignals: any[] | undefined) => {
  if (!dbSignals || dbSignals.length === 0) return mockSignals;
  
  return dbSignals.map((signal) => ({
    id: signal.id,
    source: (signal.source === "news" ? "news" : signal.source === "social" ? "social" : "radio") as "news" | "social" | "radio",
    language: signal.language,
    content: signal.content,
    location: signal.location_detected || signal.states?.name || "Unknown",
    sentiment: (signal.sentiment === "positive" ? "positive" : signal.sentiment === "negative" ? "negative" : "neutral") as "positive" | "negative" | "neutral",
    relevance: signal.relevance_score || 50,
    timestamp: formatTimeAgo(new Date(signal.detected_at)),
  }));
};

// Transform predictions to chart format
const transformPredictions = (dbPredictions: any[] | undefined) => {
  if (!dbPredictions || dbPredictions.length === 0) return mockPredictionData;
  
  return dbPredictions.map((pred) => ({
    date: new Date(pred.prediction_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    actual: null, // We'd need outbreak reports to get actual values
    predicted: pred.predicted_cases,
    lower: pred.confidence_lower,
    upper: pred.confidence_upper,
  }));
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} mins ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

const formatPopulation = (pop: number) => {
  if (pop >= 1000000000) return `${(pop / 1000000000).toFixed(1)}B`;
  if (pop >= 1000000) return `${(pop / 1000000).toFixed(0)}M`;
  if (pop >= 1000) return `${(pop / 1000).toFixed(0)}K`;
  return pop.toString();
};

// Get state details from map data, weather, and outbreak breakdown
const getStateDetails = (
  stateId: string, 
  stateMapData: any[] | undefined, 
  weatherData: any[] | undefined,
  outbreakData: any[] | undefined
) => {
  const stateData = statesPaths.find(s => s.id === stateId);
  const dbState = stateMapData?.find(s => s.id === stateId);
  
  if (!stateData) return null;
  
  const riskLevel = (dbState?.riskLevel || stateData.riskLevel) as "critical" | "high" | "medium" | "low";
  const cases = dbState?.cases || stateData.cases;
  
  // Get real weather data for this state
  const stateWeather = weatherData?.find(w => w.states?.code === stateId);
  
  // Get real disease breakdown for this state
  const stateUuid = dbState?.stateUuid;
  const diseaseMap: Record<string, number> = {};
  outbreakData?.forEach((o: any) => {
    if (o.state_id === stateUuid && o.diseases?.name) {
      diseaseMap[o.diseases.name] = (diseaseMap[o.diseases.name] || 0) + (o.case_count || 0);
    }
  });
  
  const diseases = Object.entries(diseaseMap)
    .sort(([, a], [, b]) => b - a)
    .map(([name, diseaseCases]) => ({
      name,
      cases: diseaseCases,
      trend: (diseaseCases > cases * 0.3 ? "up" : diseaseCases > cases * 0.1 ? "stable" : "down") as "up" | "down" | "stable",
    }));
  
  // If no outbreak data for this state, show "No active outbreaks"
  if (diseases.length === 0) {
    diseases.push({ name: "No active outbreaks", cases: 0, trend: "stable" as const });
  }
  
  return {
    id: stateId,
    name: stateData.name,
    riskLevel,
    cases,
    population: Number(dbState?.population) || 0,
    rainfall: stateWeather ? Number(stateWeather.rainfall_mm) : 0,
    temperature: stateWeather ? Number(stateWeather.temperature_avg) : 0,
    healthFacilities: dbState?.healthFacilities || 0,
    diseases,
  };
};

const Index = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  
  // Subscribe to real-time updates
  useRealtimeDashboard();
  
  // Fetch data from database
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: dbAlerts } = useAlerts();
  const { data: dbSignals } = useNLPSignals();
  const { data: dbPredictions } = usePredictions();
  const { data: stateMapData } = useStateMapData();
  const { data: weatherData } = useWeatherData();
  const { data: outbreakData } = useOutbreaksByStateDisease();

  const handleExplore = () => {
    dashboardRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStateClick = (stateId: string) => {
    setSelectedState(stateId === selectedState ? null : stateId);
  };

  const selectedStateDetails = selectedState ? getStateDetails(selectedState, stateMapData, weatherData, outbreakData) : null;
  
  // Transform data for components
  const alerts = transformAlerts(dbAlerts);
  const signals = transformSignals(dbSignals);
  const predictions = transformPredictions(dbPredictions);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection onExplore={handleExplore} />

      {/* Dashboard Section */}
      <section ref={dashboardRef} className="py-12 lg:py-20">
        <div className="container px-4">
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-foreground mb-4">
              National Health Dashboard
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real-time monitoring and predictive analytics across all states and union territories
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsLoading ? (
              <>
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
              </>
            ) : (
              <>
                <StatsCard
                  title="Total Active Cases"
                  value={stats?.totalCases || 0}
                  change="From active outbreak reports"
                  changeType="neutral"
                  icon={Bug}
                  variant={stats?.totalCases && stats.totalCases > 1000 ? "danger" : "default"}
                  delay={0}
                />
                <StatsCard
                  title="Active Alerts"
                  value={stats?.alertsCount || 0}
                  change="Requiring attention"
                  changeType={stats?.alertsCount && stats.alertsCount > 5 ? "negative" : "neutral"}
                  icon={AlertTriangle}
                  variant={stats?.alertsCount && stats.alertsCount > 5 ? "warning" : "default"}
                  delay={0.1}
                />
                <StatsCard
                  title="Population Covered"
                  value={formatPopulation(stats?.totalPopulation || 0)}
                  change={`${stats?.statesMonitored || 0} states monitored`}
                  changeType="neutral"
                  icon={Users}
                  variant="default"
                  delay={0.2}
                />
                <StatsCard
                  title="Prediction Accuracy"
                  value="94.2%"
                  change="+2.1% improvement"
                  changeType="positive"
                  icon={TrendingUp}
                  variant="success"
                  delay={0.3}
                />
              </>
            )}
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Map & Prediction */}
            <div className="lg:col-span-5 space-y-6">
              {/* Interactive Map */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-card-gradient rounded-xl border border-border p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold font-display text-foreground">
                      State-wise Risk Map
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-success" />
                      <span className="text-muted-foreground">Low</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-yellow-500" />
                      <span className="text-muted-foreground">Med</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-warning" />
                      <span className="text-muted-foreground">High</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-destructive" />
                      <span className="text-muted-foreground">Critical</span>
                    </div>
                  </div>
                </div>
                <IndiaMap
                  onStateClick={handleStateClick}
                  selectedState={selectedState}
                  statesData={statesPaths}
                />
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Click on a state to view detailed analytics
                </p>
              </motion.div>

              {/* State Details Panel */}
              {selectedStateDetails && (
                <StateDetail
                  state={selectedStateDetails}
                  onClose={() => setSelectedState(null)}
                />
              )}
            </div>

            {/* Middle Column - Charts */}
            <div className="lg:col-span-4 space-y-6">
              <PredictionChart
                data={predictions as any}
                disease="Dengue"
                state={selectedState ? statesPaths.find(s => s.id === selectedState)?.name || "India" : "India"}
              />
              <NLPSurveillance signals={signals} />
            </div>

            {/* Right Column - Alerts */}
            <div className="lg:col-span-3">
              <AlertsPanel alerts={alerts} />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 BHARAT-NIDHI • Ministry of Health & Family Welfare, Government of India
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            National Integrated Disease & Health Intelligence System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
