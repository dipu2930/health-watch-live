import { motion } from "framer-motion";

interface StateData {
  id: string;
  name: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  cases: number;
  path: string;
}

interface IndiaMapProps {
  onStateClick: (stateId: string) => void;
  selectedState: string | null;
  statesData: StateData[];
}

const getRiskColor = (riskLevel: string) => {
  switch (riskLevel) {
    case "critical":
      return "fill-destructive";
    case "high":
      return "fill-warning";
    case "medium":
      return "fill-yellow-500";
    case "low":
      return "fill-success";
    default:
      return "fill-muted";
  }
};

// Simplified India map paths for major states
const statesPaths: StateData[] = [
  { id: "RJ", name: "Rajasthan", riskLevel: "high", cases: 2847, path: "M120,180 L180,160 L200,200 L180,260 L120,280 L80,240 Z" },
  { id: "UP", name: "Uttar Pradesh", riskLevel: "critical", cases: 5234, path: "M200,180 L280,160 L300,200 L280,240 L200,260 L180,220 Z" },
  { id: "MP", name: "Madhya Pradesh", riskLevel: "medium", cases: 1456, path: "M140,280 L260,260 L280,320 L220,360 L120,340 Z" },
  { id: "MH", name: "Maharashtra", riskLevel: "high", cases: 3892, path: "M100,340 L220,320 L240,400 L160,440 L80,400 Z" },
  { id: "GJ", name: "Gujarat", riskLevel: "low", cases: 567, path: "M40,240 L120,220 L140,300 L100,340 L20,320 Z" },
  { id: "KA", name: "Karnataka", riskLevel: "medium", cases: 1234, path: "M100,440 L180,420 L200,500 L140,540 L80,500 Z" },
  { id: "TN", name: "Tamil Nadu", riskLevel: "low", cases: 789, path: "M140,540 L200,520 L220,600 L160,640 L120,600 Z" },
  { id: "KL", name: "Kerala", riskLevel: "low", cases: 456, path: "M100,560 L140,540 L160,620 L120,660 L80,620 Z" },
  { id: "AP", name: "Andhra Pradesh", riskLevel: "medium", cases: 1678, path: "M180,440 L260,420 L280,520 L200,560 L160,500 Z" },
  { id: "TS", name: "Telangana", riskLevel: "high", cases: 2345, path: "M180,380 L260,360 L280,420 L220,460 L160,420 Z" },
  { id: "OR", name: "Odisha", riskLevel: "low", cases: 678, path: "M280,340 L340,320 L360,400 L300,440 L260,400 Z" },
  { id: "WB", name: "West Bengal", riskLevel: "critical", cases: 4567, path: "M320,260 L360,240 L380,340 L340,380 L300,320 Z" },
  { id: "BR", name: "Bihar", riskLevel: "high", cases: 3456, path: "M280,220 L340,200 L360,260 L320,300 L260,280 Z" },
  { id: "JH", name: "Jharkhand", riskLevel: "medium", cases: 1890, path: "M300,280 L360,260 L380,320 L340,360 L280,340 Z" },
  { id: "AS", name: "Assam", riskLevel: "high", cases: 2890, path: "M380,200 L460,180 L480,240 L420,280 L360,260 Z" },
  { id: "PB", name: "Punjab", riskLevel: "low", cases: 345, path: "M160,100 L200,80 L220,140 L180,180 L140,160 Z" },
  { id: "HR", name: "Haryana", riskLevel: "medium", cases: 1234, path: "M180,140 L220,120 L240,180 L200,220 L160,200 Z" },
  { id: "DL", name: "Delhi", riskLevel: "critical", cases: 6789, path: "M200,160 L220,150 L230,180 L210,200 L190,190 Z" },
];

export const IndiaMap = ({ onStateClick, selectedState, statesData }: IndiaMapProps) => {
  const mergedStates = statesPaths.map((state) => {
    const data = statesData.find((s) => s.id === state.id);
    return data ? { ...state, ...data } : state;
  });

  return (
    <div className="relative w-full aspect-[3/4] max-w-lg mx-auto">
      <svg
        viewBox="0 0 500 700"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 0 20px hsl(168 84% 45% / 0.2))" }}
      >
        {/* Background glow */}
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(168 84% 45% / 0.1)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="0" y="0" width="500" height="700" fill="url(#mapGlow)" />

        {/* India outline glow */}
        <ellipse cx="250" cy="350" rx="200" ry="280" fill="none" stroke="hsl(168 84% 45% / 0.1)" strokeWidth="40" />

        {/* States */}
        {mergedStates.map((state, index) => (
          <motion.path
            key={state.id}
            d={state.path}
            className={`${getRiskColor(state.riskLevel)} cursor-pointer transition-all duration-300 ${
              selectedState === state.id ? "stroke-primary stroke-[3]" : "stroke-border stroke-1"
            }`}
            style={{ opacity: selectedState && selectedState !== state.id ? 0.5 : 1 }}
            onClick={() => onStateClick(state.id)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            whileHover={{ scale: 1.05, filter: "brightness(1.2)" }}
            filter={state.riskLevel === "critical" ? "url(#glow)" : undefined}
          />
        ))}

        {/* State labels */}
        {mergedStates.map((state) => {
          const pathMatch = state.path.match(/M(\d+),(\d+)/);
          if (!pathMatch) return null;
          const x = parseInt(pathMatch[1]) + 30;
          const y = parseInt(pathMatch[2]) + 40;
          return (
            <text
              key={`label-${state.id}`}
              x={x}
              y={y}
              className="fill-foreground text-[10px] font-medium pointer-events-none"
              textAnchor="middle"
            >
              {state.id}
            </text>
          );
        })}
      </svg>

      {/* Radar sweep effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full opacity-30">
        <div
          className="absolute top-1/2 left-1/2 w-1/2 h-1 bg-gradient-to-r from-primary to-transparent origin-left radar-sweep"
          style={{ transform: "translateY(-50%)" }}
        />
      </div>
    </div>
  );
};

export { statesPaths };
export type { StateData };
