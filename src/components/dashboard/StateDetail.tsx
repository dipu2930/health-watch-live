import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, TrendingDown, Users, Thermometer, Droplets, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StateDetailProps {
  state: {
    id: string;
    name: string;
    riskLevel: "low" | "medium" | "high" | "critical";
    cases: number;
    population: number;
    rainfall: number;
    temperature: number;
    healthFacilities: number;
    diseases: { name: string; cases: number; trend: "up" | "down" | "stable" }[];
  } | null;
  onClose: () => void;
}

const riskConfig = {
  low: { color: "text-success", bg: "bg-success/10", border: "border-success/30", label: "Low Risk" },
  medium: { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30", label: "Medium Risk" },
  high: { color: "text-warning", bg: "bg-warning/10", border: "border-warning/30", label: "High Risk" },
  critical: { color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30", label: "Critical" },
};

export const StateDetail = ({ state, onClose }: StateDetailProps) => {
  return (
    <AnimatePresence>
      {state && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
          className="bg-card-gradient rounded-xl border border-border p-6 shadow-lg"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold font-display text-foreground">
                  {state.name}
                </h3>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold uppercase border",
                    riskConfig[state.riskLevel].bg,
                    riskConfig[state.riskLevel].border,
                    riskConfig[state.riskLevel].color
                  )}
                >
                  {riskConfig[state.riskLevel].label}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                State Code: {state.id} • Real-time health intelligence
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="shrink-0 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-secondary/50 rounded-lg p-4 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Population</span>
              </div>
              <p className="text-xl font-bold text-foreground">
                {(state.population / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Thermometer className="h-4 w-4 text-warning" />
                <span className="text-xs text-muted-foreground">Avg Temp</span>
              </div>
              <p className="text-xl font-bold text-foreground">{state.temperature}°C</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-muted-foreground">Rainfall</span>
              </div>
              <p className="text-xl font-bold text-foreground">{state.rainfall}mm</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-4 w-4 text-success" />
                <span className="text-xs text-muted-foreground">Health Centers</span>
              </div>
              <p className="text-xl font-bold text-foreground">
                {state.healthFacilities.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Disease Breakdown */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              Active Disease Tracking
            </h4>
            <div className="space-y-3">
              {state.diseases.map((disease, index) => (
                <motion.div
                  key={disease.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/30"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        disease.trend === "up" ? "bg-destructive" : disease.trend === "down" ? "bg-success" : "bg-muted-foreground"
                      )}
                    />
                    <span className="text-sm font-medium text-foreground">
                      {disease.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">
                      {disease.cases.toLocaleString()}
                    </span>
                    {disease.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-destructive" />
                    ) : disease.trend === "down" ? (
                      <TrendingDown className="h-4 w-4 text-success" />
                    ) : null}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
