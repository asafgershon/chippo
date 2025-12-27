// db/products.ts
import { supabase } from "../supabase";
import { Database } from "../types";

type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];
type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export async function insertProduct(product: ProductInsert): Promise<ProductRow> {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select("*")
    .single();

  if (error) throw new Error(`insertProduct failed: ${error.message}`);
  return data;
}

export async function updateProduct(barcode: string, update: ProductUpdate): Promise<ProductRow> {
  const { data, error } = await supabase
    .from("products")
    .update(update)
    .eq("barcode", barcode)
    .select("*")
    .single();

  if (error) throw new Error(`updateProduct failed: ${error.message}`);
  return data;
}

export async function deleteProduct(barcode: string) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("barcode", barcode);

  if (error) throw new Error(`deleteProduct failed: ${error.message}`);
  return true;
}

// במקום company_id — עכשיו אפשר לחפש לפי קטגוריה/מותג/טקסט
export async function searchProductsByName(q: string) {
  const { data, error } = await supabase
    .from("products")
    .select("barcode, name")
    .ilike("name", `%${q}%`);

  if (error) throw new Error(`searchProductsByName failed: ${error.message}`);
  return data ?? [];
}
