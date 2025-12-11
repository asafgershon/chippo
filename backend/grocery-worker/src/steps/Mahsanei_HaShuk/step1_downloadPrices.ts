import fs from "fs";
import path from "path";
import axios from "axios";
import { log } from "../../util/logger";
import { parseMainPage } from "./parse-page";
import { CatalogRow } from "../../db/types";

const TMP_DIR = path.resolve("tmp/machsanei_hashuk");


// Normalize store names coming from the HTML
function normalizeStoreName(name: string): string {
  return name
    .replace(/\u00A0/g, " ")   // NBSP → regular space
    .replace(/\s+/g, " ")      // collapse spaces
    .trim();
}

function normalize(text: string) {
  return text
    .replace(/\u00A0/g, " ") // NBSP → space
    .replace(/\s+/g, " ")
    .trim();
}


export async function step1_downloadPrices() {
  log.info("[step1] Starting price file download...");

  log.info("[step1] Fetching file list from main page...");
  const rows: CatalogRow[] = await parseMainPage();

const filteredRows = rows.filter(r => {
  const company = normalize(r.company_name || "");
  return (
    company === "מחסני השוק" &&
    r.file_type === "מחירים" &&
    r.file_size_kb > 20
    );
  });

  let downloaded = 0;

  for (const row of filteredRows) {
    if (!row.download_url) continue;

    const targetDir = path.join(TMP_DIR, "prices");
    fs.mkdirSync(targetDir, { recursive: true });

    const filePath = path.join(targetDir, `${row.file_name}.xml.gz`);

    if (fs.existsSync(filePath)) {
      log.info(`[step1] Skipping (already exists): ${row.file_name}`);
      continue;
    }

    const url = row.download_url;
    log.info(`[step1] Downloading ${row.file_name} from ${url} ...`);

    try {
      const res = await axios.get(url, { responseType: "arraybuffer" });

      const textBeginning = res.data.slice(0, 50).toString();

      if (textBeginning.includes("<!DOCTYPE html") || textBeginning.includes("<html")) {
        log.warn(`[step1] Server returned HTML instead of XML. Skipping ${row.file_name}.`);
        continue;
      }

      fs.writeFileSync(filePath, res.data);
      downloaded++;

      const metadata = {
        store_code: row.store_code,
        store_name: row.store_name,
        city: row.city,
        company: row.company_name
      };

      const metadataPath = filePath.replace(".xml.gz", ".metadata.json");
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    } catch (err: any) {
      log.warn(`[step1] Failed to download ${row.file_name}: ${err.message}`);
    }
  }

  log.info(`[step1] ✅ Completed successfully. Downloaded ${downloaded} new files.`);
}
