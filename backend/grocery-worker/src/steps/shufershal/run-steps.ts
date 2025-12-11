import { log } from "../../util/logger";

import { step1_downloadPrices } from "./step1_downloadPrices";
import { step2_extractFiles } from "./step2_extractFiles";
import { step3_parseXml } from "./step3_parseXml";
import { step4_mergeData } from "./step4_mergeData";
import { step5_insertDb } from "./step5_insertDb";
import { step6_cleanupXml } from "./step6_cleanupXml";

export async function runShufershal() {
  log.info("🚀 Starting all steps...");

  // ---- Step 1 ----
  log.info("[step1] Starting price file download...");
  await step1_downloadPrices();
  log.info("[step1] Completed.");

  // ---- Step 2 ----
  log.info("[step2] Starting extraction of .gz files...");
  await step2_extractFiles();
  log.info("[step2] Completed.");

  // ---- Step 3 ----
  log.info("[step3] Starting XML parsing...");
  await step3_parseXml();
  log.info("[step3] Completed.");

  // ---- Step 4 ----
  log.info("[step4] Starting data merge...");
  await step4_mergeData();
  log.info("[step4] Completed.");

  // ---- Step 5 ----
  log.info("[step5] Starting database insertion...");
  await step5_insertDb();
  log.info("[step5] Completed.");

  // ---- Step 6 ----
  log.info("[step6] Starting cleanup of XML files...");
  await step6_cleanupXml();
  log.info("[step6] Completed.");

  log.info("🎉 All steps finished successfully!");
}
