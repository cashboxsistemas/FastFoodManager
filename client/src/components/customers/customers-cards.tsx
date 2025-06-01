import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Phone, Mail, User } from "lucide-react";
import type { Customer } from "@shared/schema";

interface CustomersCardsProps {
  customers: Customer[];
}

export default function CustomersCards({ customers }: CustomersCardsProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return "—";
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
  };

  const formatPhone = (phone: string | null) => {
    if (!phone) return "—";
    return phone;
  };

  const formatCPF = (cpf: string | null) => {
    if (!cpf) return "—";
    return cpf;
  };

  if (customers.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Nenhum cliente encontrado</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {customers.map((customer) => (
        <div key={customer.id} className="inventory-card">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="default">Ativo</Badge>
            <div className="flex space-x-2">
              <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-primary">
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center mb-3">
            <div className="p-2 bg-primary/10 rounded-full mr-3">
              <User className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{customer.name}</h3>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="font-medium w-16">CPF:</span>
              <span>{formatCPF(customer.cpf)}</span>
            </div>
            
            {customer.phone && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="mr-2 h-3 w-3" />
                <span>{formatPhone(customer.phone)}</span>
              </div>
            )}
            
            {customer.email && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="mr-2 h-3 w-3" />
                <span className="truncate">{customer.email}</span>
              </div>
            )}
          </div>
          
          <div className="pt-3 border-t border-border">
            <div className="text-xs text-muted-foreground">
              Cadastro: {formatDate(customer.created_at)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}