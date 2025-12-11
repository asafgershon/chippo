import { supabase } from "../supabase";
import { PriceDB } from "../types";

export async function insertPrice(price: Omit<PriceDB, "id">) {
  const { data, error } = await supabase
    .from("prices")
    .insert(price)
    .select("*")
    .single();

  if (error) throw new Error(`insertPrice failed: ${error.message}`);
  return data as PriceDB;
}

export async function updatePrice(id: number, update: Partial<PriceDB>) {
  const { data, error } = await supabase
    .from("prices")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(`updatePrice failed: ${error.message}`);
  return data as PriceDB;
}

export async function deletePrice(id: number) {
  const { error } = await supabase
    .from("prices")
    .delete()
    .eq("id", id);

  if (error) throw new Error(`deletePrice failed: ${error.message}`);
  return true;
}

export async function insertPricesBulk(priceRows: any[]) {
  return supabase.from("prices").insert(priceRows);
}

