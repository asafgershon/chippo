import { createClient } from "@supabase/supabase-js";

const url = "";
const key = "";

if (!url) {
  console.error("⚠️ Missing SUPABASE_URL");
  process.exit(1);
}

if (!key) {
  console.error("⚠️ Missing SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

export const supabase = createClient(url, key, {
  auth: { persistSession: false },
});
