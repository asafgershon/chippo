import fs from "fs";
import path from "path";
import { parentPort, workerData } from "worker_threads";
import { XMLParser } from "fast-xml-parser";

// XML parser instance
const parser = new XMLParser({ ignoreAttributes: false });

const { xmlPath, jsonPath } = workerData;

try {
  // ----------------------------------------------------
  // 1️⃣ Load metadata JSON if exists
  // ----------------------------------------------------
  const metaPath = xmlPath.replace(".xml", ".metadata.json");

  let metadata = {};
  if (fs.existsSync(metaPath)) {
    metadata = JSON.parse(fs.readFileSync(metaPath, "utf8"));
  }

  const storeName = metadata.store_name || null;
  const city = metadata.city || null;
  const address = metadata.store_name || null; // temporary: same as name

  // ----------------------------------------------------
  // 2️⃣ Load & parse XML file
  // ----------------------------------------------------
  const xml = fs.readFileSync(xmlPath, "utf8");
  const doc = parser.parse(xml);

  const chain = {
    chainId: String(doc?.Prices?.ChainID ?? ""),
    subChainId: String(doc?.Prices?.SubChainID ?? ""),
    storeId: String(doc?.Prices?.StoreID ?? "")
  };

  const products = doc?.Prices?.Products?.Product ?? [];
  const arr = Array.isArray(products) ? products : [products];

  // ----------------------------------------------------
  // 3️⃣ Build parsed rows (+ metadata)
  // ----------------------------------------------------
  const rows = arr
    .map((p) => ({
      chain,

      itemCode: String(p.ItemCode ?? ""),
      itemName: String(p.ItemName ?? ""),
      itemPrice: Number(p.ItemPrice ?? 0),
      unitPrice: p.UnitOfMeasurePrice ? Number(p.UnitOfMeasurePrice) : null,

      // ⭐ NEW fields from metadata:
      storeName,
      city,
      address
    }))
    .filter((r) => r.itemCode && r.itemName);

  // ----------------------------------------------------
  // 4️⃣ Save parsed output
  // ----------------------------------------------------
  fs.writeFileSync(jsonPath, JSON.stringify(rows));

  // Return count to main thread
  parentPort.postMessage(rows.length);

} catch (err) {
  parentPort.postMessage(0);
}
