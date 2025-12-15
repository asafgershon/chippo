window.addEventListener("message", async (event) => {
  if (event.source !== window) return;
  if (event.data?.type !== "CHIPPO_TRANSFER_CART") return;

  console.log("📩 Chippo: קיבלתי בקשה מהאתר", event.data.data);

  // שומר את הנתונים כדי שהבוט ישתמש בהם
  localStorage.setItem(
    "chippoTransferPayload",
    JSON.stringify(event.data.data)
  );

  // פותח את רמי לוי
  window.location.href =
    "https://www.rami-levy.co.il/he/online/market";
});


(async () => {
  /* ========= helpers ========= */
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const TRANSFER_KEY = "chippoTransferPayload";

// אם יש בקשה מהאתר – נשתמש בה
const rawTransfer = localStorage.getItem(TRANSFER_KEY);
if (rawTransfer) {
  console.log("🚀 Chippo: משתמש ב-payload מהאתר");

  const transferPayload = JSON.parse(rawTransfer);

  // שומר כ-queue רגיל (כמו שעבד לך קודם)
  const queue = Object.entries(transferPayload.items).map(
    ([itemId, qty]) => ({
      item: itemId,
      times: Math.ceil(Number(qty)),
    })
  );

  localStorage.setItem("chippoQueue", JSON.stringify(queue));
  localStorage.removeItem(TRANSFER_KEY);

  console.log("📦 Chippo: Queue נוצר מהאתר", queue);

  // ממשיכים רגיל – הבוט שלך כבר יודע לעבוד עם chippoQueue
}

  const PRODUCTS = {
    101: "מלפפון 🥒",
    108: "בצל 🧅",
  };

  const STORAGE_KEY = "chippoQueue";
  const STOP_KEY = "chippoStop";

  /* ========= UI ========= */
  const showStatus = (text, color = "#16a34a") => {
    let bar = document.getElementById("chippo-status");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "chippo-status";
      bar.style.position = "fixed";
      bar.style.top = "0";
      bar.style.left = "0";
      bar.style.right = "0";
      bar.style.zIndex = "999999";
      bar.style.background = color;
      bar.style.color = "white";
      bar.style.padding = "12px";
      bar.style.fontSize = "18px";
      bar.style.fontWeight = "bold";
      bar.style.textAlign = "center";
      bar.style.display = "flex";
      bar.style.justifyContent = "space-between";
      bar.style.alignItems = "center";
      bar.style.gap = "12px";

      const textSpan = document.createElement("span");
      textSpan.id = "chippo-text";

      const stopBtn = document.createElement("button");
      stopBtn.textContent = "⛔ עצור";
      stopBtn.style.background = "#dc2626";
      stopBtn.style.color = "white";
      stopBtn.style.border = "none";
      stopBtn.style.padding = "8px 14px";
      stopBtn.style.fontSize = "16px";
      stopBtn.style.cursor = "pointer";
      stopBtn.onclick = () => {
        localStorage.setItem(STOP_KEY, "1");
        localStorage.removeItem(STORAGE_KEY);
        showStatus("⛔ Chippo נעצר ע״י המשתמש", "#dc2626");
      };

      bar.appendChild(textSpan);
      bar.appendChild(stopBtn);
      document.body.appendChild(bar);
    }
    document.getElementById("chippo-text").textContent = text;
  };

  /* ========= STOP ========= */
  if (localStorage.getItem(STOP_KEY)) {
    showStatus("⛔ Chippo נעצר", "#dc2626");
    return;
  }

  /* ========= wait for + ========= */
  const waitForAddButton = async (timeout = 10000) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const btn = document.querySelector('button[aria-label*="הוסף"]');
      if (btn) return btn;
      await sleep(300);
    }
    return null;
  };

  /* ========= queue ========= */
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  const queue = JSON.parse(raw);
  if (!queue || queue.length === 0) {
    localStorage.removeItem(STORAGE_KEY);
    showStatus("✅ Chippo: הסל הועבר בהצלחה!");
    await sleep(1500);
    location.href = "https://www.rami-levy.co.il/he/online/market";
    return;
  }

  const current = queue[0];
  const name = PRODUCTS[current.item] || `מוצר ${current.item}`;
  const currentItemId = new URLSearchParams(location.search).get("item");

  showStatus(`🛒 Chippo: עובד על ${name}`);

  /* ========= navigation ========= */
  if (currentItemId != current.item) {
    await sleep(800);
    location.href =
      `https://www.rami-levy.co.il/he/online/market/history?item=${current.item}`;
    return;
  }

  /* ========= add product ========= */
  showStatus(`➕ Chippo: מוסיף ${name} לסל...`);

  const btn = await waitForAddButton();
  if (!btn) {
    // אין פלוס → דילוג
    showStatus(`⚠️ ${name} לא זמין – מדלג`, "#ca8a04");
    queue.shift();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    await sleep(1200);
    location.href = "https://www.rami-levy.co.il/he/online/market";
    return;
  }

  // עוד רגע ליציבות UI
  await sleep(700);
  btn.click();

  current.times--;
  if (current.times <= 0) queue.shift();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));

  /* ========= next ========= */
  if (queue.length > 0) {
    await sleep(1500);
    location.href =
      `https://www.rami-levy.co.il/he/online/market/history?item=${queue[0].item}`;
  } else {
    showStatus("✅ Chippo: סיימנו! חוזרים לחנות");
    localStorage.removeItem(STORAGE_KEY);
    await sleep(1500);
    location.href = "https://www.rami-levy.co.il/he/online/market";
  }
})();
