// worker/xmlWorker.js
const fs = require("fs");
const { parentPort, workerData } = require("worker_threads");
const { XMLParser } = require("fast-xml-parser");

// parser להגדרות נכונות
const parser = new XMLParser({
  ignoreAttributes: false,
  allowBooleanAttributes: true
});

const { xmlPath, jsonPath } = workerData;

try {
  // 1. קריאת קובץ XML
  const xmlText = fs.readFileSync(xmlPath, "utf8");

  // 2. המרת XML → JS
  const parsed = parser.parse(xmlText);

  // שופרסל: root נקרא <Root>
  const root = parsed?.Root;
  if (!root) {
    parentPort.postMessage(0);
    return;
  }

  // 3. שליפת מזהי רשת/סניף
  const chain = {
    chainId: String(root.ChainId ?? ""),
    subChainId: String(root.SubChainId ?? ""),
    storeId: String(root.StoreId ?? "")
  };

  // 4. רשימת המוצרים נמצאת תחת <Items><Item>
  let items = root.Items?.Item ?? [];

  // במקרה של מוצר יחיד
  if (!Array.isArray(items)) items = [items];

  // 5. מיפוי למבנה PriceRowParsed
  const rows = items
    .map((p) => ({
      chain,
      itemCode: String(p.ItemCode ?? ""),
      itemName: String(p.ItemName ?? ""),
      itemPrice: Number(p.ItemPrice ?? 0),
      unitPrice: p.UnitOfMeasurePrice
        ? Number(p.UnitOfMeasurePrice)
        : null
    }))
    .filter((r) => r.itemCode && r.itemName);

  // 6. כתיבת JSON מסודר
  fs.writeFileSync(jsonPath, JSON.stringify(rows, null, 2));

  // 7. החזרת כמות המוצרים ל־thread הראשי
  parentPort.postMessage(rows.length);

} catch (err) {
  console.error("Worker Error:", err.message);
  parentPort.postMessage(0);
}
