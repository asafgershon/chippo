import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

export const config = {
  db: {
    supabaseUrl: process.env.SUPABASE_URL ?? "",
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  },
};
