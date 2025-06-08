// common.js
const STORAGE_KEY = "smartFridgeInventory";

// 讀取現有庫存
function getInventory() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

// 儲存庫存陣列
function saveInventory(inv) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inv));
}

// 新增一筆食材
function addItem(name, qty, exp) {
  const inv = getInventory();
  inv.push({ name, qty, exp });
  saveInventory(inv);
}

// 刪除食材（依 index）
function delItem(idx) {
  const inv = getInventory();
  inv.splice(idx, 1);
  saveInventory(inv);
}

// 計算即將到期清單（當天或未來 n 天內）
function getReminders(daysAhead = 2) {
  const today = new Date();
  return getInventory().filter(item => {
    const diff = (new Date(item.exp) - today) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= daysAhead;
  });
}
