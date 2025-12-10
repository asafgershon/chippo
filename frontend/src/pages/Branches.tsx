import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import BranchCard from "@/components/branches/BranchCard";
import { branches } from "@/data/branches";

const Branches = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between p-4 bg-card border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/checkout")}
          className="h-10 w-10"
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">הסניפים שלנו</h1>
        <div className="w-10" />
      </header>

      <main className="p-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-muted-foreground text-center mb-6">
            בחר סניף ונווט אליו
          </p>
          
          <div className="space-y-3">
            {branches.map((branch, index) => (
              <div key={branch.id} style={{ animationDelay: `${index * 100}ms` }}>
                <BranchCard
                  name={branch.name}
                  address={branch.address}
                  distance={branch.distance}
                  coordinates={branch.coordinates}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Branches;
