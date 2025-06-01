import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ScanBarcode, User, LogOut } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <ScanBarcode className="text-primary mr-3 h-8 w-8" />
          <h1 className="text-2xl font-bold text-foreground">CashBoxFood</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground flex items-center">
            <User className="mr-1 h-4 w-4" />
            {user?.username || "Demo User"}
          </div>
          <Button 
            onClick={logout} 
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
