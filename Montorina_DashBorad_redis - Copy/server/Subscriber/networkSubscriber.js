const { subClient } = require("../RedisClient/redis");

async function startNetworkSubscriber(io) {
  // Handle Redis connection errors and retries
  subClient.on("error", (err) => {
    console.error("❌ Redis subscriber error:", err);
    setTimeout(async () => {
      try {
        await subClient.connect();
        console.log("✅ Redis subscriber reconnected");
      } catch (reErr) {
        console.error("❌ Redis reconnection failed:", reErr);
      }
    }, 2000);
  });

  try {
    // Subscribe to Network metrics channel
    await subClient.subscribe("metrics:network", (message) => {
      try {
        const data = JSON.parse(message);
        io.to("network").emit("network_update", data); // emit to Network room
      } catch (parseErr) {
        console.error("[Network Subscriber] Parse error:", parseErr);
      }
    });

    console.log("✅ Network Subscriber ready (metrics:network)");
  } catch (err) {
    console.error("[Network Subscriber] Subscription failed:", err);
  }
}

module.exports = { startNetworkSubscriber };
