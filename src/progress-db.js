const storage = require("node-persist");
const fs = require("fs").promises;
const path = require("path");

const STORE_DIR = path.join(__dirname, "./data/progress-store");
let isInitialized = false;

async function initStore() {
  if (isInitialized) return;

  try {
    await storage.init({
      dir: STORE_DIR,
      stringify: JSON.stringify,
      parse: JSON.parse,
      encoding: "utf8",
      logging: false,
      ttl: false,
    });

    isInitialized = true;
  } catch (err) {
    console.error("❌ Failed to initialize storage:", err.message);
    throw err;
  }
}

async function getLastProcessedIndex() {
  await initStore();

  try {
    const index = await storage.getItem("lastProcessedIndex");

    if (typeof index !== "number" || isNaN(index) || index < 0) {
      console.warn(
        "⚠️ Invalid or missing lastProcessedIndex. Falling back to 0."
      );
      return 0;
    }

    return index;
  } catch (err) {
    console.error(
      "❌ Error reading from storage. Will attempt to reset:",
      err.message
    );

    // Fallback recovery: reset storage and retry once
    try {
      await fs.rm(STORE_DIR, { recursive: true, force: true });
      isInitialized = false;
      await initStore();
      const retryIndex = await storage.getItem("lastProcessedIndex");
      return typeof retryIndex === "number" ? retryIndex : 0;
    } catch (retryErr) {
      console.error("❌ Retry after reset failed:", retryErr.message);
      return 0;
    }
  }
}

async function setLastProcessedIndex(index) {
  await initStore();

  if (typeof index !== "number" || isNaN(index) || index < 0) {
    throw new Error("Invalid index provided to setLastProcessedIndex.");
  }

  await storage.setItem("lastProcessedIndex", index);
}

async function resetStorage() {
  await initStore();
  await storage.removeItem("lastProcessedIndex");
}

module.exports = {
  getLastProcessedIndex,
  setLastProcessedIndex,
  resetStorage,
};
