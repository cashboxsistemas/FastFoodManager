import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertCustomerSchema } from "@shared/schema";
import { User } from "lucide-react";
import type { InsertCustomer, Customer } from "@shared/schema";

interface CustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: Customer | null;
}

export default function CustomerModal({ open, onOpenChange, customer }: CustomerModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!customer;

  const form = useForm<InsertCustomer>({
    resolver: zodResolver(insertCustomerSchema),
    defaultValues: {
      name: customer?.name || "",
      cpf: customer?.cpf || "",
      phone: customer?.phone || "",
      email: customer?.email || "",
    },
  });

  const createCustomerMutation = useMutation({
    mutationFn: async (data: InsertCustomer) => {
      const url = isEditing ? `/api/customers/${customer.id}` : "/api/customers";
      const method = isEditing ? "PATCH" : "POST";
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: isEditing ? "Cliente atualizado!" : "Cliente cadastrado!",
        description: `${data.name} foi ${isEditing ? "atualizado" : "cadastrado"} com sucesso.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: `Erro ao ${isEditing ? "atualizar" : "cadastrar"} cliente`,
        description: `Não foi possível ${isEditing ? "atualizar" : "cadastrar"} o cliente. Tente novamente.`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCustomer) => {
    const cleanData = {
      ...data,
      cpf: data.cpf?.trim() || null,
      phone: data.phone?.trim() || null,
      email: data.email?.trim() || null,
    };
    createCustomerMutation.mutate(cleanData);
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="text-center">
            <User className="text-primary mx-auto mb-4 h-12 w-12" />
            <DialogTitle className="text-2xl font-bold text-foreground">
              {isEditing ? "Editar Cliente" : "Novo Cliente"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              {isEditing ? "Edite as informações do cliente" : "Cadastre um novo cliente"}
            </DialogDescription>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: João Silva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input placeholder="000.000.000-00" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(11) 99999-9999" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="joao@email.com" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-4 pt-4">
              <Button type="button" onClick={handleClose} variant="outline" className="flex-1">
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="flex-1 cashbox-button-primary"
                disabled={createCustomerMutation.isPending}
              >
                {createCustomerMutation.isPending 
                  ? (isEditing ? "Atualizando..." : "Cadastrando...") 
                  : (isEditing ? "Atualizar" : "Cadastrar")
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}