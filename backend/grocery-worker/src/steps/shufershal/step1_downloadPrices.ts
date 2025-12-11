import fs from "fs";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";
import { log } from "../../util/logger";

const BASE_URL = "https://prices.shufersal.co.il/";
const TMP_DIR = path.resolve("tmp");
const SHUFERSAL_DIR = path.join(TMP_DIR, "shufersal", "prices");

export async function step1_downloadPrices() {
  log.info("[shufersal-step1] Starting download of Be'er Sheva files...");

  fs.mkdirSync(SHUFERSAL_DIR, { recursive: true });

  let page = 1;
  let totalDownloaded = 0;

  while (true) {
    const url = `${BASE_URL}?page=${page}`;
    log.info(`[shufersal-step1] Fetching page ${page}: ${url}`);

    const html = await fetchPage(url);

    if (!html) {
      log.warn(`[shufersal-step1] Empty page, stopping.`);
      break;
    }

    const $ = cheerio.load(html);
    const rows = $("tr.webgrid-row-style");

    if (rows.length === 0) {
      log.info(`[shufersal-step1] No more rows on page ${page}. Stopping.`);
      break;
    }

    for (const row of rows) {
      const tds = $(row).find("td");

      const downloadUrl = $(tds[0]).find("a").attr("href");
      const branchName = $(tds[5]).text().trim();
      const fileName = $(tds[6]).text().trim(); // Example: Price7290027600007-049-202511171800

      if (!downloadUrl || !branchName || !fileName) continue;

      // 🔍 Filter only Be'er Sheva based on branch text
      if (!isBeerSheva(branchName)) continue;

      const finalUrl = makeAbsoluteUrl(downloadUrl);

      const filePath = path.join(SHUFERSAL_DIR, `${fileName}.gz`);

      if (fs.existsSync(filePath)) {
        log.info(`[shufersal-step1] Skipping existing: ${fileName}`);
        continue;
      }

      log.info(`[shufersal-step1] Downloading ${fileName} (${branchName}) ...`);

      try {
        const data = await axios.get(finalUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(filePath, data.data);
        totalDownloaded++;
      } catch (err: any) {
        log.warn(`[shufersal-step1] Failed to download ${fileName}: ${err.message}`);
      }
    }

    // 🔄 Check if this page has a ">>" (next page)
    const hasNext = $('a[href*="page="]').filter((i, el) => {
      return $(el).text().includes(">>");
    }).length > 0;

    if (!hasNext) {
      log.info(`[shufersal-step1] No more pages after ${page}. Finished.`);
      break;
    }

    page++;
  }

  log.info(`[shufersal-step1] ✅ Done. Total downloaded: ${totalDownloaded}`);
}

async function fetchPage(url: string): Promise<string | null> {
  try {
    const res = await axios.get(url, { timeout: 15000 });
    return res.data;
  } catch (e: any) {
    log.warn(`[shufersal-step1] Failed to fetch page ${url}: ${e.message}`);
    return null;
  }
}

function isBeerSheva(branch: string): boolean {
  const cleaned = branch.replace(/\s+/g, " ").trim();
  return (
    cleaned.includes("ב\"ש") ||
    cleaned.includes("באר שבע") ||
    cleaned.includes("ב\"ש-") ||
    cleaned.includes("ב\"ש ") ||
    cleaned.includes("ב\"ש־") // כולל מקף עברי
  );
}

function makeAbsoluteUrl(link: string): string {
  if (link.startsWith("http")) return link;
  return BASE_URL + link.replace(/^\//, "");
}
