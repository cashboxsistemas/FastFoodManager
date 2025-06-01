import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, AlertTriangle, Users, TrendingUp } from "lucide-react";
import { SalesChart, TopProductsChart } from "@/components/reports/charts";

export default function Dashboard() {
  const { data: dailySales } = useQuery({
    queryKey: ["/api/analytics/daily-sales"],
  });

  const { data: lowStockProducts } = useQuery({
    queryKey: ["/api/products/low-stock"],
  });

  const { data: topProducts } = useQuery({
    queryKey: ["/api/analytics/top-products", 5],
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Visão geral do seu negócio</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="cashbox-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vendas Hoje</p>
                <p className="text-3xl font-bold text-foreground">
                  {dailySales ? formatCurrency(dailySales.total) : "R$ 0,00"}
                </p>
                <p className="text-sm text-secondary flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12.5%
                </p>
              </div>
              <div className="p-3 bg-secondary/10 rounded-full">
                <DollarSign className="text-secondary h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cashbox-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Transações Hoje</p>
                <p className="text-3xl font-bold text-foreground">
                  {dailySales ? dailySales.count : 0}
                </p>
                <p className="text-sm text-secondary flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8.3%
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <ShoppingCart className="text-primary h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cashbox-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estoque Baixo</p>
                <p className="text-3xl font-bold text-foreground">
                  {lowStockProducts ? lowStockProducts.length : 0}
                </p>
                <p className="text-sm text-destructive flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Atenção
                </p>
              </div>
              <div className="p-3 bg-destructive/10 rounded-full">
                <AlertTriangle className="text-destructive h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cashbox-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ticket Médio</p>
                <p className="text-3xl font-bold text-foreground">
                  {dailySales && dailySales.count > 0 ? 
                    formatCurrency(dailySales.total / dailySales.count) : 
                    "R$ 0,00"
                  }
                </p>
                <p className="text-sm text-secondary flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +15.2%
                </p>
              </div>
              <div className="p-3 bg-accent/10 rounded-full">
                <Users className="text-accent h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="cashbox-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Vendas dos Últimos 7 Dias</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesChart />
          </CardContent>
        </Card>

        <Card className="cashbox-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Produtos Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <TopProductsChart data={topProducts} />
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts && lowStockProducts.length > 0 && (
        <Card className="cashbox-card border-destructive/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-destructive flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Produtos com Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-sm text-muted-foreground">Código: {product.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-destructive">{product.stock_quantity} un</p>
                    <p className="text-xs text-muted-foreground">Mín: {product.min_stock}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
