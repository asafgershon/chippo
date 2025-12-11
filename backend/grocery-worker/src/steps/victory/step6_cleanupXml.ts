import fs from "fs";
import path from "path";
import { log } from "../../util/logger";

const TMP_DIR = path.resolve("tmp/victory");

export async function step6_cleanupXml() {
  log.info("[step6] Starting full cleanup of tmp/victory...");

  if (!fs.existsSync(TMP_DIR)) {
    log.info("[step6] victory folder not found, skipping.");
    return;
  }

  // Read everything inside tmp/victory
  const entries = fs.readdirSync(TMP_DIR);

  for (const entry of entries) {
    const fullPath = path.join(TMP_DIR, entry);

    // Delete folder OR file recursively
    fs.rmSync(fullPath, { recursive: true, force: true });

    log.info(`[step6] Removed: ${entry}`);
  }

  log.info("[step6] Cleanup completed. tmp/victory is now empty.");
}
