import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

const Checkout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between p-4 bg-card border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/products")}
          className="h-10 w-10"
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">איך תרצה לקבל?</h1>
        <div className="w-10" />
      </header>

      <main className="p-4">
        <div className="max-w-md mx-auto space-y-4 mt-8">
          <button
            onClick={() => navigate("/branches")}
            className="w-full p-6 bg-card rounded-2xl border-2 border-border hover:border-primary transition-all animate-slide-up group"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="text-right flex-1">
                <h2 className="text-xl font-bold text-foreground">איסוף עצמי</h2>
                <p className="text-muted-foreground mt-1">נווט לסניף הקרוב אליך</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => {}}
            className="w-full p-6 bg-card rounded-2xl border-2 border-border transition-all animate-slide-up opacity-60 cursor-not-allowed"
            style={{ animationDelay: "100ms" }}
            disabled
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Truck className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-right flex-1">
                <h2 className="text-xl font-bold text-foreground">משלוח</h2>
                <p className="text-muted-foreground mt-1">בקרוב...</p>
              </div>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
