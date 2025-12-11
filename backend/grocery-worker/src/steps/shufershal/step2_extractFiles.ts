import fs from "fs";
import path from "path";
import zlib from "zlib";
import { log } from "../../util/logger";

const TMP_DIR = path.resolve("tmp");
const SHUFERSAL_DIR = path.join(TMP_DIR, "shufersal", "prices");
const XML_DIR = path.join(TMP_DIR, "shufersal", "xml");

export async function step2_extractFiles() {
  log.info("[shufersal-step2] Extracting XML from .gz ...");

  fs.mkdirSync(XML_DIR, { recursive: true });

  // all .gz files
  const files = fs.readdirSync(SHUFERSAL_DIR).filter(f => f.endsWith(".gz"));

  if (files.length === 0) {
    log.info("[shufersal-step2] No .gz files found.");
    return;
  }

  let extracted = 0;
  let skipped = 0;

  for (const file of files) {
    const gzPath = path.join(SHUFERSAL_DIR, file);

    // output name = same but .xml instead of .gz
    const xmlFileName = file.replace(".gz", ".xml");
    const xmlPath = path.join(XML_DIR, xmlFileName);

    if (fs.existsSync(xmlPath)) {
      skipped++;
      continue;
    }

    const gzData = fs.readFileSync(gzPath);

    try {
      const xmlBuffer = zlib.gunzipSync(gzData);
      fs.writeFileSync(xmlPath, xmlBuffer);
      extracted++;

      log.info(`[shufersal-step2] Extracted → ${xmlFileName}`);
    } catch (err: any) {
      log.error(`[shufersal-step2] Failed extracting ${file}: ${err.message}`);
    }
  }

  log.info(
    `[shufersal-step2] Done. Extracted ${extracted}, skipped ${skipped}.`
  );
}
