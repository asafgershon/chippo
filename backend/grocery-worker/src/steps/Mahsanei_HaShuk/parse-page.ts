import axios from "axios";
import * as cheerio from "cheerio";

export interface CatalogRow {
  file_name: string;
  company_name: string;
  store_name: string;
  city: string | null;
  file_type: "מחירים" | "מבצעים";
  file_size_kb: number;
  file_date: string;
  download_url: string;
  store_code: string | null;
}


const BASE_URL = "https://laibcatalog.co.il/";

export async function parseMainPage(): Promise<CatalogRow[]> {
  const res = await axios.get(BASE_URL);
  const $ = cheerio.load(res.data);
  const rows: CatalogRow[] = [];

  $("table tbody tr").each((_, el) => {
    const tds = $(el).find("td");
    const file_name = $(tds[0]).text().trim();
    const company_name = $(tds[1]).text().trim();
    const store_full = $(tds[2]).text().trim();
    const file_type = $(tds[3]).text().trim() as "מחירים" | "מבצעים";
    const file_ext = $(tds[4]).text().trim();
    const file_size = parseFloat($(tds[5]).text().replace("KB", "").trim());
    const file_date = $(tds[6]).text().trim();
    const download_path = $(tds[7]).find("a").attr("href");

// חילוץ קוד סניף ועיר
let store_code: string | null = null;
let city: string | null = null;
let store_name = store_full.trim();

const parts = store_full.trim().split(" ");
const last = parts[parts.length - 1];

// אם המילה האחרונה היא מספר — זה כנראה קוד סניף
if (/^\d+$/.test(last)) {
  store_code = last;
  city = parts.slice(0, parts.length - 1).join(" ");
} else {
  city = store_full;
}

// דילוג על שורות ריקות
if (!file_name || !download_path) return;


    const download_url = new URL(download_path!, BASE_URL).href;

rows.push({
  file_name,
  company_name,
  store_name,
  city,
  file_type,
  file_size_kb: file_size,
  file_date,
  download_url,
  store_code,
});
  });

  return rows;
}
