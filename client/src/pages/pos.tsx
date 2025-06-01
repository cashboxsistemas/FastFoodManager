import { useEffect } from "react";
import ProductSearch from "@/components/pos/product-search";
import ShoppingCart from "@/components/pos/shopping-cart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Barcode } from "lucide-react";

const POPULAR_PRODUCTS = [
	{ id: 1, name: "X-Burger", price: 15.9 },
	{ id: 2, name: "Refrigerante", price: 5.5 },
	{ id: 3, name: "Batata Frita", price: 8.9 },
	{ id: 4, name: "Água", price: 3 },
	{ id: 5, name: "X-Salada", price: 12.9 },
	{ id: 6, name: "Suco Natural", price: 7.5 },
];

// Função utilitária para adaptar o produto rápido ao formato do Product
function toProduct(prod) {
	return {
		id: prod.id,
		name: prod.name,
		price: prod.price.toString(),
		code: "",
		barcode: "",
		category_id: 1,
		stock_quantity: 0,
		min_stock: 0,
		is_active: true,
		created_at: new Date(),
	};
}

export default function POS() {
	const { addToCart, completeSale, clearCart } = useCart();

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "F2") {
				e.preventDefault();
				const searchInput = document.getElementById("productSearch");
				searchInput?.focus();
			} else if (e.key === "F9") {
				e.preventDefault();
				completeSale();
			} else if (e.key === "Escape") {
				e.preventDefault();
				clearCart();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [completeSale, clearCart]);

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(value);
	};

	return (
		<div>
			<div className="mb-6">
				<h2 className="text-3xl font-bold text-foreground mb-2">
					Ponto de Venda (PDV)
				</h2>
				<p className="text-muted-foreground">
					Sistema de vendas com código de barras
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Product Search & Scanner */}
				<div className="lg:col-span-2 space-y-6">
					<Card className="cashbox-card">
						<CardContent className="p-6">
							<div className="flex items-center space-x-4 mb-4">
								<div className="flex-1">
									<ProductSearch />
								</div>
								<Button className="cashbox-button-primary">
									<Barcode className="mr-2 h-4 w-4" />
									Scanner
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Quick Access Products */}
					<Card className="cashbox-card">
						<CardHeader>
							<CardTitle className="text-lg font-semibold text-foreground">
								Produtos Populares
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
								{POPULAR_PRODUCTS.map((prod) => (
									<Button
										key={prod.id}
										onClick={() => addToCart(toProduct(prod))}
										className="pos-product-button"
									>
										<div className="font-medium text-foreground">
											{prod.name}
										</div>
										<div className="text-primary font-semibold">
											{formatCurrency(prod.price)}
										</div>
									</Button>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Shopping Cart */}
				<div>
					<ShoppingCart />
				</div>
			</div>

			{/* Keyboard Shortcuts */}
			<Card className="cashbox-card mt-6">
				<CardHeader>
					<CardTitle className="text-sm font-medium text-foreground">
						Atalhos de Teclado
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
						<div className="flex items-center space-x-2">
							<span className="kbd">F2</span>
							<span>Buscar produto</span>
						</div>
						<div className="flex items-center space-x-2">
							<span className="kbd">Enter</span>
							<span>Adicionar ao carrinho</span>
						</div>
						<div className="flex items-center space-x-2">
							<span className="kbd">F9</span>
							<span>Finalizar venda</span>
						</div>
						<div className="flex items-center space-x-2">
							<span className="kbd">ESC</span>
							<span>Limpar carrinho</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
