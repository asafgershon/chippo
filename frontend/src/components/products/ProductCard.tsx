import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  name: string;
  price: number;
  originalPrice?: number;
  isOnSale?: boolean;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

const ProductCard = ({ 
  name, 
  price, 
  originalPrice, 
  isOnSale, 
  quantity, 
  onQuantityChange 
}: ProductCardProps) => {
  const isSelected = quantity > 0;

  return (
    <div
      className={cn(
        "relative w-full rounded-xl p-4 transition-all duration-200 animate-slide-up",
        "bg-card border-2",
        isSelected ? "border-primary" : "border-border"
      )}
    >
      {isOnSale && (
        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
          מבצע!
        </div>
      )}
      
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all",
              quantity > 0 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-muted-foreground"
            )}
          >
            <Minus className="h-4 w-4" />
          </button>
          
          <span className="w-8 text-center font-bold text-lg text-foreground">
            {quantity}
          </span>
          
          <button
            onClick={() => onQuantityChange(quantity + 1)}
            className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-all hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        <div className="text-right flex-1">
          <h3 className="font-semibold text-foreground">{name}</h3>
          <div className="flex items-center gap-2 justify-end mt-1">
            {originalPrice && (
              <span className="text-muted-foreground line-through text-sm">
                ₪{originalPrice}
              </span>
            )}
            <span className={cn(
              "font-bold text-lg",
              isOnSale ? "text-primary" : "text-foreground"
            )}>
              ₪{price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
