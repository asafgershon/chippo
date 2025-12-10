import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/ProductCard";
import { products, Product } from "@/data/products";

const Products = () => {
  const navigate = useNavigate();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleQuantityChange = (productId: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: quantity
    }));
  };

  const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = products.reduce((sum, product) => {
    const qty = quantities[product.id] || 0;
    return sum + (product.price * qty);
  }, 0);

  // Sort products: sale items first
  const sortedProducts = [...products].sort((a, b) => {
    if (a.isOnSale && !b.isOnSale) return -1;
    if (!a.isOnSale && b.isOnSale) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-card border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="h-10 w-10"
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">בחירת מוצרים</h1>
        <div className="w-10" />
      </header>

      <main className="p-4 pb-32">
        <div className="max-w-lg mx-auto">
          <p className="text-muted-foreground text-center mb-6">
            בחר את המוצרים שברצונך להזמין
          </p>
          
          <div className="space-y-3">
            {sortedProducts.map((product, index) => (
              <div key={product.id} style={{ animationDelay: `${index * 50}ms` }}>
                <ProductCard
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  isOnSale={product.isOnSale}
                  quantity={quantities[product.id] || 0}
                  onQuantityChange={(qty) => handleQuantityChange(product.id, qty)}
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border animate-slide-up">
          <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{totalItems} פריטים</p>
              <p className="text-xl font-bold text-foreground">סה״כ: ₪{totalPrice}</p>
            </div>
            <Button
              variant="chippo"
              size="xl"
              onClick={() => navigate("/checkout")}
              className="gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              המשך להזמנה
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
