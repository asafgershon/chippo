// db/stores.ts
import { supabase } from "../supabase";
import { Database } from "../types";

type StoreInsert = Database["public"]["Tables"]["stores"]["Insert"];
type StoreUpdate = Database["public"]["Tables"]["stores"]["Update"];
type StoreRow = Database["public"]["Tables"]["stores"]["Row"];

export async function insertStore(store: StoreInsert): Promise<StoreRow> {
  const { data, error } = await supabase
    .from("stores")
    .insert(store)
    .select("*")
    .single();

  if (error) throw new Error(`insertStore failed: ${error.message}`);
  return data;
}

export async function updateStore(id: number, update: StoreUpdate): Promise<StoreRow> {
  const { data, error } = await supabase
    .from("stores")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(`updateStore failed: ${error.message}`);
  return data;
}

export async function deleteStore(id: number) {
  const { error } = await supabase
    .from("stores")
    .delete()
    .eq("id", id);

  if (error) throw new Error(`deleteStore failed: ${error.message}`);
  return true;
}

export async function getStoresForCompany(company_id: number) {
  const { data, error } = await supabase
    .from("stores")
    .select("id, name, city, address")
    .eq("company_id", company_id);

  if (error) throw new Error(`getStoresForCompany failed: ${error.message}`);
  return data ?? [];
}
