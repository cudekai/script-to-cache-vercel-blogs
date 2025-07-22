const storage = require("node-persist");

async function initStore() {
  await storage.init({
    dir: "./data/progress-store",
    stringify: JSON.stringify,
    parse: JSON.parse,
    encoding: "utf8",
    logging: false,
    ttl: false,
  });
}

async function getLastProcessedIndex() {
  await initStore();
  return (await storage.getItem("lastProcessedIndex")) || 0;
}

async function setLastProcessedIndex(index) {
  await initStore();
  await storage.setItem("lastProcessedIndex", index);
}

async function resetStorage(index) {
  await initStore();
  await storage.del("lastProcessedIndex");
}

module.exports = {
  getLastProcessedIndex,
  setLastProcessedIndex,
  resetStorage,
};
