const path = require("path");
const fs = require("fs").promises;
const { fetch } = require("cross-fetch");
const {
  getLastProcessedIndex,
  setLastProcessedIndex,
} = require("./progress-db");

const INPUT_FILE = path.join(__dirname, "/data/", "recent-blog-urls.json");
const OUTPUT_FILE = path.join(__dirname, "/data/", "updated_slugs.json");
const SLUGS_TO_PROCESS = 30000;
const REQUEST_DELAY_MS = 500;
const FETCH_TIMEOUT_MS = 5000;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scrapeWebsiteText(url, timeout) {
  if (url.toLowerCase().includes(".pdf")) {
    console.log(`⏩ Skipping PDF URL: ${url}`);
    return { status: "skipped_pdf", content: "" };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const headers = {
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/83.0.4103.97 Safari/537.36",
    connection: "keep-alive",
  };

  try {
    const fetchResult = await fetch(url, {
      headers,
      signal: controller.signal,
    });

    if (!fetchResult.ok) {
      console.warn(
        `⚠️ Fetch failed for: ${url} (Status: ${fetchResult.status})`
      );
      return { status: `failed_http_${fetchResult.status}`, content: "" };
    }

    const data = await fetchResult.text();
    const scrapedText = data
      .replace(/<style([\s\S]*?)<\/style>/gi, "")
      .replace(/<script([\s\S]*?)<\/script>/gi, "")
      .replace(/<[^>]+>/gi, " ")
      .replace(/\s+/g, " ")
      .trim();

    console.log(`✅ Successfully scraped: ${url}`);
    return { status: "successful", content: scrapedText };
  } catch (err) {
    if (err.name === "AbortError") {
      console.error(`❌ Request timed out for: ${url}`);
      return { status: "failed_timeout", content: "" };
    } else {
      console.error(`❌ Error scraping ${url}: ${err.message}`);
      return { status: "failed_error", content: "" };
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

async function processSlugsFromFile() {
  let masterSlugsData = [];
  let existingProcessedData = [];
  const finalSlugsData = [];

  // Load all slugs
  try {
    const data = await fs.readFile(INPUT_FILE, "utf8");
    masterSlugsData = JSON.parse(data);
    console.log(`Loaded ${masterSlugsData.length} slugs from input`);
  } catch (err) {
    console.error(`Failed to read input file: ${err.message}`);
    return;
  }

  // Load existing output file
  try {
    const data = await fs.readFile(OUTPUT_FILE, "utf8");
    existingProcessedData = JSON.parse(data);
    finalSlugsData.push(...existingProcessedData);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log("No previous output found, starting fresh.");
    } else {
      console.error(`Failed to read output file: ${err.message}`);
      return;
    }
  }

  // Load last index from progress store
  let startIndex = await getLastProcessedIndex();
  console.log(`🔁 Resuming from index ${startIndex}`);

  let newlyProcessedCount = 0;

  for (let i = startIndex; i < masterSlugsData.length; i++) {
    const masterItem = masterSlugsData[i];
    const { slug } = masterItem;

    if (newlyProcessedCount >= SLUGS_TO_PROCESS) {
      console.log(`🚫 Processing limit reached: ${SLUGS_TO_PROCESS}`);
      break;
    }

    console.log(`\n--- Processing slug ${i + 1}/${masterSlugsData.length} ---`);

    const { status, content } = await scrapeWebsiteText(slug, FETCH_TIMEOUT_MS);

    const newItem = {
      ...masterItem,
      status,
    };

    finalSlugsData.push(newItem);
    newlyProcessedCount++;

    // Save progress
    try {
      await fs.writeFile(
        OUTPUT_FILE,
        JSON.stringify(finalSlugsData, null, 2),
        "utf8"
      );
      await setLastProcessedIndex(i + 1);
      console.log(`💾 Saved after ${slug}`);
    } catch (err) {
      console.error(`Failed to write progress: ${err.message}`);
    }

    await delay(REQUEST_DELAY_MS);
  }

  console.log(`\n✅ Done. Newly processed: ${newlyProcessedCount}`);
  console.log(`Total slugs now in output: ${finalSlugsData.length}`);
}

processSlugsFromFile();
