import { motion } from "framer-motion";
import { Activity, Shield, Zap, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onExplore: () => void;
}

export const HeroSection = ({ onExplore }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden py-16 lg:py-24">
      {/* Background effects */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(168_84%_45%_/_0.08)_0%,_transparent_70%)]" />
      
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(168 84% 45%) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(168 84% 45%) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Animated circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-primary/20"
            style={{
              width: `${300 + i * 150}px`,
              height: `${300 + i * 150}px`,
              left: `${-(300 + i * 150) / 2}px`,
              top: `${-(300 + i * 150) / 2}px`,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 4,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Real-time Epidemic Surveillance System
            </span>
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight mb-6"
          >
            <span className="text-foreground">Nationwide Integrated</span>
            <br />
            <span className="text-gradient">Disease & Health Intelligence</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            AI-powered predictive analytics for epidemic outbreak forecasting across all 28 states 
            of India with multilingual health surveillance.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              onClick={onExplore}
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold px-8 py-6 text-base glow-primary hover:scale-105 transition-transform"
            >
              <Globe2 className="h-5 w-5 mr-2" />
              Explore National Dashboard
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border text-foreground hover:bg-secondary px-8 py-6 text-base"
            >
              <Shield className="h-5 w-5 mr-2" />
              View Alerts
            </Button>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto"
          >
            {[
              { value: "28", label: "States Monitored" },
              { value: "6+", label: "Languages Analyzed" },
              { value: "24/7", label: "Live Surveillance" },
              { value: "15", label: "Disease Types" },
            ].map((stat, index) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold font-display text-gradient">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
