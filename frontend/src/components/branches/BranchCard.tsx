import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BranchCardProps {
  name: string;
  address: string;
  distance?: string;
  coordinates: { lat: number; lng: number };
}

const BranchCard = ({ name, address, distance, coordinates }: BranchCardProps) => {
  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border animate-slide-up hover:border-primary/50 transition-all">
      <div className="flex items-start gap-3 text-right">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <MapPin className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{address}</p>
          {distance && (
            <p className="text-xs text-primary font-medium mt-1">{distance}</p>
          )}
        </div>
      </div>
      <Button
        variant="chippo"
        size="sm"
        onClick={handleNavigate}
        className="gap-2 flex-shrink-0"
      >
        <Navigation className="h-4 w-4" />
        נווט
      </Button>
    </div>
  );
};

export default BranchCard;
