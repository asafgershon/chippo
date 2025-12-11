import { supabase } from "../supabase";
import { ProductDB } from "../types";

export async function insertProduct(product: Omit<ProductDB, "id">) {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select("*")
    .single();

  if (error) throw new Error(`insertProduct failed: ${error.message}`);
  return data as ProductDB;
}

export async function updateProduct(id: number, update: Partial<ProductDB>) {
  const { data, error } = await supabase
    .from("products")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(`updateProduct failed: ${error.message}`);
  return data as ProductDB;
}

export async function deleteProduct(id: number) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw new Error(`deleteProduct failed: ${error.message}`);
  return true;
}

export async function getProductsForCompany(company_id: number) {
  const { data } = await supabase
    .from("products")
    .select("id, external_code")
    .eq("company_id", company_id);

  return data || [];
}

