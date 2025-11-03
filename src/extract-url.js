// extractUrls.js
const fs = require("fs");
const path = require("path");

const extractUrls = () => {
  const xmlPath = path.resolve(__dirname, "sitemap.xml");
  const urlsPath = path.resolve(__dirname, "urls.json");

  // Read XML file
  const xmlData = fs.readFileSync(xmlPath, "utf8");

  // Extract all <loc> URLs using regex
  const urls = [];
  const regex = /<loc>(.*?)<\/loc>/g;
  let match;

  while ((match = regex.exec(xmlData)) !== null) {
    const url = match[1];
    // Keep only URLs containing "/blogs" or "/{lang}/blogs"
    if (/\/[a-z]{2}\/blogs|\/blogs/i.test(url)) {
      urls.push(url);
    }
  }

  // Convert to JSON and save
  fs.writeFileSync(urlsPath, JSON.stringify(urls, null, 2), "utf8");
  console.log(`✅ Saved ${urls.length} blog URLs to ${urlsPath}`);
};

module.exports = { extractUrls };
