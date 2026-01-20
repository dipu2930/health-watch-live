import { motion } from "framer-motion";
import { Shield, Bell, Search, User, Menu, Globe, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAlerts } from "@/hooks/useDashboardData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const { user, signOut } = useAuth();
  const { data: alerts } = useAlerts();
  const navigate = useNavigate();
  
  const alertCount = alerts?.length || 0;

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo Section */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success border-2 border-background" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold font-display tracking-tight text-foreground">
                BHARAT-NIDHI
              </h1>
              <p className="text-[10px] text-muted-foreground leading-none">
                National Health Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Center - Government Badge */}
        <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/50 border border-border">
          <Globe className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">
            Ministry of Health & Family Welfare
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex text-muted-foreground hover:text-foreground"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-5 w-5" />
            {alertCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-destructive flex items-center justify-center text-[10px] font-bold text-destructive-foreground">
                {alertCount > 9 ? "9+" : alertCount}
              </span>
            )}
          </Button>

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium">Health Official</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => navigate("/auth")}
            >
              <LogIn className="h-5 w-5" />
            </Button>
          )}

          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
};
