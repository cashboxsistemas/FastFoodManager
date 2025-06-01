import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { Search } from "lucide-react";
import type { Product } from "@shared/schema";

export default function ProductSearch() {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { addToCart } = useCart();

  const { data: searchResults } = useQuery({
    queryKey: ["/api/products/search", { q: query }],
    enabled: query.length >= 2,
  });

  useEffect(() => {
    setShowResults(query.length >= 2 && searchResults && searchResults.length > 0);
  }, [query, searchResults]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setQuery("");
    setShowResults(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchResults && searchResults.length === 1) {
      handleAddToCart(searchResults[0]);
    }
  };

  const formatCurrency = (value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue);
  };

  return (
    <div className="relative">
      <Label htmlFor="productSearch" className="block text-sm font-medium text-foreground mb-2">
        Buscar Produto <span className="text-muted-foreground">(F2)</span>
      </Label>
      <div className="relative">
        <Input
          id="productSearch"
          placeholder="Digite o nome ou código do produto"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      </div>

      {showResults && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 shadow-lg">
          <CardContent className="p-3">
            <h4 className="font-medium text-foreground mb-3">Resultados da Busca:</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              {searchResults?.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleAddToCart(product)}
                  className="w-full p-3 text-left border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-foreground">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {product.code} | Estoque: {product.stock_quantity}
                      </div>
                    </div>
                    <div className="text-primary font-semibold">
                      {formatCurrency(product.price)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
