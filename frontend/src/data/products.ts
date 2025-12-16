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
    name: "אבקת מרק עוף",
    price: 9.9,
    originalPrice: 11.9,
    category: "אבקות מרק",
    isOnSale: true
  },
  {
    id: "2",
    name: "אבקת מרק בצל",
    price: 8.9,
    category: "אבקות מרק"
  },
  {
    id: "3",
    name: "אבקת מרק עוף",
    price: 10.5,
    originalPrice: 12.5,
    category: "אבקות מרק",
    isOnSale: true
  },
  {
    id: "4",
    name: "אבקת מרק בצל",
    price: 9.5,
    category: "אבקות מרק"
  }
];
