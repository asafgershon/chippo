import fs from "fs";
import path from "path";
import { Worker } from "worker_threads";
import { log } from "../../util/logger";
import { PriceRowParsed } from "../../db/types";

const TMP_DIR = path.resolve("tmp/machsanei_hashuk");
const PARSED_DIR = path.join(TMP_DIR, "parsed");
const MERGED_PATH = path.join(TMP_DIR, "merged.json");

const THREAD_COUNT = 6;

// Run worker to read one JSON file
function runWorker(filePath: string): Promise<PriceRowParsed[]> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, "mergeWorker.js"), {
      workerData: { filePath }
    });

    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with code ${code}`));
    });
  });
}

export async function step4_mergeData() {
  log.info("[step4] Starting merge...");

  if (!fs.existsSync(PARSED_DIR)) {
    log.info("[step4] No parsed folder found. Skipping.");
    return;
  }

  const files = fs.readdirSync(PARSED_DIR).filter((f) => f.endsWith(".json"));
  if (files.length === 0) {
    log.info("[step4] No JSON files found. Skipping.");
    return;
  }

  log.info(`[step4] Merging ${files.length} files...`);

  const merged: PriceRowParsed[] = [];
  const queue: {
    promise: Promise<{ rows: PriceRowParsed[]; file: string }>;
    file: string;
  }[] = [];

  // Helper to wrap worker output with file name
  const wrap = (file: string, p: Promise<PriceRowParsed[]>) =>
    p.then((rows) => ({ rows, file }));

  for (const file of files) {
    const full = path.join(PARSED_DIR, file);

    const wrappedPromise = wrap(file, runWorker(full));
    queue.push({ promise: wrappedPromise, file });

    // If too many threads — wait for one to finish
    if (queue.length >= THREAD_COUNT) {
      const finished = await Promise.race(queue.map((q) => q.promise));

      merged.push(...finished.rows);

      // Remove finished job from queue
      const idx = queue.findIndex((q) => q.file === finished.file);
      if (idx >= 0) queue.splice(idx, 1);
    }
  }

  // Wait for all remaining workers
  const remaining = await Promise.all(queue.map((q) => q.promise));
  for (const r of remaining) merged.push(...r.rows);

  fs.writeFileSync(MERGED_PATH, JSON.stringify(merged));

  log.info(
    `[step4] Completed merge. Total rows: ${merged.length.toLocaleString()}`
  );
}
