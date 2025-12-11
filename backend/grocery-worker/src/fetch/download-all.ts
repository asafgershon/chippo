import fs from "fs";
import path from "path";
import axios from "axios";
import { log } from "../util/logger";
import { parseMainPage } from "../steps/victory/parse-page";
import { unknown } from 'zod';

const TMP_DIR = path.resolve("tmp");
const PRICES_DIR = path.join(TMP_DIR, "prices");
const PROMOS_DIR = path.join(TMP_DIR, "promos");

export async function downloadAllFiles() {
  // לוודא שהתיקיות קיימות
  fs.mkdirSync(PRICES_DIR, { recursive: true });
  fs.mkdirSync(PROMOS_DIR, { recursive: true });

  log.info("📥 מוריד רשימת קבצים מהאתר...");
  const rows = await parseMainPage();

  for (const row of rows) {
    if (!row.download_url) continue;

    const targetDir = row.file_type === "מחירים" ? PRICES_DIR : PROMOS_DIR;
    const filePath = path.join(targetDir, `${row.file_name}.xml.gz`);

    // אם כבר הורדנו – דלג
    if (fs.existsSync(filePath)) {
      log.info(`⏩ ${row.file_name} כבר קיים`);
      continue;
    }

    const fullURL = `https://laibcatalog.co.il/${row.download_url}`.replace(/\\/, "/");

    log.info(`⬇️ מוריד ${row.file_name}`);
    try {
      const res = await axios.get(fullURL, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, res.data);
    } catch (err) {
      log.warn(`⚠️ שגיאה בהורדה: ${row.file_name}, error=${err}`);
    }
  }

  log.info("✅ הורדה הסתיימה (בפורמט סדרתי)");
}
