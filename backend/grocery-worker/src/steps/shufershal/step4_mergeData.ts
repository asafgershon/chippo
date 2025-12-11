import fs from "fs";
import path from "path";
import { Worker } from "worker_threads";
import { log } from "../../util/logger";
import { PriceRowParsed } from "../../db/types";

const TMP_DIR = path.resolve("tmp");
const PARSED_DIR = path.join(TMP_DIR, "parsed");
const MERGED_PATH = path.join(TMP_DIR, "merged.json");

const THREAD_COUNT = 6;

// מפעיל worker שיקרא ויחזיר את המערך מהקובץ
function runWorker(filePath: string): Promise<PriceRowParsed[]> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, "mergeWorker.js"), {
      workerData: { filePath }
    });

    worker.on("message", (rows) => resolve(rows));
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with code ${code}`));
    });
  });
}

export async function step4_mergeData() {
  log.info("[step4] Starting merge...");

  const files = fs.readdirSync(PARSED_DIR).filter((f) => f.endsWith(".json"));
  if (files.length === 0) {
    log.info("[step4] No JSON files found. Skipping.");
    return;
  }

  const queue: Promise<PriceRowParsed[]>[] = [];
  const merged: PriceRowParsed[] = [];

  for (const file of files) {
    const filePath = path.join(PARSED_DIR, file);

    // הגבלת כמות תרדים
    if (queue.length >= THREAD_COUNT) {
      const finished = await Promise.race(queue);
      merged.push(...finished);
      queue.splice(queue.indexOf(Promise.resolve(finished)), 1);
    }

    const job = runWorker(filePath);
    queue.push(job);
  }

  // חכה לכל התרדים הנות remaining
  const results = await Promise.all(queue);
  for (const arr of results) merged.push(...arr);

  fs.writeFileSync(MERGED_PATH, JSON.stringify(merged));
  log.info(`[step4] Completed merge. Total rows: ${merged.length.toLocaleString()}`);
}
