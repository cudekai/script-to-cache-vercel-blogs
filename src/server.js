const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 8002;

// API route to download the file
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

// Start server
app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
