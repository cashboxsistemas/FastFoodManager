import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { ScanBarcode, Boxes, ChartLine, Play, Rocket, X } from "lucide-react";

export default function Landing() {
  const [showLogin, setShowLogin] = useState(false);
  const { login, isLoading } = useAuth();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    try {
      await login(username, password);
      setShowLogin(false);
    } catch (error) {
      // Error is already handled in the login mutation
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <ScanBarcode className="text-primary text-2xl mr-3" />
                <h1 className="text-2xl font-bold text-foreground">CashBoxFood</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Recursos</a>
              <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">Preços</a>
              <Button onClick={() => setShowLogin(true)} className="cashbox-button-primary">
                Entrar
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080" 
            alt="Modern restaurant interior" 
            className="w-full h-full object-cover opacity-10" 
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Gerencie sua lanchonete com
              <span className="text-primary"> simplicidade</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Sistema completo para controle de estoque, vendas e relatórios financeiros. 
              Desenvolvido especialmente para microempreendedores do setor alimentício.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => setShowLogin(true)} size="lg" className="cashbox-button-primary">
                <Rocket className="mr-2 h-5 w-5" />
                Começar Agora
              </Button>
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Play className="mr-2 h-5 w-5" />
                Ver Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Recursos Principais</h2>
            <p className="text-xl text-muted-foreground">Tudo que você precisa para gerenciar seu negócio</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400" 
                alt="Point of sale system" 
                className="w-full h-48 object-cover rounded-xl mb-6" 
              />
              <ScanBarcode className="text-primary mx-auto mb-4 h-12 w-12" />
              <h3 className="text-xl font-semibold text-foreground mb-3">PDV Intuitivo</h3>
              <p className="text-muted-foreground">Interface de vendas rápida com suporte a código de barras e atalhos de teclado.</p>
            </div>
            <div className="text-center p-6">
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400" 
                alt="Digital inventory management" 
                className="w-full h-48 object-cover rounded-xl mb-6" 
              />
              <Boxes className="text-secondary mx-auto mb-4 h-12 w-12" />
              <h3 className="text-xl font-semibold text-foreground mb-3">Controle de Estoque</h3>
              <p className="text-muted-foreground">Gerencie seu inventário com alertas automáticos e importação por XML.</p>
            </div>
            <div className="text-center p-6">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400" 
                alt="Business analytics dashboard" 
                className="w-full h-48 object-cover rounded-xl mb-6" 
              />
              <ChartLine className="text-accent mx-auto mb-4 h-12 w-12" />
              <h3 className="text-xl font-semibold text-foreground mb-3">Relatórios Detalhados</h3>
              <p className="text-muted-foreground">Análises completas de vendas, fluxo de caixa e performance dos produtos.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <ScanBarcode className="text-primary mx-auto mb-4 h-12 w-12" />
                <DialogTitle className="text-2xl font-bold text-foreground">Entrar no CashBoxFood</DialogTitle>
                <p className="text-muted-foreground mt-2">Acesse seu painel de controle</p>
              </div>
            </div>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email"
                name="email"
                type="email" 
                defaultValue="demo@cashboxfood.com"
                required 
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password"
                name="password"
                type="password" 
                defaultValue="demo123"
                required 
              />
            </div>
            <Button type="submit" className="w-full cashbox-button-primary" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
