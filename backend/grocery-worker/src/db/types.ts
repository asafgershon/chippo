// worker/src/db/types.ts

// 🧩 מזהי שרשרת (רשת, תת־שרשרת, סניף)
export interface ChainIds {
  chainId: string;
  subChainId: string;
  storeId: string;
}

// 🧾 מבנה מוצר מתוך קובץ XML (Parsed)
export interface PriceRowParsed {
  chain: ChainIds;
  itemCode: string;
  itemName: string;
  itemPrice: number;
  unitPrice: number | null;
  storeName: string;
  city: string | null;
  address: string | null;
}

// 🗃️ טבלת products - UPDATED + TIMESTAMPS
export interface ProductDB {
  id?: number; // Supabase autoincrement PK
  name: string;
  external_code: string | null; // nullable in DB

  description?: string | null;
  image_url?: string | null;

  brand_id?: number | null;
  category_id?: number | null;

  gtin13?: string | null;
  quantity?: number | null;
  unit_type?: string | null;
  is_weighted?: boolean | null;

  company_id: number; // NOT NULL in DB

  // 🕒 timestamps (Supabase auto-fill)
  created_at?: Date | null;
  updated_at?: Date | null;
}

// 🏬 טבלת stores - UPDATED + TIMESTAMPS
export interface StoreDB {
  id?: number; // PK
  name: string;
  city?: string | null;
  address?: string | null;
  store_code: string | null; // nullable in DB
  company_id: number;

  // 🕒 timestamps
  created_at?: Date | null;
}

// 💰 טבלת prices - UPDATED + TIMESTAMPS
export interface PriceDB {
  id?: number; // PK

  product_id: number;
  store_id: number;

  price: number;
  unit_price?: number | null;

  currency?: string | null;

  valid_at?: Date | null;

  source_file?: string | null;
  file_size_kb?: number | null;

  // 🕒 timestamps
  created_at?: Date | null;
  updated_at?: Date | null;
}

// 📄 רשומת קטלוג של קובץ (downloaded XML/Promo file)
export interface CatalogRow {
  file_name: string;
  company_name: string;
  store_name: string;
  city: string | null;

  file_type: "מחירים" | "מבצעים";

  file_size_kb: number;
  file_date: string;

  download_url: string;

  store_code: string | null;
}
