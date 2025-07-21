const fs = require("fs").promises;
const path = require("path");
const OUTPUT_FILE = path.join(__dirname, "/data/", "updated_slugs.json");

(async () => {
  const data = await fs.readFile(OUTPUT_FILE, "utf8");
  const arr = JSON.parse(data);
  console.log(arr.length);
})();
