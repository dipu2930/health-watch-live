import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp, Calendar, AlertTriangle } from "lucide-react";

interface PredictionData {
  date: string;
  actual: number;
  predicted: number;
  lower: number;
  upper: number;
}

interface PredictionChartProps {
  data: PredictionData[];
  disease: string;
  state: string;
}

export const PredictionChart = ({ data, disease, state }: PredictionChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card-gradient rounded-xl border border-border p-6 shadow-lg"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold font-display text-foreground">
              Outbreak Prediction
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {disease} forecast for {state}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/30">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <span className="text-xs font-medium text-warning">
            Surge predicted in 14 days
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-muted-foreground">Actual Cases</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-warning" />
          <span className="text-muted-foreground">Predicted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-muted-foreground/30" />
          <span className="text-muted-foreground">Confidence Interval</span>
        </div>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(168 84% 39%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(168 84% 39%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(38 92% 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(38 92% 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 20%)" />
            <XAxis
              dataKey="date"
              tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }}
              axisLine={{ stroke: "hsl(220 20% 20%)" }}
            />
            <YAxis
              tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }}
              axisLine={{ stroke: "hsl(220 20% 20%)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220 25% 12%)",
                border: "1px solid hsl(220 20% 20%)",
                borderRadius: "8px",
                color: "hsl(210 40% 98%)",
              }}
            />
            {/* Confidence interval */}
            <Area
              type="monotone"
              dataKey="upper"
              stroke="transparent"
              fill="hsl(220 20% 25%)"
              fillOpacity={0.5}
            />
            <Area
              type="monotone"
              dataKey="lower"
              stroke="transparent"
              fill="hsl(220 30% 6%)"
              fillOpacity={1}
            />
            {/* Actual cases */}
            <Area
              type="monotone"
              dataKey="actual"
              stroke="hsl(168 84% 39%)"
              strokeWidth={2}
              fill="url(#colorActual)"
            />
            {/* Predicted cases */}
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="hsl(38 92% 50%)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
