import fs from "fs";
import path from "path";
import { gunzipSync } from "zlib";
import { log } from "../util/logger";
import { parsePricesXml } from "../parse/prices-xml";
import { ensureCompany, ensureStore, ensureProduct } from "../db/upsert-core";
import { insertPricesBatch } from "../db/upsert-price";

const PRICES_DIR = path.resolve("tmp/prices");

export async function processAllPrices() {
  const files = fs.readdirSync(PRICES_DIR).filter(f => f.endsWith(".gz"));

  log.info(`📦 נמצאו ${files.length} קבצי מחירים לעיבוד`);

  for (const file of files) {
    const gzPath = path.join(PRICES_DIR, file);
    const xmlPath = gzPath.replace(".gz", "");

    try {
      // חילוץ הקובץ
      const gzData = fs.readFileSync(gzPath);
      const xmlData = gunzipSync(gzData).toString("utf8");
      fs.writeFileSync(xmlPath, xmlData);

      const { chain, rows } = parsePricesXml(xmlData);
      log.info(`🧾 ${rows.length} מוצרים ב-${file}`);

      const companyId = await ensureCompany(chain.chainId, "לא ידוע");
      const storeId = await ensureStore(companyId, chain.storeId);

      const batch = [];
      for (const r of rows) {
        const productId = await ensureProduct(companyId, r.itemCode, r.itemName);
        batch.push({
          product_id: productId,
          store_id: storeId,
          price: r.itemPrice,
          unit_price: r.unitPrice ?? null,
          valid_at: new Date().toISOString(),
          source_file: file,
        });
      }

      await insertPricesBatch(batch);
      log.info(`💾 נשמרו ${batch.length} מוצרים מהקובץ ${file}`);

      // מחיקת הקובץ אחרי סיום
      fs.unlinkSync(gzPath);
      fs.unlinkSync(xmlPath);
      log.info(`🧹 נמחק ${file} לאחר עיבוד`);
    } catch (err) {
      log.error(`❌ שגיאה בעיבוד ${file}: ${err}`);
    }
  }

  log.info("✅ סיום עיבוד כל קבצי המחירים");
}
