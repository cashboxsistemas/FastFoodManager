import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCart } from "@/hooks/use-cart";
import PaymentSelector from "./payment-selector";
import { ShoppingCart as ShoppingCartIcon, Trash2, Plus, Minus, Check } from "lucide-react";
import Swal from 'sweetalert2';

export default function ShoppingCart() {
  const { cart, updateQuantity, removeFromCart, clearCart, completeSale, selectedCustomer, setSelectedCustomer, paymentMethod } = useCart();

  const { data: customers } = useQuery({
    queryKey: ["/api/customers"],
  });

  const total = cart.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      Swal.fire({
        title: 'Carrinho Vazio',
        text: 'Adicione produtos ao carrinho antes de finalizar a venda.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (!paymentMethod) {
      Swal.fire({
        title: 'Forma de Pagamento',
        text: 'Selecione uma forma de pagamento antes de finalizar a venda.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    completeSale();
  };

  return (
    <Card className="cashbox-card h-fit">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center">
          <ShoppingCartIcon className="mr-2 h-5 w-5" />
          Carrinho de Compras
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Customer Selection */}
        <div>
          <Label className="block text-sm font-medium text-foreground mb-2">Cliente</Label>
          <Select value={selectedCustomer?.toString() || "0"} onValueChange={(value) => setSelectedCustomer(value === "0" ? null : parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Consumidor Final" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Consumidor Final</SelectItem>
              {customers?.map((customer) => (
                <SelectItem key={customer.id} value={customer.id.toString()}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cart Items */}
        <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
          {cart.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <ShoppingCartIcon className="mx-auto h-12 w-12 mb-2" />
              <p>Carrinho vazio</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.product.id}-${Date.now()}`} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-foreground">{item.product.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(parseFloat(item.product.price))} x {item.quantity}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    size="sm"
                    variant="outline"
                    className="h-6 w-6 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    size="sm"
                    variant="outline"
                    className="h-6 w-6 p-0 text-secondary hover:bg-secondary hover:text-secondary-foreground"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    onClick={() => removeFromCart(item.product.id)}
                    size="sm"
                    variant="outline"
                    className="h-6 w-6 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground ml-2"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Total */}
        <div className="border-t border-border pt-4">
          <div className="flex justify-between items-center text-lg font-semibold text-foreground">
            <span>Total:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <PaymentSelector />

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button onClick={handleCompleteSale} className="w-full cashbox-button-secondary">
            <Check className="mr-2 h-4 w-4" />
            Finalizar Venda
          </Button>
          <Button onClick={clearCart} variant="outline" className="w-full">
            <Trash2 className="mr-2 h-4 w-4" />
            Limpar Carrinho
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
