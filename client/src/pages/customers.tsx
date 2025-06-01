import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomersTable from "@/components/customers/customers-table";
import CustomersCards from "@/components/customers/customers-cards";
import CustomerModal from "@/components/customers/customer-modal";
import { Table, LayoutGrid, Plus, Search, Users } from "lucide-react";

export default function Customers() {
  const [view, setView] = useState<"table" | "cards">("table");
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: customers, isLoading } = useQuery({
    queryKey: ["/api/customers"],
  });

  const filteredCustomers = customers?.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (customer.cpf && customer.cpf.includes(searchQuery)) ||
                         (customer.phone && customer.phone.includes(searchQuery));
    return matchesSearch;
  }) || [];

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Gerenciamento de Clientes</h2>
            <p className="text-muted-foreground">Cadastre e gerencie seus clientes</p>
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
            <Button onClick={() => setShowCustomerModal(true)} className="cashbox-button-primary">
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="cashbox-card mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Buscar</label>
              <div className="relative">
                <Input
                  placeholder="Nome, CPF ou telefone"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              </div>
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="cashbox-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Clientes</p>
                <p className="text-3xl font-bold text-foreground">
                  {customers ? customers.length : 0}
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Users className="text-primary h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cashbox-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Com CPF</p>
                <p className="text-3xl font-bold text-foreground">
                  {customers ? customers.filter(c => c.cpf).length : 0}
                </p>
              </div>
              <div className="p-3 bg-secondary/10 rounded-full">
                <Users className="text-secondary h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cashbox-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Com Telefone</p>
                <p className="text-3xl font-bold text-foreground">
                  {customers ? customers.filter(c => c.phone).length : 0}
                </p>
              </div>
              <div className="p-3 bg-accent/10 rounded-full">
                <Users className="text-accent h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers Display */}
      {isLoading ? (
        <Card className="cashbox-card">
          <CardContent className="p-6">
            <div className="text-center">Carregando clientes...</div>
          </CardContent>
        </Card>
      ) : view === "table" ? (
        <CustomersTable customers={filteredCustomers} />
      ) : (
        <CustomersCards customers={filteredCustomers} />
      )}

      {/* Customer Modal */}
      <CustomerModal open={showCustomerModal} onOpenChange={setShowCustomerModal} />
    </div>
  );
}