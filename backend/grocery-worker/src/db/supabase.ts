import { createClient } from "@supabase/supabase-js";
import { config } from "../config/env";

const url = config.db.supabaseUrl;
const key = config.db.supabaseServiceKey;

export const supabase = createClient(url, key, {
  auth: { persistSession: false },
});
