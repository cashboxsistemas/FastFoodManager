import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";
import type { Product, Category } from "@shared/schema";

interface InventoryTableProps {
  products: Product[];
  categories: Category[];
}

export default function InventoryTable({ products, categories }: InventoryTableProps) {
  const formatCurrency = (value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue);
  };

  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId) return "Sem categoria";
    const category = categories.find(c => c.id === categoryId);
    return category?.name || "Categoria não encontrada";
  };

  const getStockStatus = (product: Product) => {
    if (product.stock_quantity === 0) {
      return { label: "Sem estoque", variant: "destructive" as const };
    } else if (product.stock_quantity <= product.min_stock) {
      return { label: "Estoque baixo", variant: "secondary" as const };
    } else {
      return { label: "Em estoque", variant: "default" as const };
    }
  };

  return (
    <Card className="cashbox-card">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const status = getStockStatus(product);
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="font-medium text-foreground">{product.name}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{product.code}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {getCategoryName(product.category_id)}
                    </TableCell>
                    <TableCell className="font-medium">{product.stock_quantity}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(product.price)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
