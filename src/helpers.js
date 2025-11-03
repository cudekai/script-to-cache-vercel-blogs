const { PromisePool } =  require("@supercharge/promise-pool");

const asyncPoolCallback = (data, callback, concurrency = 3) =>
  PromisePool.withConcurrency(concurrency).for(data).process(callback);

module.exports = { asyncPoolCallback };
