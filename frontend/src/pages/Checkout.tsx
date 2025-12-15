import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, Truck, Navigation, ExternalLink, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { branches } from "@/data/branches";
import { useState } from "react";
import BranchesMap from "@/components/checkout/BranchesMap";

const Checkout = () => {
  const navigate = useNavigate();
  const [pickupStoreCount, setPickupStoreCount] = useState<1 | 2>(1);
  const [deliveryStoreCount, setDeliveryStoreCount] = useState<1 | 2>(1);
  const [showMap, setShowMap] = useState(false);

  const openNavigation = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
  };
  const openDeliveryWebsite = async () => {
  // דוגמה לסל שנבנה אצלך
  const items = {
    "61": "0.50",
    "164854": "1.00",
    "336765": "1.00",
  };

  // 1️⃣ בקשה לשרת שלך
  const payloadRes = await fetch("/api/cart/build", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });

  const payload = await payloadRes.json();

  // 2️⃣ שליחה לרמי לוי – מהדפדפן
  await fetch("https://www.rami-levy.co.il/api/v2/cart", {
    method: "POST",
    credentials: "include", // 🔥 הקריטי
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  // 3️⃣ redirect לסל האמיתי
  window.location.href =
    "https://www.rami-levy.co.il/he/online/market/cart";
};

  // Mock prices per branch (full package)
  const branchPrices: Record<string, number> = {
    "1": 89,
    "2": 85,
    "3": 92,
    "4": 87,
  };

  // Half package prices (when splitting between 2 stores)
  const halfBranchPrices: Record<string, number> = {
    "1": 42,
    "2": 38,
    "3": 48,
    "4": 41,
  };

  const deliveryPrices: Record<string, number> = {
    "1": 109,
    "2": 105,
    "3": 112,
    "4": 107,
  };

  const halfDeliveryPrices: Record<string, number> = {
    "1": 52,
    "2": 48,
    "3": 58,
    "4": 51,
  };

  // Generate pairs for 2-store combinations
  const branchPairs = [];
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      branchPairs.push([branches[i], branches[j]]);
    }
  }

  const StoreCountSelector = ({ value, onChange }: { value: 1 | 2; onChange: (v: 1 | 2) => void }) => (
    <div className="flex gap-2 justify-center mb-4">
      <button
        onClick={() => onChange(2)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          value === 2
            ? "bg-chippo-blue text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
      >
        שני סופרים
      </button>
      <button
        onClick={() => onChange(1)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          value === 1
            ? "bg-chippo-blue text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
      >
        סופר אחד
      </button>
    </div>
  );

  return (
    <>
      {showMap && <BranchesMap onClose={() => setShowMap(false)} />}
      <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between p-4 bg-card border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="h-10 w-10"
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">חישוב החבילה</h1>
        <div className="w-10" />
      </header>

      <main className="p-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {/* איסוף עצמי - צד ימין */}
          <div className="bg-card rounded-2xl border-2 border-chippo-blue/30 p-6 animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-chippo-blue flex items-center justify-center">
                <MapPin className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="text-right flex-1">
                <h2 className="text-xl font-bold text-foreground">איסוף עצמי</h2>
                <p className="text-muted-foreground text-sm">בחר סניף ונווט אליו</p>
              </div>
            </div>

            <StoreCountSelector value={pickupStoreCount} onChange={setPickupStoreCount} />

            {/* Map button */}
            <Button
              variant="outline"
              className="w-full mb-4 gap-2 border-chippo-blue/30 hover:bg-chippo-blue hover:text-primary-foreground"
              onClick={() => setShowMap(true)}
            >
              <Map className="h-4 w-4" />
              הצג במפה
            </Button>

            <div className="space-y-3">
              {pickupStoreCount === 1 ? (
                branches.map((branch, index) => (
                  <div
                    key={branch.id}
                    className="flex items-center gap-3 p-4 bg-gradient-to-l from-chippo-blue/5 to-background rounded-xl border border-chippo-blue/20 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="text-right flex-1">
                      <div className="font-semibold text-foreground text-right">{branch.name}</div>
                      <div className="text-sm text-muted-foreground text-right">{branch.address}</div>
                      <div className="text-sm font-bold text-chippo-blue mt-1 text-right">₪{branchPrices[branch.id]}</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-chippo-blue/30 hover:bg-chippo-blue hover:text-primary-foreground"
                      onClick={() => openNavigation(branch.coordinates.lat, branch.coordinates.lng)}
                    >
                      <Navigation className="h-4 w-4" />
                      נווט
                    </Button>
                  </div>
                ))
              ) : (
                branchPairs.map(([branch1, branch2], index) => {
                  const halfPrice1 = halfBranchPrices[branch1.id];
                  const halfPrice2 = halfBranchPrices[branch2.id];
                  const totalPrice = halfPrice1 + halfPrice2;
                  
                  return (
                    <div
                      key={`${branch1.id}-${branch2.id}`}
                      className="p-4 bg-gradient-to-l from-chippo-blue/5 to-background rounded-xl border border-chippo-blue/20 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="space-y-3">
                        {/* סניף 1 */}
                        <div className="flex items-center gap-3">
                          <div className="text-right flex-1">
                            <div className="font-semibold text-foreground text-right">{branch1.name}</div>
                            <div className="text-xs text-muted-foreground text-right">חצי חבילה</div>
                            <div className="text-sm text-chippo-blue/70 text-right">₪{halfPrice1}</div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 text-xs border-chippo-blue/30 hover:bg-chippo-blue hover:text-primary-foreground"
                            onClick={() => openNavigation(branch1.coordinates.lat, branch1.coordinates.lng)}
                          >
                            <Navigation className="h-3 w-3" />
                            נווט
                          </Button>
                        </div>
                        
                        <div className="border-t border-chippo-blue/20" />
                        
                        {/* סניף 2 */}
                        <div className="flex items-center gap-3">
                          <div className="text-right flex-1">
                            <div className="font-semibold text-foreground text-right">{branch2.name}</div>
                            <div className="text-xs text-muted-foreground text-right">חצי חבילה</div>
                            <div className="text-sm text-chippo-blue/70 text-right">₪{halfPrice2}</div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 text-xs border-chippo-blue/30 hover:bg-chippo-blue hover:text-primary-foreground"
                            onClick={() => openNavigation(branch2.coordinates.lat, branch2.coordinates.lng)}
                          >
                            <Navigation className="h-3 w-3" />
                            נווט
                          </Button>
                        </div>
                        
                        {/* סה"כ */}
                        <div className="bg-chippo-blue/10 rounded-lg p-3 mt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-chippo-blue">₪{totalPrice}</span>
                            <span className="font-semibold text-foreground">סה״כ:</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* משלוח - צד שמאל */}
          <div className="bg-card rounded-2xl border-2 border-border p-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                <Truck className="h-7 w-7 text-muted-foreground" />
              </div>
              <div className="text-right flex-1">
                <h2 className="text-xl font-bold text-foreground">משלוח</h2>
                <p className="text-muted-foreground text-sm">משלוח עד הבית</p>
              </div>
            </div>

            <StoreCountSelector value={deliveryStoreCount} onChange={setDeliveryStoreCount} />

            <div className="space-y-3">
              {deliveryStoreCount === 1 ? (
                branches.map((branch, index) => (
                  <div
                    key={branch.id}
                    className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border border-border animate-fade-in"
                    style={{ animationDelay: `${(index * 50) + 100}ms` }}
                  >
                    <div className="text-right flex-1">
                      <div className="font-semibold text-foreground text-right">{branch.name}</div>
                      <div className="text-sm text-muted-foreground text-right">{branch.address}</div>
                      <div className="text-sm font-bold text-foreground mt-1 text-right">₪{deliveryPrices[branch.id]}</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={openDeliveryWebsite}
                    >
                      <ExternalLink className="h-4 w-4" />
                      לאתר
                    </Button>
                  </div>
                ))
              ) : (
                branchPairs.map(([branch1, branch2], index) => {
                  const halfPrice1 = halfDeliveryPrices[branch1.id];
                  const halfPrice2 = halfDeliveryPrices[branch2.id];
                  const totalPrice = halfPrice1 + halfPrice2;
                  
                  return (
                    <div
                      key={`${branch1.id}-${branch2.id}`}
                      className="p-4 bg-muted/30 rounded-xl border border-border animate-fade-in"
                      style={{ animationDelay: `${(index * 50) + 100}ms` }}
                    >
                      <div className="space-y-3">
                        {/* סניף 1 */}
                        <div className="flex items-center gap-3">
                          <div className="text-right flex-1">
                            <div className="font-semibold text-foreground text-right">{branch1.name}</div>
                            <div className="text-xs text-muted-foreground text-right">חצי חבילה</div>
                            <div className="text-sm text-muted-foreground text-right">₪{halfPrice1}</div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 text-xs"
                            onClick={openDeliveryWebsite}
                          >
                            <ExternalLink className="h-3 w-3" />
                            לאתר
                          </Button>
                        </div>
                        
                        <div className="border-t border-border" />
                        
                        {/* סניף 2 */}
                        <div className="flex items-center gap-3">
                          <div className="text-right flex-1">
                            <div className="font-semibold text-foreground text-right">{branch2.name}</div>
                            <div className="text-xs text-muted-foreground text-right">חצי חבילה</div>
                            <div className="text-sm text-muted-foreground text-right">₪{halfPrice2}</div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 text-xs"
                            onClick={openDeliveryWebsite}
                          >
                            <ExternalLink className="h-3 w-3" />
                            לאתר
                          </Button>
                        </div>
                        
                        {/* סה"כ */}
                        <div className="bg-muted rounded-lg p-3 mt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-foreground">₪{totalPrice}</span>
                            <span className="font-semibold text-foreground">סה״כ:</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
};

export default Checkout;
