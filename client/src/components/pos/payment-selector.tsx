import { Label } from "@/components/ui/label";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { Banknote, CreditCard, QrCode } from "lucide-react";

const paymentMethods = [
  { id: "cash", name: "Dinheiro", icon: Banknote, color: "text-secondary" },
  { id: "card", name: "Cartão", icon: CreditCard, color: "text-primary" },
  { id: "pix", name: "PIX", icon: QrCode, color: "text-accent" },
];

export default function PaymentSelector() {
  const { paymentMethod, setPaymentMethod } = useCart();

  return (
    <div>
      <Label className="block text-sm font-medium text-foreground mb-3">Forma de Pagamento</Label>
      <div className="grid grid-cols-3 gap-2">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = paymentMethod === method.id;
          
          return (
            <button
              key={method.id}
              onClick={() => setPaymentMethod(method.id)}
              className={cn(
                "p-3 border rounded-lg text-center transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              )}
            >
              <Icon className={cn("block mx-auto mb-1 h-5 w-5", method.color)} />
              <span className="text-xs font-medium">{method.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
