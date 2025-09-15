require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 9000,
  REDIS_URL: process.env.REDIS_URL || "redis://127.0.0.1:6379",
  METRICS_INTERVAL: parseInt(process.env.METRICS_INTERVAL || "3000", 10),
};
