import fs from "fs";
import path from "path";
import { Worker } from "worker_threads";
import { log } from "../../util/logger";

const XML_DIR = path.resolve("tmp/victory/prices/xml");
const PARSED_DIR = path.resolve("tmp/victory/parsed");

// כמה תרדים עוברים במקביל
const THREAD_COUNT = 6;

// ריצה של קובץ XML אחד בתוך worker thread
function runWorker(xmlPath: string, jsonPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, "xmlWorker.js"), {
      workerData: { xmlPath, jsonPath }
    });

    worker.on("message", (count) => resolve(count)); // מספר מוצרים
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with code ${code}`));
    });
  });
}

export async function step3_parseXml() {
  log.info("[step3] Starting XML parsing...");

  fs.mkdirSync(PARSED_DIR, { recursive: true });

  const files = fs.readdirSync(XML_DIR).filter(f => f.endsWith(".xml"));
  if (files.length === 0) {
    log.info("[step3] No XML files found. Skipping.");
    return;
  }

  let totalParsed = 0;
  let processed = 0;

  // Queue of tasks
  const queue: Promise<void>[] = [];
  
  for (const file of files) {
    const xmlPath = path.join(XML_DIR, file);
    const jsonPath = path.join(PARSED_DIR, file.replace(".xml", ".json"));

    if (fs.existsSync(jsonPath)) {
      processed++;
      continue;
    }

    // כשיש יותר מדי תרדים — חכה
    if (queue.length >= THREAD_COUNT) {
      await Promise.race(queue);
    }

    const job = runWorker(xmlPath, jsonPath)
      .then((count) => {
        totalParsed += count;
        processed++;
      })
      .catch((err) => {
        log.error(`[step3] Error parsing ${file}: ${err.message}`);
        processed++;
      })
      .finally(() => {
        // הסר את העבודה מהתור
        const idx = queue.indexOf(job);
        if (idx >= 0) queue.splice(idx, 1);
      });

    queue.push(job);
  }

  // חכה לסיום כל העבודות
  await Promise.all(queue);

  log.info(`[step3] Completed. Parsed ${totalParsed.toLocaleString()} total items.`);
}
