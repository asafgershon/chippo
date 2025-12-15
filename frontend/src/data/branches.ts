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
    name: "רמי לוי",
    address: "חיל ההנדסה 1, באר שבע",
    coordinates: { lat: 31.2529, lng: 34.7915 },
  },
  {
    id: "2",
    name: "שופרסל",
    address: "האורגים 1, באר שבע",
    coordinates: { lat: 31.2596, lng: 34.8021 },
  },
  {
    id: "3",
    name: "מחסני השוק",
    address: "האורגים 8, באר שבע",
    coordinates: { lat: 31.2599, lng: 34.8050 },
  },
  {
    id: "4",
    name: "ויקטורי",
    address: "בן גוריון 15, באר שבע",
    coordinates: { lat: 31.2436, lng: 34.7993 },
  },
];
