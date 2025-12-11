import { supabase } from "../supabase";
import { StoreDB } from "../types";

export async function insertStore(store: Omit<StoreDB, "id">) {
  const { data, error } = await supabase
    .from("stores")
    .insert(store)
    .select("*")
    .single();

  if (error) throw new Error(`insertStore failed: ${error.message}`);
  return data as StoreDB;
}

export async function updateStore(id: number, update: Partial<StoreDB>) {
  const { data, error } = await supabase
    .from("stores")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(`updateStore failed: ${error.message}`);
  return data as StoreDB;
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
  const { data } = await supabase
    .from("stores")
    .select("id, store_code")
    .eq("company_id", company_id);

  return data || [];
}

