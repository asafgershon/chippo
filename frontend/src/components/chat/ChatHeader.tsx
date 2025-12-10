import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import chippoLogo from "@/assets/chippo-logo.png";

const ChatHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between p-4 bg-card border-b border-border">
      <div className="flex items-center gap-3">
        <img 
          src={chippoLogo} 
          alt="Chippo" 
          className="h-12 w-auto"
        />
      </div>
      <Button
        variant="chippo"
        size="lg"
        onClick={() => navigate("/products")}
        className="gap-2"
      >
        <ShoppingBag className="h-5 w-5" />
        לבחירת מוצרים
      </Button>
    </header>
  );
};

export default ChatHeader;
