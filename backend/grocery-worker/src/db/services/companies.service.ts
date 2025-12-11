import { supabase } from "../supabase";

export async function getCompanyByName(name: string) {
  const { data, error } = await supabase
    .from("companies")
    .select("id")
    .eq("name", name)
    .single();

  if (error || !data) return null;
  return data;
}
