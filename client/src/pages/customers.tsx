import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CustomersTable from "@/components/customers/customers-table";
import CustomersCards from "@/components/customers/customers-cards";
import CustomerModal from "@/components/customers/customer-modal";
import { Table, LayoutGrid, Plus, Search, Users } from "lucide-react";
import type { Customer } from "@shared/schema";

export default function Customers() {
  const [view, setView] = useState<"table" | "cards">("table");
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const { data: customers, isLoading } = useQuery({
    queryKey: ["/api/customers"],
  });

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCustomer(null);
  };

  const filteredCustomers = customers?.filter((customer: Customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.cpf?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCustomers = filteredCustomers?.sort((a: Customer, b: Customer) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "date":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Clientes</h1>
            <p className="text-muted-foreground">Gerencie sua base de clientes</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando clientes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Clientes</h1>
          </div>
          <p className="text-muted-foreground">
            Gerencie sua base de clientes - {customers?.length || 0} clientes cadastrados
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} className="cashbox-button-primary">
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nome, CPF ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nome</SelectItem>
              <SelectItem value="date">Data de Cadastro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2 bg-muted p-1 rounded-lg">
          <Button
            variant={view === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("table")}
            className={view === "table" ? "cashbox-button-primary" : ""}
          >
            <Table className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "cards" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("cards")}
            className={view === "cards" ? "cashbox-button-primary" : ""}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Customer List */}
      {customers && customers.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border">
          <Users className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum cliente cadastrado</h3>
          <p className="text-muted-foreground mb-6">
            Comece cadastrando seu primeiro cliente para começar a usar o sistema.
          </p>
          <Button onClick={() => setShowModal(true)} className="cashbox-button-primary">
            <Plus className="mr-2 h-4 w-4" />
            Cadastrar Primeiro Cliente
          </Button>
        </div>
      ) : (
        <>
          {view === "table" ? (
            <CustomersTable customers={sortedCustomers || []} onEditCustomer={handleEditCustomer} />
          ) : (
            <CustomersCards customers={sortedCustomers || []} onEditCustomer={handleEditCustomer} />
          )}
        </>
      )}

      {/* Customer Modal */}
      <CustomerModal open={showModal} onOpenChange={handleCloseModal} customer={editingCustomer} />
    </div>
  );
}