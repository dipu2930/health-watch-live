import { useState, useRef } from "react";
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

// Mock data
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
  {
    id: "4",
    type: "info" as const,
    title: "Surveillance Update",
    location: "Maharashtra",
    time: "2 hours ago",
    description: "NLP detected increased social media mentions of flu symptoms in Mumbai region.",
  },
  {
    id: "5",
    type: "warning" as const,
    title: "Typhoid Alert",
    location: "Bihar",
    time: "3 hours ago",
    description: "Cluster of typhoid cases identified in Patna district. Investigation ongoing.",
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
  {
    id: "4",
    source: "social" as const,
    language: "Marathi",
    content: "पुण्यात स्वाइन फ्लूचे रुग्ण आढळले, नागरिकांना सावध राहण्याचे आवाहन",
    location: "Pune",
    sentiment: "negative" as const,
    relevance: 91,
    timestamp: "15 mins ago",
  },
  {
    id: "5",
    source: "news" as const,
    language: "English",
    content: "Health ministry reports decline in COVID-19 cases across northern states",
    location: "National",
    sentiment: "positive" as const,
    relevance: 68,
    timestamp: "20 mins ago",
  },
  {
    id: "6",
    source: "radio" as const,
    language: "Telugu",
    content: "హైదరాబాద్‌లో జలుబు, దగ్గు కేసులు పెరుగుతున్నాయి",
    location: "Hyderabad",
    sentiment: "negative" as const,
    relevance: 78,
    timestamp: "25 mins ago",
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

const stateDetails: Record<string, any> = {
  UP: {
    id: "UP",
    name: "Uttar Pradesh",
    riskLevel: "critical",
    cases: 5234,
    population: 235000000,
    rainfall: 850,
    temperature: 28,
    healthFacilities: 4523,
    diseases: [
      { name: "Dengue", cases: 2341, trend: "up" },
      { name: "Malaria", cases: 1456, trend: "up" },
      { name: "Typhoid", cases: 892, trend: "stable" },
      { name: "Cholera", cases: 545, trend: "down" },
    ],
  },
  DL: {
    id: "DL",
    name: "Delhi",
    riskLevel: "critical",
    cases: 6789,
    population: 32000000,
    rainfall: 620,
    temperature: 30,
    healthFacilities: 892,
    diseases: [
      { name: "Dengue", cases: 3456, trend: "up" },
      { name: "COVID-19", cases: 1890, trend: "down" },
      { name: "Typhoid", cases: 789, trend: "up" },
      { name: "Chikungunya", cases: 654, trend: "stable" },
    ],
  },
  MH: {
    id: "MH",
    name: "Maharashtra",
    riskLevel: "high",
    cases: 3892,
    population: 125000000,
    rainfall: 1100,
    temperature: 27,
    healthFacilities: 3891,
    diseases: [
      { name: "Leptospirosis", cases: 1234, trend: "up" },
      { name: "Dengue", cases: 1089, trend: "stable" },
      { name: "Malaria", cases: 876, trend: "down" },
      { name: "H1N1", cases: 693, trend: "up" },
    ],
  },
  WB: {
    id: "WB",
    name: "West Bengal",
    riskLevel: "critical",
    cases: 4567,
    population: 100000000,
    rainfall: 1500,
    temperature: 29,
    healthFacilities: 2456,
    diseases: [
      { name: "Malaria", cases: 2134, trend: "up" },
      { name: "Dengue", cases: 1456, trend: "up" },
      { name: "Japanese Encephalitis", cases: 567, trend: "stable" },
      { name: "Kala-azar", cases: 410, trend: "down" },
    ],
  },
  RJ: {
    id: "RJ",
    name: "Rajasthan",
    riskLevel: "high",
    cases: 2847,
    population: 81000000,
    rainfall: 400,
    temperature: 34,
    healthFacilities: 2134,
    diseases: [
      { name: "Dengue", cases: 1234, trend: "up" },
      { name: "Chikungunya", cases: 876, trend: "stable" },
      { name: "Typhoid", cases: 456, trend: "down" },
      { name: "Heat Stroke", cases: 281, trend: "up" },
    ],
  },
};

// Default state details for states not explicitly defined
const getStateDetails = (stateId: string) => {
  if (stateDetails[stateId]) return stateDetails[stateId];
  
  const stateData = statesPaths.find(s => s.id === stateId);
  if (!stateData) return null;
  
  return {
    id: stateId,
    name: stateData.name,
    riskLevel: stateData.riskLevel,
    cases: stateData.cases,
    population: Math.floor(Math.random() * 50000000) + 10000000,
    rainfall: Math.floor(Math.random() * 1500) + 300,
    temperature: Math.floor(Math.random() * 15) + 20,
    healthFacilities: Math.floor(Math.random() * 3000) + 500,
    diseases: [
      { name: "Dengue", cases: Math.floor(stateData.cases * 0.4), trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)] },
      { name: "Malaria", cases: Math.floor(stateData.cases * 0.3), trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)] },
      { name: "Typhoid", cases: Math.floor(stateData.cases * 0.2), trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)] },
      { name: "Others", cases: Math.floor(stateData.cases * 0.1), trend: "stable" },
    ],
  };
};

const Index = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const handleExplore = () => {
    dashboardRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStateClick = (stateId: string) => {
    setSelectedState(stateId === selectedState ? null : stateId);
  };

  const selectedStateDetails = selectedState ? getStateDetails(selectedState) : null;

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
            <StatsCard
              title="Total Active Cases"
              value={45678}
              change="+12.5% from last week"
              changeType="negative"
              icon={Bug}
              variant="danger"
              delay={0}
            />
            <StatsCard
              title="States on Alert"
              value={8}
              change="2 new alerts today"
              changeType="negative"
              icon={AlertTriangle}
              variant="warning"
              delay={0.1}
            />
            <StatsCard
              title="Population Covered"
              value="1.4B"
              change="28 states monitored"
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
                data={mockPredictionData as any}
                disease="Dengue"
                state={selectedState ? statesPaths.find(s => s.id === selectedState)?.name || "India" : "India"}
              />
              <NLPSurveillance signals={mockSignals} />
            </div>

            {/* Right Column - Alerts */}
            <div className="lg:col-span-3">
              <AlertsPanel alerts={mockAlerts} />
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
