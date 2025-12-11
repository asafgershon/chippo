const fs = require("fs");
const { workerData, parentPort } = require("worker_threads");

try {
  const content = fs.readFileSync(workerData.filePath, "utf8");
  const rows = JSON.parse(content);
  parentPort.postMessage(rows);
} catch (err) {
  parentPort.postMessage([]);
}
