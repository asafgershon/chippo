import fs from "fs";
import path from "path";
import { log } from "../../util/logger";
import { supabase } from "../../db/supabase";
import { PriceRowParsed } from "../../db/types";

const TMP_DIR = path.resolve("tmp");
const MERGED_PATH = path.join(TMP_DIR, "merged.json");

export async function step5_insertDb() {
  log.info("[step5] Starting DB insert...");

  if (!fs.existsSync(MERGED_PATH)) {
    log.warn("[step5] merged.json not found. Skipping.");
    return;
  }

  const rows: PriceRowParsed[] = JSON.parse(
    fs.readFileSync(MERGED_PATH, "utf8")
  );

  if (rows.length === 0) {
    log.warn("[step5] merged.json is empty. Skipping.");
    return;
  }

  log.info(`[step5] Loaded ${rows.length.toLocaleString()} merged rows.`);

  // =====================================================
  // 1. Companies — כרגע אתה עובד רק עם ויקטורי
  // =====================================================
  const company_id = 2;

  // =====================================================
  // 2. Load/store existing stores/products into memory
  // =====================================================
  log.info("[step5] Fetching existing stores/products...");

  const { data: stores } = await supabase.from("stores").select("id, store_code");
  const { data: products } = await supabase.from("products").select("id, external_code");

  const storeMap = new Map(stores?.map((s) => [s.store_code, s.id]));
  const productMap = new Map(products?.map((p) => [p.external_code, p.id]));

  const newStores: any[] = [];
  const newProducts: any[] = [];

  // =====================================================
  // 3. Build missing stores/products
  // =====================================================
  for (const row of rows) {
    const code = row.chain.storeId;

    if (!storeMap.has(code)) {
      storeMap.set(code, null); // סימון שצריך להוסיף
      newStores.push({
        store_code: code,
        name: `סניף ${code}`,
        company_id,
      });
    }

    if (!productMap.has(row.itemCode)) {
      productMap.set(row.itemCode, null);
      newProducts.push({
        external_code: row.itemCode,
        name: row.itemName,
        company_id,
      });
    }
  }

  // =====================================================
  // 4. Insert new stores/products in bulk
  // =====================================================

  if (newStores.length > 0) {
    log.info(`[step5] Inserting ${newStores.length} new stores...`);

    const { data } = await supabase
      .from("stores")
      .insert(newStores)
      .select("id, store_code");

    data?.forEach((s) => storeMap.set(s.store_code, s.id));
  }

  if (newProducts.length > 0) {
    log.info(`[step5] Inserting ${newProducts.length} new products...`);

    const { data } = await supabase
      .from("products")
      .insert(newProducts)
      .select("id, external_code");

    data?.forEach((p) => productMap.set(p.external_code, p.id));
  }

  // =====================================================
  // 5. Insert prices in chunks (FAST!)
  // =====================================================
  log.info("[step5] Inserting prices...");

  let inserted = 0;
  const CHUNK_SIZE = 5000;

  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    const slice = rows.slice(i, i + CHUNK_SIZE);

    const priceRows = slice.map((r) => ({
      product_id: productMap.get(r.itemCode),
      store_id: storeMap.get(r.chain.storeId),
      price: r.itemPrice,
      unit_price: r.unitPrice,
    }));

    await supabase.from("prices").insert(priceRows);
    inserted += priceRows.length;

    log.info(`[step5] Inserted ${inserted.toLocaleString()} prices...`);
  }

  log.info(`[step5] Completed successfully. Total inserted: ${inserted.toLocaleString()}`);
}
