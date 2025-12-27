// db/prices.ts
import { supabase } from "../supabase";
import { Database } from "../types";

type PriceInsert = Database["public"]["Tables"]["prices"]["Insert"];
type PriceUpdate = Database["public"]["Tables"]["prices"]["Update"];
type PriceRow = Database["public"]["Tables"]["prices"]["Row"];

export async function insertPrice(price: PriceInsert): Promise<PriceRow> {
  const { data, error } = await supabase
    .from("prices")
    .insert(price)
    .select("*")
    .single();

  if (error) throw new Error(`insertPrice failed: ${error.message}`);
  return data;
}

export async function updatePrice(id: number, update: PriceUpdate): Promise<PriceRow> {
  const { data, error } = await supabase
    .from("prices")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(`updatePrice failed: ${error.message}`);
  return data;
}

export async function deletePrice(id: number) {
  const { error } = await supabase
    .from("prices")
    .delete()
    .eq("id", id);

  if (error) throw new Error(`deletePrice failed: ${error.message}`);
  return true;
}

// הוספת מחירים בכמות
export async function insertPricesBulk(prices: PriceInsert[]) {
  const { data, error } = await supabase.from("prices").insert(prices);
  if (error) throw new Error(`insertPricesBulk failed: ${error.message}`);
  return data;
}
