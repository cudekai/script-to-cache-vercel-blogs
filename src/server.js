const express = require("express");
const path = require("path");
const {
  getLastProcessedIndex,
  setLastProcessedIndex,
  resetStorage,
} = require("./progress-db");

const fs = require("fs").promises;

const app = express();
const port = process.env.PORT || 8002;

// 📥 Download the processed slugs file
app.get("/download-processed-slugs", (req, res) => {
  console.log("📥 Download request received");

  const jsonFilePath = path.join(__dirname, "./data/", "updated_slugs.json");

  res.download(jsonFilePath, "updated_slugs.json", (err) => {
    if (err) {
      console.error("❌ Error downloading file:", err);
      res.status(500).send("Could not download file.");
    }
  });
});

app.get("/count-processed-slugs", async (req, res) => {
  const jsonFilePath = path.join(__dirname, "./data/", "updated_slugs.json");

  try {
    const fileContent = await fs.readFile(jsonFilePath, "utf8");
    const data = JSON.parse(fileContent);
    const count = Array.isArray(data) ? data.length : 0;

    res.json({ count });
  } catch (error) {
    console.error("Error reading processed slugs file:", error.message);
    res.status(500).json({ error: "Failed to read processed slugs file." });
  }
});

app.get("/last-processed-item", async (req, res) => {
  const index = await getLastProcessedIndex();
  res.json({ lastProcessedIndex: index });
});

app.get("/set-processed-item", async (req, res) => {
  const { index } = req.query;

  if (!index || isNaN(index)) {
    return res.status(400).json({ error: "Invalid 'index' query param." });
  }

  const parsedIndex = parseInt(index, 10);
  await setLastProcessedIndex(parsedIndex);
  res.json({ success: true, lastProcessedIndex: parsedIndex });
});

app.get("/reset-processed-item", async (req, res) => {
  await resetStorage();
  res.json({ success: true });
});

// 🚀 Start server
app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
