const { subClient } = require("../Redis/redisClient");

async function startSubscriber() {
  await subClient.subscribe("rate_block", (message) => {
    const alert = JSON.parse(message);
    console.log("🚨 Rate limit block alert:");
    console.log(`🔒 IP: ${alert.ip}`);
    console.log(`🕒 Retry After: ${alert.retryAfter} seconds`);
    console.log(`📅 Timestamp: ${alert.timestamp}`);
  });
}

startSubscriber();





const { redisClient, pubClient } = require("../Redis/redisClient");

const rateLimiterradispub = async (req, res, next) => {
  const ip = req.ip;
  const key = `rate_limit:${ip}`;
  const windowLimit = 5;
  const windowTTL = 10;
  const blockTTL = 20;

  try {
    const current = await redisClient.get(key);

    if (current !== null) {
      const count = parseInt(current);

      if (count >= windowLimit) {
        const ttl = await redisClient.ttl(key);

        // 🔔 Publish block alert
        await pubClient.publish("rate_block", JSON.stringify({
          ip,
          timestamp: new Date().toISOString(),
          retryAfter: ttl
        }));

        return res.status(429).json({
          error: "⏱ Rate limit exceeded. Try again later.",
          retryAfter: `${ttl} seconds`
        });
      }

      if (count === windowLimit - 1) {
        await redisClient.setEx(key, blockTTL, String(windowLimit));
      } else {
        await redisClient.incr(key);
      }

    } else {
      await redisClient.setEx(key, windowTTL, "1");
    }

    next();
  } catch (err) {
    console.error("Rate limiter error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = rateLimiterradispub;





// redisClient.js
const { createClient } = require("redis");

const redisClient = createClient(); // General Redis commands (GET, SET, etc.)
const pubClient = redisClient.duplicate(); // For publishing messages
const subClient = redisClient.duplicate(); // For subscribing to messages

// Error Handling
redisClient.on("error", (err) => console.error("Redis client error:", err));
pubClient.on("error", (err) => console.error("Redis pub error:", err));
subClient.on("error", (err) => console.error("Redis sub error:", err));

(async () => {
  try {
    await redisClient.connect();
    await pubClient.connect();
    await subClient.connect();
    console.log("✅ Connected to Redis");
  } catch (err) {
    console.error("❌ Redis connection failed:", err);
  }
})();

module.exports = { redisClient, pubClient, subClient };