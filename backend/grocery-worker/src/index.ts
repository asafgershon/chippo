import cron from "node-cron";
import { runShufershal } from "./steps/shufershal/run-steps";
import { runVictory } from "./steps/victory/run-steps";
import { runMahsaneiHaShuk } from "./steps/Mahsanei_HaShuk/run-steps";
import { log } from "./util/logger";

let running = false;
async function safeRun() {
  if (running) return;
  running = true;
  try {
    log.info("🔄 Running scheduled sync...");
    await Promise.allSettled([
      //runShufershal(),
      //runVictory(),
      runMahsaneiHaShuk(),
    ]);
    log.info("✅ Sync completed.");
  } catch (err) {
    log.error("❌ Error during sync:", err);
  } finally {
    running = false;
  }
}

// הרצה מיידית
safeRun();

// תזמון יומי ב־08:00 שעון ישראל
cron.schedule("0 8 * * *", () => {
  log.info("⏰ Scheduled run triggered (08:00)");
  safeRun();
}, { timezone: "Asia/Jerusalem" });

log.info("[Worker] Running and waiting for schedule...");
