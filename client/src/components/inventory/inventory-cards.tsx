import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import type { Product, Category } from "@shared/schema";

interface InventoryCardsProps {
  products: Product[];
  categories: Category[];
}

export default function InventoryCards({ products, categories }: InventoryCardsProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        const status = getStockStatus(product);
        return (
          <div key={product.id} className="inventory-card">
            <div className="flex items-center justify-between mb-4">
              <Badge variant={status.variant}>{status.label}</Badge>
              <div className="flex space-x-2">
                <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-primary">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{product.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Código: {product.code} | {getCategoryName(product.category_id)}
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(product.price)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Estoque: {product.stock_quantity} un
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
