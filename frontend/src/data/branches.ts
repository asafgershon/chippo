export interface Branch {
  id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  distance?: string;
}

export const branches: Branch[] = [
  {
    id: "1",
    name: "Chippo דיזנגוף",
    address: "דיזנגוף 50, תל אביב",
    coordinates: { lat: 32.0775, lng: 34.7743 },
    distance: "1.2 ק״מ"
  },
  {
    id: "2",
    name: "Chippo רמת גן",
    address: "ז'בוטינסקי 7, רמת גן",
    coordinates: { lat: 32.0838, lng: 34.8095 },
    distance: "3.5 ק״מ"
  },
  {
    id: "3",
    name: "Chippo הרצליה",
    address: "סוקולוב 20, הרצליה",
    coordinates: { lat: 32.1657, lng: 34.8463 },
    distance: "8.2 ק״מ"
  },
  {
    id: "4",
    name: "Chippo ראשון לציון",
    address: "רוטשילד 15, ראשון לציון",
    coordinates: { lat: 31.9714, lng: 34.7925 },
    distance: "12.1 ק״מ"
  }
];
