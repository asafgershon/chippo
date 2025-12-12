import { useNavigate } from "react-router-dom";
import { X, Pencil, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

export interface OrderItem {
  id: string;
  name: string;
  brand: string;
  quantity: number;
}

interface OrderListProps {
  items: OrderItem[];
  onRemove: (id: string) => void;
  onReplace: (id: string, newName: string, newBrand: string) => void;
  menuItems: { name: string; brand: string; keywords: string[] }[];
}

const OrderList = ({ items, onRemove, onReplace, menuItems }: OrderListProps) => {
  const navigate = useNavigate();
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  const getSimilarProducts = (currentName: string) => {
    return menuItems.filter(item => item.name !== currentName);
  };

  return (
    <div className="h-full flex flex-col border-r-2 border-chippo-blue/30">
      <div className="p-4 bg-gradient-to-l from-chippo-blue/10 to-transparent">
        <h3 className="text-lg font-bold text-chippo-blue text-center">
          🛒 הרשימה שלך
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <ShoppingBag className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">הרשימה ריקה</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 p-3 bg-gradient-to-l from-chippo-blue/5 to-card rounded-xl border border-chippo-blue/20 shadow-sm hover:shadow-md transition-shadow animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onRemove(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Popover 
                    open={openPopoverId === item.id} 
                    onOpenChange={(open) => setOpenPopoverId(open ? item.id : null)}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-chippo-blue hover:bg-chippo-blue/10"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2" align="start">
                      <div className="text-sm font-medium text-muted-foreground mb-2 text-right">
                        החלף ב:
                      </div>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {getSimilarProducts(item.name).map((product) => (
                          <button
                            key={product.name}
                            className="w-full text-right p-2 rounded-lg hover:bg-chippo-blue/10 transition-colors"
                            onClick={() => {
                              onReplace(item.id, product.name, product.brand);
                              setOpenPopoverId(null);
                            }}
                          >
                            <div className="font-medium text-foreground text-sm">{product.name}</div>
                            <div className="text-xs text-chippo-blue/70">{product.brand}</div>
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-foreground">{item.name}</div>
                  <div className="text-xs text-chippo-blue/70">{item.brand}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="p-4 border-t border-chippo-blue/20">
          <Button
            variant="chippo"
            className="w-full gap-2 shadow-md"
            onClick={() => navigate("/checkout")}
          >
            <ShoppingBag className="h-5 w-5" />
            לחישוב החבילה
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderList;