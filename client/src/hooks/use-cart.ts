import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { saveToLocalStorage, loadFromLocalStorage, STORAGE_KEYS } from "@/lib/local-storage";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

interface CartItem {
  product: Product;
  quantity: number;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const savedCart = loadFromLocalStorage<CartItem[]>(STORAGE_KEYS.CART, []);
    setCart(savedCart);
  }, []);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.CART, cart);
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
    
    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao carrinho.`,
      duration: 3000,
      className: "border-green-500 bg-green-50 text-green-800",
    });
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    toast({
      title: "Produto removido",
      description: "Produto foi removido do carrinho.",
    });
  };

  const clearCart = () => {
    if (cart.length === 0) return;
    
    if (window.confirm("Tem certeza que deseja limpar o carrinho? Todos os itens serão removidos.")) {
      setCart([]);
      setPaymentMethod(null);
      setSelectedCustomer(null);
      toast({
        title: "Carrinho limpo",
        description: "Todos os itens foram removidos do carrinho.",
        duration: 3000,
      });
    }
  };

  const completeSaleMutation = useMutation({
    mutationFn: async () => {
      const total = cart.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);
      
      const sale = {
        customer_id: selectedCustomer,
        total_amount: total.toString(),
        payment_method: paymentMethod!,
        status: "completed",
      };

      const items = cart.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.product.price,
        total_price: (parseFloat(item.product.price) * item.quantity).toString(),
      }));

      const response = await apiRequest("POST", "/api/sales", { sale, items });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Venda finalizada!",
        description: "A venda foi registrada com sucesso.",
      });
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/daily-sales"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sales"] });
    },
    onError: () => {
      toast({
        title: "Erro na venda",
        description: "Não foi possível finalizar a venda. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const completeSale = () => {
    if (cart.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de finalizar a venda.",
        variant: "destructive",
      });
      return;
    }
    
    if (!paymentMethod) {
      toast({
        title: "Forma de pagamento",
        description: "Selecione uma forma de pagamento para continuar.",
        variant: "destructive",
      });
      return;
    }

    completeSaleMutation.mutate();
  };

  return {
    cart,
    paymentMethod,
    selectedCustomer,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    completeSale,
    setPaymentMethod,
    setSelectedCustomer,
    isCompletingSale: completeSaleMutation.isPending,
  };
}
