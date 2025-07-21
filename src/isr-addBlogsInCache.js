const path = require("path");
const fs = require("fs").promises;
const { fetch } = require("cross-fetch");

const INPUT_FILE = path.join(__dirname, "/data/", "all_blogs_slug.json");
const OUTPUT_FILE = path.join(__dirname, "/data/", "updated_slugs.json");
const SLUGS_TO_PROCESS = 30000;
const REQUEST_DELAY_MS = 500;
const FETCH_TIMEOUT_MS = 5000;
// START_INDEX will be determined dynamically based on the output file size

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scrapeWebsiteText(url, timeout) {
  if (url.toLowerCase().includes(".pdf")) {
    console.log(`⏩ Skipping PDF URL: ${url}`);
    return { status: "skipped_pdf", content: "" };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  const headers = {
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) " +
      "Chrome/83.0.4103.97 Safari/537.36",
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
    // Basic HTML parsing to extract text content
    const scrapedText = data
      .replace(/<style([\s\S]*?)<\/style>/gi, "") // Remove style tags
      .replace(/<script([\s\S]*?)<\/script>/gi, "") // Remove script tags
      .replace(/<[^>]+>/gi, " ") // Remove all HTML tags
      .replace(/\s+/g, " ") // Replace multiple spaces with a single space
      .trim(); // Trim whitespace from start/end

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

async function getSlugStatusAndContent(url) {
  return scrapeWebsiteText(url, FETCH_TIMEOUT_MS);
}

async function processSlugsFromFile() {
  let masterSlugsData = [];
  let existingProcessedData = [];
  let startIndex = 0; // Initialize dynamically

  try {
    const data = await fs.readFile(INPUT_FILE, "utf8");
    masterSlugsData = JSON.parse(data);
    console.log(
      `Successfully loaded ${masterSlugsData.length} slugs from ${INPUT_FILE}`
    );
  } catch (error) {
    console.error(`Error reading or parsing ${INPUT_FILE}: ${error.message}`);
    return;
  }

  try {
    const data = await fs.readFile(OUTPUT_FILE, "utf8");
    existingProcessedData = JSON.parse(data);
    console.log(
      `Successfully loaded ${existingProcessedData.length} previously processed slugs from ${OUTPUT_FILE}`
    );
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log(
        `${OUTPUT_FILE} not found. Starting with an empty processed data list.`
      );
      existingProcessedData = [];
    } else {
      console.error(
        `Error reading or parsing ${OUTPUT_FILE}: ${error.message}`
      );
      return;
    }
  }

  // Set START_INDEX dynamically
  startIndex = existingProcessedData.length;
  console.log(`Dynamic START_INDEX set to: ${startIndex}`);

  const processedSlugsMap = new Map();
  existingProcessedData.forEach((item) => {
    if (item.slug && item.status) {
      processedSlugsMap.set(item.slug, { ...item });
    }
  });
  console.log(`Found ${processedSlugsMap.size} slugs already with a status.`);

  let newlyProcessedCount = 0;
  // Initialize finalSlugsData with existing processed items that have a status
  // This ensures we don't duplicate entries that were already in the output file
  const finalSlugsData = [...existingProcessedData];

  console.log(
    `Attempting to process up to ${SLUGS_TO_PROCESS} NEW slugs, starting from index ${startIndex}...`
  );

  for (let i = startIndex; i < masterSlugsData.length; i++) {
    const masterItem = masterSlugsData[i];
    const currentSlug = masterItem.slug;

    // This check is primarily for safety, as startIndex should prevent most re-processing
    // but it handles cases where the input file might have duplicates or out-of-order entries
    if (processedSlugsMap.has(currentSlug)) {
      console.log(`⏩ Skipping already processed slug: ${currentSlug} (found in map)`);
      continue;
    }

    if (newlyProcessedCount >= SLUGS_TO_PROCESS) {
      console.log(
        `🚫 Skipping new slug ${i + 1}/${
          masterSlugsData.length
        }: ${currentSlug} (Processing limit reached for new slugs)`
      );
      break; // Exit the loop if the processing limit for new slugs is reached
    }

    console.log(
      `\n--- Processing new slug ${i + 1}/${
        masterSlugsData.length
      } (Newly processed: ${newlyProcessedCount + 1}/${SLUGS_TO_PROCESS}) ---`
    );

    const { status, content } = await getSlugStatusAndContent(currentSlug);

    const newItem = {
      ...masterItem,
      status: status,
      scraped_content: content,
    };
    finalSlugsData.push(newItem);
    processedSlugsMap.set(currentSlug, newItem); // Also update the map with the new item

    newlyProcessedCount++;
    console.log(
      `📈 Progress: ${newlyProcessedCount} of ${SLUGS_TO_PROCESS} new requests completed.`
    );

    // --- Save after each successful request ---
    try {
      await fs.writeFile(
        OUTPUT_FILE,
        JSON.stringify(finalSlugsData, null, 2),
        "utf8"
      );
      console.log(
        `💾 Data saved to ${OUTPUT_FILE} after processing ${currentSlug}.`
      );
    } catch (error) {
      console.error(
        `Error writing to ${OUTPUT_FILE} during loop: ${error.message}`
      );
      // It's generally good to log and continue here, as an intermittent write error
      // shouldn't necessarily stop the entire scraping process.
    }
    // --- End of saving logic ---

    await delay(REQUEST_DELAY_MS);
  }

  console.log(`\n--- Processing complete ---`);
  console.log(`Total slugs in ${INPUT_FILE}: ${masterSlugsData.length}`);
  console.log(`Newly processed in this run: ${newlyProcessedCount}`);
  console.log(
    `Total items in ${OUTPUT_FILE} (all with status): ${finalSlugsData.length}`
  );

  // A final save can still be done, though it might be redundant if saving after each req
  try {
    await fs.writeFile(
      OUTPUT_FILE,
      JSON.stringify(finalSlugsData, null, 2),
      "utf8"
    );
    console.log(
      `✅ Final consolidated and updated data saved to ${OUTPUT_FILE}`
    );
  } catch (error) {
    console.error(
      `Error during final write to ${OUTPUT_FILE}: ${error.message}`
    );
  }
}

processSlugsFromFile();
