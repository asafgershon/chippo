export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  isOnSale?: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    name: "צ'יפס קלאסי",
    price: 12,
    originalPrice: 15,
    category: "צ'יפס",
    isOnSale: true
  },
  {
    id: "2",
    name: "צ'יפס בטטה",
    price: 18,
    category: "צ'יפס"
  },
  {
    id: "3",
    name: "נאגטס",
    price: 18,
    originalPrice: 22,
    category: "מטוגנים",
    isOnSale: true
  },
  {
    id: "4",
    name: "טבעות בצל",
    price: 16,
    category: "מטוגנים"
  },
  {
    id: "5",
    name: "קולה",
    price: 8,
    category: "שתייה"
  },
  {
    id: "6",
    name: "מים מינרליים",
    price: 5,
    originalPrice: 6,
    category: "שתייה",
    isOnSale: true
  },
  {
    id: "7",
    name: "שניצל",
    price: 28,
    category: "מנות"
  },
  {
    id: "8",
    name: "המבורגר",
    price: 35,
    category: "מנות"
  }
];
