import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { saveToLocalStorage, loadFromLocalStorage, removeFromLocalStorage, STORAGE_KEYS } from "@/lib/local-storage";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  username: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedUser = loadFromLocalStorage<User | null>(STORAGE_KEYS.USER, null);
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", { username, password });
      return response.json();
    },
    onSuccess: (data) => {
      setUser(data.user);
      saveToLocalStorage(STORAGE_KEYS.USER, data.user);
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo(a), ${data.user.username}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erro no login",
        description: "Credenciais inválidas. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const login = async (username: string, password: string) => {
    return loginMutation.mutateAsync({ username, password });
  };

  const logout = () => {
    setUser(null);
    removeFromLocalStorage(STORAGE_KEYS.USER);
    // Clear all user-specific data
    removeFromLocalStorage(STORAGE_KEYS.CART);
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  return {
    user,
    login,
    logout,
    isLoading: loginMutation.isPending,
  };
}
