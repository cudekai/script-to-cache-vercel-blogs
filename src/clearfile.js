const path = require("path");
const fs = require("fs").promises;
const { fetch } = require("cross-fetch");
const {
  getLastProcessedIndex,
  setLastProcessedIndex,
} = require("./progress-db");

const OUTPUT_FILE = path.join(__dirname, "/data/", "updated_slugs.json");

(async () => {
  try {
    const data = await fs.readFile(OUTPUT_FILE, "utf8");
    const parsedData = JSON.parse(data);
    const newItems = parsedData.map((item) => ({
      slug: item.slug,
      lang: item.lang,
    }));

    await fs.writeFile(OUTPUT_FILE, JSON.stringify(newItems, null, 2), "utf8");
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log("No previous output found, starting fresh.");
    } else {
      console.error(`Failed to read output file: ${err.message}`);
      return;
    }
  }
})();
