// RedisClient/redis.js
const { createClient } = require("redis");

const redisHost = process.env.REDIS_HOST || "127.0.0.1";
const redisPort = process.env.REDIS_PORT || 6379;

const redisClient = createClient({
  url: `redis://${redisHost}:${redisPort}`,
});

const pubClient = redisClient.duplicate();
const subClient = redisClient.duplicate();

function setupErrorHandlers(client, name) {
  client.on("error", (err) => {
    console.error(`❌ Redis ${name} error:`, err);
  });
}

setupErrorHandlers(redisClient, "main");
setupErrorHandlers(pubClient, "publisher");
setupErrorHandlers(subClient, "subscriber");

async function connectRedis() {
  try {
    await redisClient.connect();
    await pubClient.connect();
    await subClient.connect();
    console.log(`✅ Connected to Redis at ${redisHost}:${redisPort}`);
  } catch (err) {
    console.error("❌ Redis connection failed:", err);
    process.exit(1); // exit app if Redis is critical
  }
}

module.exports = { redisClient, pubClient, subClient, connectRedis };
