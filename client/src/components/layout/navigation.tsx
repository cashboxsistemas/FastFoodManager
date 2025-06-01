import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BarChart3, ScanBarcode, Boxes, TrendingUp, Users, Menu, X } from "lucide-react";

const navigation = [
  { name: "Dashboard", path: "/dashboard", icon: TrendingUp },
  { name: "PDV", path: "/pos", icon: ScanBarcode },
  { name: "Estoque", path: "/inventory", icon: Boxes },
  { name: "Clientes", path: "/customers", icon: Users },
  { name: "Relatórios", path: "/reports", icon: BarChart3 },
];

export default function Navigation() {
  const [location, navigate] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Auto-collapse on POS page
  useEffect(() => {
    if (location === "/pos") {
      setIsCollapsed(true);
    }
  }, [location]);

  return (
    <div className={cn(
      "bg-white border-r border-border transition-all duration-300 flex-shrink-0",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Toggle Button */}
      <div className="flex justify-end p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Navigation Items */}
      <nav className="px-2">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path || (item.path === "/dashboard" && location === "/");
            
            return (
              <Button
                key={item.path}
                variant={isActive ? "default" : "ghost"}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full justify-start",
                  isActive && "cashbox-button-primary",
                  isCollapsed && "px-2"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                {!isCollapsed && <span>{item.name}</span>}
              </Button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}