const express = require("express");
const path = require("path");
const {
  getLastProcessedIndex,
  setLastProcessedIndex,
  resetStorage,
} = require("./progress-db");
const { LANGUAGES } = require("./constant");
const axios = require("axios");
const { extractUrls } = require("./extract-url");
const { cacheUrlsBackground, getCheckStatus } = require("./cache-links-logic");

const fs = require("fs").promises;

const app = express();
const port = process.env.PORT || 8002;

app.get("/extract-urls", async (req, res) => {
  extractUrls();
  res.send({ msg: "Extracted urls successfully!" });
});

app.get("/test-single-url", async (req, res) => {
  const { url } = req.query;
  console.log("url ", url);
  try {
    const vercelRes = await axios.get(url);
    console.log("res", vercelRes.status);
    return res.send({ message: "req resolved", url });
  } catch (err) {
    console.log("err occured", err);
    res.status(500).send({ message: "err req received", status: err });
  }
});

// Start the process in the background
app.get("/cache-urls", async (req, res) => {
  cacheUrlsBackground(); // non-blocking
  res.json({ success: true, message: "Started background URL check" });
});

app.get("/latest-processed-item", async (req, res) => {
  try {
    const item = await getLastProcessedIndex();
    res.json({ success: true, item });
  } catch (err) {
    console.log("err in latest-processed-item finding");
  }
});

// Get current progress
app.get("/check-status", (req, res) => {
  const status = getCheckStatus();
  res.json(status);
});

app.get("/reset-processed-item", async (req, res) => {
  await resetStorage();
  res.json({ success: true });
});

// 🚀 Start server
app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
