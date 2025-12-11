import { XMLParser } from "fast-xml-parser";

// מזהי שרשרת (רשת, תת־שרשרת, סניף)
export interface ChainIds {
  chainId: string;
  subChainId: string;
  storeId: string;
}

// כל מוצר שנמצא בקובץ XML
export interface PriceRow {
  chain: ChainIds;
  itemCode: string;
  itemName: string;
  itemPrice: number;
  unitPrice?: number | null;
}

const parser = new XMLParser({ ignoreAttributes: false });

export function parsePricesXml(xml: string): { chain: ChainIds; rows: PriceRow[] } {
  const doc = parser.parse(xml);

  // הגנה מפני מבנה לא תקין
  const prices = doc?.Prices ?? {};

  const chain: ChainIds = {
    chainId: String(prices.ChainID ?? ""),
    subChainId: String(prices.SubChainID ?? ""),
    storeId: String(prices.StoreID ?? ""),
  };

  const rawProducts = prices?.Products?.Product;

  // דואגים שיהיה תמיד מערך תקין
  const products = Array.isArray(rawProducts)
    ? rawProducts
    : rawProducts
      ? [rawProducts]
      : [];

  const rows: PriceRow[] = products
    .map((p: any) => {
      const code = String(p.ItemCode ?? "").trim();
      const name = String(p.ItemName ?? "").trim();

      // מסננים מוצרים מוזרים — רק אם רוצים
      if (!code || !name) return null;

      return {
        chain,
        itemCode: code,
        itemName: name,
        itemPrice: Number(p.ItemPrice ?? 0),
        unitPrice: p.UnitOfMeasurePrice ? Number(p.UnitOfMeasurePrice) : null,
      };
    })
    .filter(Boolean) as PriceRow[];

  return { chain, rows };
}
