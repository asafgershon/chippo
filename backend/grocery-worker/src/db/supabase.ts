import { createClient } from "@supabase/supabase-js";

const url = "https://xxdonlyesasokapkdbqm.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4ZG9ubHllc2Fzb2thcGtkYnFtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzc3NzE0OSwiZXhwIjoyMDczMzUzMTQ5fQ.I0z5FSlFx7VXZn82JTrHX9nuWnIXIfGypyU2TY8N1lo";

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
