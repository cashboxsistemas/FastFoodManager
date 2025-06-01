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
    <nav className="bg-white border-b border-border">
      <div className="px-6">
        <div className="flex space-x-8">
          {navigation.map((item) => {
            const isActive = location === item.path || (item.path === "/dashboard" && location === "/");
            const Icon = item.icon;
            
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex items-center py-4 border-b-2 font-semibold transition-colors",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-primary"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.name}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
