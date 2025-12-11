import fs from "fs";
import path from "path";
import zlib from "zlib";
import { log } from "../../util/logger";

const TMP_DIR = path.resolve("tmp/machsanei_hashuk");

function getAllGzipFiles(): string[] {
  const companies = fs.readdirSync(TMP_DIR).filter((f) =>
    fs.statSync(path.join(TMP_DIR, f)).isDirectory()
  );

  const gzipFiles: string[] = [];

  for (const company of companies) {
    const pricesDir = path.join(TMP_DIR, "prices");
    if (!fs.existsSync(pricesDir)) continue;

    const files = fs.readdirSync(pricesDir).filter((f) => f.endsWith(".xml.gz"));
    for (const file of files) {
      gzipFiles.push(path.join(pricesDir, file));
    }
  }
  return gzipFiles;
}


export async function step2_extractFiles() {
  log.info("[step2] Starting extraction from .gz to .xml...");

  // List all price files
  const files = getAllGzipFiles();

  if (files.length === 0) {
    log.info("[step2] No .gz files found. Skipping step 2.");
    return;
  }

  let extracted = 0;
  let skipped = 0;
  let deleted = 0;

  for (const file of files) {
    const gzPath = file;
    const xmlFileName = path.basename(file).replace(".gz", "");
    const company = path.basename(path.dirname(gzPath)); // folder name
    const xmlDir = path.join(TMP_DIR, company, "xml");
    fs.mkdirSync(xmlDir, { recursive: true });

    const xmlPath = path.join(xmlDir, xmlFileName);

    // Skip if already extracted
    if (fs.existsSync(xmlPath)) {
      log.info(`[step2] Skipping (already exists): ${xmlFileName}`);
      skipped++;
      continue;
    }

    let data: Buffer;

    try {
      data = fs.readFileSync(gzPath);
    } catch (err: any) {
      log.error(`[step2] Failed reading file ${file}: ${err.message}`);
      continue;
    }

    // Very small file → corrupted → delete
    if (data.length < 100) {
      log.warn(`[step2] File too small (corrupted): ${file}. Deleting.`);
      fs.unlinkSync(gzPath);
      deleted++;
      continue;
    }

    // Check if it's GZIP file: header bytes 1F 8B
    const isGzip = data[0] === 0x1f && data[1] === 0x8b;

    try {
      log.info(`[step2] Extracting ${file}...`);

      if (isGzip) {
        // Try to unzip
        const unzipped = zlib.gunzipSync(data);

        // Check if unzipped content looks like XML
        if (!unzipped.toString().trim().startsWith("<")) {
          log.warn(`[step2] Unzipped content is not XML! Deleting ${file}.`);
          fs.unlinkSync(gzPath);
          deleted++;
          continue;
        }

        fs.writeFileSync(xmlPath, unzipped);
        // Copy metadata.json into XML folder so worker can read it
        const originalMeta = gzPath.replace(".xml.gz", ".metadata.json");
        const newMeta = xmlPath.replace(".xml", ".metadata.json");

        if (fs.existsSync(originalMeta)) {
          fs.copyFileSync(originalMeta, newMeta);
        }
        extracted++;
      } else {
        // Not gzip → might be XML plain text
        const text = data.toString();

        if (text.startsWith("<Prices")) {
          fs.writeFileSync(xmlPath, data);
          log.warn(`[step2] ${file} is not gzip (plain XML). Saved as XML.`);
          extracted++;
        } else if (text.startsWith("<!DOCTYPE html>")) {
          log.warn(`[step2] Server returned HTML instead of XML. Deleting ${file}.`);
          fs.unlinkSync(gzPath);
          deleted++;
        } else {
          log.warn(`[step2] Unknown file format: ${file}. Deleting.`);
          fs.unlinkSync(gzPath);
          deleted++;
        }
      }

    } catch (err: any) {
      log.error(`[step2] Error extracting ${file}: ${err.message}`);
    }
  }

  log.info(
    `[step2] ✅ Extraction finished. Extracted: ${extracted}, Skipped: ${skipped}, Deleted: ${deleted}`
  );
}
  