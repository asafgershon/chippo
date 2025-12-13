import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { branches } from "@/data/branches";

interface BranchesMapProps {
  onClose: () => void;
}

const BranchesMap = ({ onClose }: BranchesMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Default to Tel Aviv if location not available
          setUserLocation({ lat: 32.0853, lng: 34.7818 });
        }
      );
    } else {
      setUserLocation({ lat: 32.0853, lng: 34.7818 });
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !userLocation || !mapboxToken || !isMapReady) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [userLocation.lng, userLocation.lat],
      zoom: 11,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-left");

    // Add user location marker
    new mapboxgl.Marker({ color: "#3b82f6" })
      .setLngLat([userLocation.lng, userLocation.lat])
      .setPopup(new mapboxgl.Popup().setHTML("<strong>המיקום שלי</strong>"))
      .addTo(map.current);

    // Add branch markers
    branches.forEach((branch) => {
      new mapboxgl.Marker({ color: "#1e3a5f" })
        .setLngLat([branch.coordinates.lng, branch.coordinates.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<strong>${branch.name}</strong><br/>${branch.address}`
          )
        )
        .addTo(map.current!);
    });

    // Fit bounds to show all markers
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend([userLocation.lng, userLocation.lat]);
    branches.forEach((branch) => {
      bounds.extend([branch.coordinates.lng, branch.coordinates.lat]);
    });
    map.current.fitBounds(bounds, { padding: 50 });

    return () => {
      map.current?.remove();
    };
  }, [userLocation, mapboxToken, isMapReady]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapboxToken.trim()) {
      setIsMapReady(true);
    }
  };

  if (!isMapReady) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-card rounded-2xl p-6 max-w-md w-full border border-border shadow-lg">
          <h3 className="text-lg font-bold text-foreground mb-4 text-center">הגדרת מפה</h3>
          <p className="text-sm text-muted-foreground mb-4 text-center">
            כדי להציג את המפה, יש להזין Mapbox Public Token
          </p>
          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <input
              type="text"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              placeholder="הכנס Mapbox Token..."
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
              dir="ltr"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-chippo-blue text-primary-foreground py-2 rounded-lg font-medium hover:bg-chippo-blue/90 transition-colors"
              >
                הצג מפה
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                ביטול
              </button>
            </div>
          </form>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            ניתן לקבל Token בחינם ב-{" "}
            <a
              href="https://mapbox.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-chippo-blue underline"
            >
              mapbox.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl overflow-hidden max-w-4xl w-full h-[80vh] border border-border shadow-lg flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border" dir="rtl">
          <h3 className="text-lg font-bold text-foreground">מפת סניפים</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground"
          >
            ✕
          </button>
        </div>
        <div ref={mapContainer} className="flex-1" />
        <div className="p-4 border-t border-border" dir="rtl">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-muted-foreground">המיקום שלי</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chippo-blue" />
              <span className="text-muted-foreground">סניפי Chippo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchesMap;