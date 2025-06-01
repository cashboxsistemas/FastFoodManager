import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaymentMethodsChart, CategoryPerformanceChart, CashFlowChart } from "@/components/reports/charts";
import { Download, CreditCard, PieChart, TrendingUp } from "lucide-react";

export default function Reports() {
  const [period, setPeriod] = useState("today");
  const [reportType, setReportType] = useState("sales");
  const [format, setFormat] = useState("pdf");

  const { data: dailySales } = useQuery({
    queryKey: ["/api/analytics/daily-sales"],
  });

  const { data: sales } = useQuery({
    queryKey: ["/api/sales"],
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Mock recent sales for demonstration
  const recentSales = [
    { id: 1, time: "14:30", customer: "João Silva", products: "X-Burger, Refrigerante", payment: "Cartão", total: 21.40 },
    { id: 2, time: "14:25", customer: "Consumidor Final", products: "Batata Frita, Água", payment: "Dinheiro", total: 11.90 },
    { id: 3, time: "14:15", customer: "Maria Santos", products: "X-Salada, Suco Natural", payment: "PIX", total: 20.40 },
    { id: 4, time: "14:10", customer: "Pedro Costa", products: "X-Burger Completo", payment: "Cartão", total: 15.90 },
    { id: 5, time: "14:05", customer: "Consumidor Final", products: "Refrigerante", payment: "Dinheiro", total: 5.50 },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground mb-2">Relatórios</h2>
        <p className="text-muted-foreground">Análises detalhadas de vendas e performance</p>
      </div>

      {/* Report Filters */}
      <Card className="cashbox-card mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Período</label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Últimos 7 dias</SelectItem>
                  <SelectItem value="month">Últimos 30 dias</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tipo de Relatório</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Vendas</SelectItem>
                  <SelectItem value="products">Produtos</SelectItem>
                  <SelectItem value="financial">Financeiro</SelectItem>
                  <SelectItem value="customers">Clientes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Formato</label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full cashbox-button-primary">
                <Download className="mr-2 h-4 w-4" />
                Gerar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="cashbox-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-foreground">Vendas por Pagamento</CardTitle>
              <CreditCard className="text-primary h-6 w-6" />
            </div>
          </CardHeader>
          <CardContent>
            <PaymentMethodsChart data={dailySales?.payment_methods} />
          </CardContent>
        </Card>

        <Card className="cashbox-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-foreground">Performance por Categoria</CardTitle>
              <PieChart className="text-accent h-6 w-6" />
            </div>
          </CardHeader>
          <CardContent>
            <CategoryPerformanceChart />
          </CardContent>
        </Card>

        <Card className="cashbox-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-foreground">Fluxo de Caixa</CardTitle>
              <TrendingUp className="text-secondary h-6 w-6" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Entradas</span>
                <span className="text-lg font-semibold text-secondary">
                  {dailySales ? formatCurrency(dailySales.total) : "R$ 0,00"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Saídas</span>
                <span className="text-lg font-semibold text-destructive">R$ 320,00</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">Saldo</span>
                  <span className="text-xl font-bold text-primary">
                    {dailySales ? formatCurrency(dailySales.total - 320) : "R$ 0,00"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports Table */}
      <Card className="cashbox-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Vendas Detalhadas - Hoje</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hora</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Produtos</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-mono">{sale.time}</TableCell>
                  <TableCell>{sale.customer}</TableCell>
                  <TableCell className="text-muted-foreground">{sale.products}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      sale.payment === "Cartão" ? "bg-blue-100 text-blue-800" :
                      sale.payment === "Dinheiro" ? "bg-green-100 text-green-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {sale.payment}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(sale.total)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
