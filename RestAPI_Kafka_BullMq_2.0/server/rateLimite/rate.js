const redisClient = require("../Redis/redisClient");

const rateLimiterradis = async (req, res, next) => {
  const ip = req.ip;
  const key = `rate_limit:${ip}`;
  const windowLimit = 20;      // Allow 5 requests
  const windowTTL = 100;       // in 10 seconds
  const blockTTL = 20;        // Block for 20 seconds

  try {
    const value = await redisClient.get(key);
    const ttl = await redisClient.ttl(key);

    console.log(`[Redis] Key: ${key} | Value: ${value} | TTL: ${ttl}s`);

    if (value === "BLOCKED") {
      // User is already blocked
      return res.status(429).json({
        error: "⛔ Too many requests. Try again later.",
        retryAfter: `${ttl} seconds`,
      });
    }

    if (value !== null) {
      const count = parseInt(value);

      if (!isNaN(count)) {
        if (count + 1 >= windowLimit) {
          // 🟥 Hit the 6th request
          console.log(`[Redis] BLOCKING ${key} for ${blockTTL}s`);
          await redisClient.setEx(key, blockTTL, "BLOCKED");

          return res.status(429).json({
            error: "⛔ Too many requests. Try again later.",
            retryAfter: `${blockTTL} seconds`,
          });
        } else {
          console.log(`[Redis] INCREMENT ${key} → ${count + 1}`);
          await redisClient.incr(key);
        }
      } else {
        // If somehow key exists but isn't a number → reset it
        await redisClient.setEx(key, windowTTL, "1");
      }
    } else {
      // 🟢 First request
      console.log(`[Redis] FIRST request → SET ${key} = 1 with TTL ${windowTTL}s`);
      await redisClient.setEx(key, windowTTL, "1");
    }

    next();

  } catch (err) {
    console.error("Rate limiter error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = rateLimiterradis;