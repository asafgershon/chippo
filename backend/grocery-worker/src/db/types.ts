// ======================================================
// 📌 Supabase Database Types (MVP - Chippo Market)
// ======================================================

export interface Database {
  public: {
    Tables: {
      // ============================
      // 🏷️ Brands
      // ============================
      brands: {
        Row: {
          id: number;
          name: string;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          name: string;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          name?: string;
          created_at?: string | null;
        };
      };

      // ============================
      // 🧂 Categories
      // ============================
      categories: {
        Row: {
          id: number;
          name: string;
          parent_id: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          name: string;
          parent_id?: number | null;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          name?: string;
          parent_id?: number | null;
          created_at?: string | null;
        };
      };

      // ============================
      // 📦 Products  (PK: barcode)
      // ============================
      products: {
        Row: {
          barcode: string;
          name: string;
          description: string | null;
          brand_id: number | null;
          category_id: number | null;
          unit_type: string | null;
          quantity: number | null;
          is_weighted: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          barcode: string;
          name: string;
          description?: string | null;
          brand_id?: number | null;
          category_id?: number | null;
          unit_type?: string | null;
          quantity?: number | null;
          is_weighted?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          barcode?: string;
          name?: string;
          description?: string | null;
          brand_id?: number | null;
          category_id?: number | null;
          unit_type?: string | null;
          quantity?: number | null;
          is_weighted?: boolean | null;
          updated_at?: string | null;
        };
      };

      // ============================
      // 🏢 Companies
      // ============================
      companies: {
        Row: {
          id: number;
          name: string;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          name: string;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          name?: string;
          created_at?: string | null;
        };
      };

      // ============================
      // 🏬 Stores
      // ============================
      stores: {
        Row: {
          id: number;
          company_id: number;
          name: string;
          city: string | null;
          address: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          company_id: number;
          name: string;
          city?: string | null;
          address?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          company_id?: number;
          name?: string;
          city?: string | null;
          address?: string | null;
          created_at?: string | null;
        };
      };

      // ============================
      // 💸 Prices  (FK → barcode + store)
      // ============================
      prices: {
        Row: {
          id: number;
          barcode: string;
          store_id: number;
          price: number;
          unit_price: number | null;
          currency: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          barcode: string;
          store_id: number;
          price: number;
          unit_price?: number | null;
          currency?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          barcode?: string;
          store_id?: number;
          price?: number;
          unit_price?: number | null;
          currency?: string | null;
          updated_at?: string | null;
        };
      };

      // ============================
      // 🎁 Promotions
      // ============================
      promotions: {
        Row: {
          id: number;
          store_id: number;
          barcode: string;
          discount_type: string;
          discount_value: number | null;
          description: string | null;
          start_date: string | null;
          end_date: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          store_id: number;
          barcode: string;
          discount_type: string;
          discount_value?: number | null;
          description?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          store_id?: number;
          barcode?: string;
          discount_type?: string;
          discount_value?: number | null;
          description?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string | null;
        };
      };
    };

    Views: {};
    Functions: {};
    Enums: {};
  };
}
