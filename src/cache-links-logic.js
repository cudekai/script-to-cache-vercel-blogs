// check-broken-urls.js
const fs = require("fs").promises;
const path = require("path");
const axios = require("axios");
const {
  getLastProcessedIndex,
  setLastProcessedIndex,
} = require("./progress-db");
const { asyncPoolCallback } = require("./helpers");

const urlsPath = path.resolve(__dirname, "urls.json");
const brokenUrlsPath = path.resolve(__dirname, "brokenUrls.json");

let isRunning = false;
let currentIndex = 0;
let total = 0;

async function cacheUrlsBackground() {
  if (isRunning) {
    console.log("⚠️ A check is already running...");
    return;
  }

  isRunning = true;

  const urls = JSON.parse(await fs.readFile(urlsPath, "utf8"));

  let brokenUrls = [];
  try {
    brokenUrls = JSON.parse(await fs.readFile(brokenUrlsPath, "utf8"));
  } catch {
    brokenUrls = [];
  }

  total = urls.length;
  currentIndex = await getLastProcessedIndex();
  console.log(
    `▶️ Starting parallel check from index ${currentIndex} of ${total}`
  );

  const remainingUrls = urls.slice(currentIndex);

  await asyncPoolCallback(
    remainingUrls.map((url, idx) => ({ url, index: currentIndex + idx })),
    async ({ url, index }) => {
      try {
        const res = await axios.get(url, {
          validateStatus: () => true,
          timeout: 5000,
        });
        if (res.status === 404) {
          console.log(`❌ [${index + 1}/${total}] 404: ${url}`);
          brokenUrls.push(url);
          await fs.writeFile(
            brokenUrlsPath,
            JSON.stringify(brokenUrls, null, 2)
          );
        } else {
          console.log(`✅ ${url} [${index + 1}/${total}] OK (${res.status})`);
        }
      } catch (err) {
        console.log(
          `⚠️ [${index + 1}/${total}] Error fetching ${url}: ${err.message}`
        );
        brokenUrls.push(url);
        await fs.writeFile(brokenUrlsPath, JSON.stringify(brokenUrls, null, 2));
      }

      currentIndex = index + 1;
      await setLastProcessedIndex(currentIndex);
    },
    3 // concurrency = 3
  );

  isRunning = false;
  console.log("🎉 Completed all URL checks.");
}

function getCheckStatus() {
  return {
    isRunning,
    currentIndex,
    total,
  };
}

module.exports = { cacheUrlsBackground, getCheckStatus };
