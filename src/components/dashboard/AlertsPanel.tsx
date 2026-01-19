import { motion } from "framer-motion";
import { AlertTriangle, AlertCircle, Info, Bell, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  location: string;
  time: string;
  description: string;
}

interface AlertsPanelProps {
  alerts: Alert[];
}

const alertConfig = {
  critical: {
    icon: AlertTriangle,
    bg: "bg-gradient-to-r from-destructive/20 to-destructive/5",
    border: "border-destructive/50",
    iconBg: "bg-destructive/20",
    iconColor: "text-destructive",
    badge: "bg-destructive text-destructive-foreground",
  },
  warning: {
    icon: AlertCircle,
    bg: "bg-gradient-to-r from-warning/20 to-warning/5",
    border: "border-warning/50",
    iconBg: "bg-warning/20",
    iconColor: "text-warning",
    badge: "bg-warning text-warning-foreground",
  },
  info: {
    icon: Info,
    bg: "bg-gradient-to-r from-primary/20 to-primary/5",
    border: "border-primary/50",
    iconBg: "bg-primary/20",
    iconColor: "text-primary",
    badge: "bg-primary text-primary-foreground",
  },
};

export const AlertsPanel = ({ alerts }: AlertsPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-card-gradient rounded-xl border border-border p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="h-5 w-5 text-primary" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive animate-pulse" />
          </div>
          <h3 className="text-lg font-semibold font-display text-foreground">
            Live Alerts
          </h3>
        </div>
        <span className="text-xs text-muted-foreground">
          {alerts.length} active
        </span>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {alerts.map((alert, index) => {
          const config = alertConfig[alert.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative rounded-lg border p-4 transition-all hover:scale-[1.02]",
                config.bg,
                config.border
              )}
            >
              <div className="flex gap-4">
                <div
                  className={cn(
                    "shrink-0 rounded-lg p-2 h-fit",
                    config.iconBg
                  )}
                >
                  <Icon className={cn("h-4 w-4", config.iconColor)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-sm text-foreground truncate">
                      {alert.title}
                    </h4>
                    <span
                      className={cn(
                        "shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full",
                        config.badge
                      )}
                    >
                      {alert.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {alert.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {alert.location}
                    </span>
                    <span>{alert.time}</span>
                  </div>
                </div>
              </div>

              {/* Pulse effect for critical alerts */}
              {alert.type === "critical" && (
                <div className="absolute inset-0 rounded-lg border-2 border-destructive/30 animate-pulse-glow pointer-events-none" />
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
