import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InventoryTable from "@/components/inventory/inventory-table";
import InventoryCards from "@/components/inventory/inventory-cards";
import XMLImportModal from "@/components/inventory/xml-import-modal";
import { Table, LayoutGrid, Upload, Plus, Search } from "lucide-react";

export default function Inventory() {
  const [view, setView] = useState<"table" | "cards">("table");
  const [showXMLImport, setShowXMLImport] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const filteredProducts = products?.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.code.includes(searchQuery);
    
    const matchesCategory = categoryFilter === "all" || product.category_id?.toString() === categoryFilter;
    
    let matchesStatus = true;
    if (statusFilter === "in-stock") {
      matchesStatus = product.stock_quantity > product.min_stock;
    } else if (statusFilter === "low-stock") {
      matchesStatus = product.stock_quantity <= product.min_stock && product.stock_quantity > 0;
    } else if (statusFilter === "out-of-stock") {
      matchesStatus = product.stock_quantity === 0;
    }
    
    return matchesSearch && matchesCategory && matchesStatus;
  }) || [];

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Controle de Estoque</h2>
            <p className="text-muted-foreground">Gerencie seus produtos e inventário</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-white rounded-lg border border-border p-1">
              <Button
                onClick={() => setView("table")}
                variant={view === "table" ? "default" : "ghost"}
                size="sm"
                className={view === "table" ? "cashbox-button-primary" : ""}
              >
                <Table className="mr-1 h-4 w-4" />
                Tabela
              </Button>
              <Button
                onClick={() => setView("cards")}
                variant={view === "cards" ? "default" : "ghost"}
                size="sm"
                className={view === "cards" ? "cashbox-button-primary" : ""}
              >
                <LayoutGrid className="mr-1 h-4 w-4" />
                Cards
              </Button>
            </div>
            <Button onClick={() => setShowXMLImport(true)} className="cashbox-button-accent">
              <Upload className="mr-2 h-4 w-4" />
              Importar XML
            </Button>
            <Button className="cashbox-button-primary">
              <Plus className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          </div>
        </div>
      </div>

      {/* Inventory Filters */}
      <Card className="cashbox-card mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Buscar</label>
              <div className="relative">
                <Input
                  placeholder="Nome ou código"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Categoria</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="in-stock">Em estoque</SelectItem>
                  <SelectItem value="low-stock">Estoque baixo</SelectItem>
                  <SelectItem value="out-of-stock">Sem estoque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full cashbox-button-primary">
                <Search className="mr-2 h-4 w-4" />
                Filtrar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Display */}
      {isLoading ? (
        <Card className="cashbox-card">
          <CardContent className="p-6">
            <div className="text-center">Carregando produtos...</div>
          </CardContent>
        </Card>
      ) : view === "table" ? (
        <InventoryTable products={filteredProducts} categories={categories || []} />
      ) : (
        <InventoryCards products={filteredProducts} categories={categories || []} />
      )}

      {/* XML Import Modal */}
      <XMLImportModal open={showXMLImport} onOpenChange={setShowXMLImport} />
    </div>
  );
}
