import fs from "fs";
import path from "path";
import { log } from "../../util/logger";

import { PriceRowParsed } from "../../db/types";

// NEW services:
import { getStoresForCompany, insertStore } from "../../db/services/stores.service";
import { getProductsForCompany, insertProduct } from "../../db/services/products.service";
import { insertPrice, insertPricesBulk } from "../../db/services/prices.service";
import { getCompanyByName } from "../../db/services/companies.service";

import { supabase } from "../../db/supabase";

const TMP_DIR = path.resolve("tmp");

// Load all companies
function getCompanies(): string[] {
  return fs
    .readdirSync(TMP_DIR)
    .filter((f) => fs.statSync(path.join(TMP_DIR, f)).isDirectory());
}

export async function step5_insertDb() {
  log.info("[step5] Starting DB insertion for all companies...");

  const companies = getCompanies();

  if (companies.length === 0) {
    log.warn("[step5] No company folders found.");
    return;
  }

  for (const company of companies) {
    log.info(`\n========== Processing company: ${company} ==========`);

    const mergedPath = path.join(TMP_DIR, company, "merged.json");

    if (!fs.existsSync(mergedPath)) {
      log.warn(`[step5] No merged.json found for ${company}. Skipping.`);
      continue;
    }

    const rows: PriceRowParsed[] = JSON.parse(
      fs.readFileSync(mergedPath, "utf8")
    );

    if (rows.length === 0) {
      log.warn(`[step5] merged.json for ${company} is empty. Skipping.`);
      continue;
    }

    log.info(`[step5] Loaded ${rows.length.toLocaleString()} merged rows.`);

    // ------------------------------------------------
    // 1. Fetch company_id from DB (dynamic)
    // ------------------------------------------------
    const companyRow = await getCompanyByName(company);

    if (!companyRow) {
      throw new Error(
        `[step5] Company '${company}' does not exist in DB. Add it first.`
      );
    }

    const company_id = companyRow.id;

    // ------------------------------------------------
    // 2. Load existing stores/products into memory
    // ------------------------------------------------
    const stores = await getStoresForCompany(company_id);
    const products = await getProductsForCompany(company_id);
    

    const storeMap = new Map(stores.map(s => [s.store_code, s.id]));
  const productMap = new Map(products.map(p => [p.external_code, p.id]));

  // ------------------------------------------------
  // 3. Find missing stores/products (NO DB CALLS YET)
  // ------------------------------------------------

  const newStores: any[] = [];
  const newProducts: any[] = [];

  for (const row of rows) {
    const storeCode = row.chain.storeId;

    // STORE - collect missing
    if (!storeMap.has(storeCode)) {
    newStores.push({
      store_code: storeCode,
      name: row.storeName || `סניף ${storeCode}`, 
      city: row.city || null,                       
      address: row.address || null,                 
      company_id,
    });

      // prevent duplicates inside the same run
      storeMap.set(storeCode, null);
    }

    // PRODUCT - collect missing
    if (!productMap.has(row.itemCode)) {
      newProducts.push({
        external_code: row.itemCode,
        name: row.itemName,
        company_id,
      });

      productMap.set(row.itemCode, null);
    }
  }

    log.info(`[step5] Missing stores: ${newStores.length}`);
    log.info(`[step5] Missing products: ${newProducts.length}`);

    if (newStores.length > 0) {
      log.info(`[step5] Inserting ${newStores.length} stores...`);

      const { data } = await supabase
        .from("stores")
        .insert(newStores)
        .select("id, store_code");

      data?.forEach((s) => {
        storeMap.set(s.store_code, s.id);
      });
    }

    if (newProducts.length > 0) {
      log.info(`[step5] Inserting ${newProducts.length} products...`);

      const { data } = await supabase
        .from("products")
        .insert(newProducts)
        .select("id, external_code");

      data?.forEach((p) => {
        productMap.set(p.external_code, p.id);
      });
    }

    // ------------------------------------------------
    // 4. Insert prices in chunks
    // ------------------------------------------------
    log.info("[step5] Inserting prices...");

    let inserted = 0;
    const CHUNK_SIZE = 3000;

    for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
      const slice = rows.slice(i, i + CHUNK_SIZE);

    const priceRows = slice.map((r) => ({
      product_id: productMap.get(r.itemCode)!,
      store_id: storeMap.get(r.chain.storeId)!,
      price: r.itemPrice,
      unit_price: r.unitPrice || null,
    }));

      await insertPricesBulk(priceRows);
      inserted += priceRows.length;

      log.info(`[step5] Inserted ${inserted.toLocaleString()} prices...`);
    }

    log.info(
      `[step5] Finished company '${company}'. Total price rows inserted: ${inserted.toLocaleString()}`
    );
  }

  log.info("\n[step5] All companies processed successfully.");
}
