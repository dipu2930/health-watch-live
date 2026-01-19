import { motion } from "framer-motion";
import { Languages, Newspaper, Twitter, Radio, TrendingUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Signal {
  id: string;
  source: "news" | "social" | "radio";
  language: string;
  content: string;
  location: string;
  sentiment: "positive" | "negative" | "neutral";
  relevance: number;
  timestamp: string;
}

interface NLPSurveillanceProps {
  signals: Signal[];
}

const sourceIcons = {
  news: Newspaper,
  social: Twitter,
  radio: Radio,
};

const languageColors: Record<string, string> = {
  Hindi: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Bengali: "bg-green-500/20 text-green-400 border-green-500/30",
  Tamil: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Telugu: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Marathi: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  English: "bg-primary/20 text-primary border-primary/30",
};

export const NLPSurveillance = ({ signals }: NLPSurveillanceProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-card-gradient rounded-xl border border-border p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Languages className="h-5 w-5 text-primary" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-success animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-semibold font-display text-foreground">
              Multilingual NLP Surveillance
            </h3>
            <p className="text-xs text-muted-foreground">
              Real-time health signal detection across 6 languages
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Radio className="h-3 w-3 text-success animate-pulse" />
          Live
        </div>
      </div>

      {/* Language distribution */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {Object.entries(languageColors).map(([lang, color]) => (
          <span
            key={lang}
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium border",
              color
            )}
          >
            {lang}
          </span>
        ))}
      </div>

      {/* Signal feed */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
        {signals.map((signal, index) => {
          const SourceIcon = sourceIcons[signal.source];
          const langColor = languageColors[signal.language] || languageColors.English;

          return (
            <motion.div
              key={signal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="relative bg-secondary/50 rounded-lg p-4 border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 rounded-lg bg-muted p-2">
                  <SourceIcon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium border", langColor)}>
                      {signal.language}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {signal.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-foreground line-clamp-2 mb-2">
                    "{signal.content}"
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      📍 {signal.location}
                    </span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-primary" />
                      <span className="text-xs font-medium text-primary">
                        {signal.relevance}% relevant
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Relevance indicator bar */}
              <div className="absolute bottom-0 left-0 h-0.5 bg-primary/30 rounded-b-lg" style={{ width: `${signal.relevance}%` }} />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
