import fs from "fs";
import path from "path";
import { log } from "../../util/logger";

const TMP_DIR = path.resolve("tmp");
const XML_DIR = path.join(TMP_DIR, "xml");
const PARSED_DIR = path.join(TMP_DIR, "parsed");

export async function step6_cleanupXml() {
  log.info("[step6] Cleaning XML + parsed files...");

  const xmlFiles = fs.readdirSync(XML_DIR);
  const parsedFiles = fs.readdirSync(PARSED_DIR);

  for (const f of xmlFiles) fs.unlinkSync(path.join(XML_DIR, f));
  for (const f of parsedFiles) fs.unlinkSync(path.join(PARSED_DIR, f));

  log.info("[step6] Cleanup completed.");
}
