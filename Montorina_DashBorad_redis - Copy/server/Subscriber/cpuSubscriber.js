const { subClient } = require("../RedisClient/redis");

async function startCpuSubscriber(io) {
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
    // Subscribe to CPU metrics channel
    await subClient.subscribe("metrics:cpu", (message) => {
      try {
        const data = JSON.parse(message);
        io.to("cpu").emit("cpu_update", data); // emit to CPU room
      } catch (parseErr) {
        console.error("[CPU Subscriber] Parse error:", parseErr);
      }
    });

    console.log("✅ CPU Subscriber ready (metrics:cpu)");
  } catch (err) {
    console.error("[CPU Subscriber] Subscription failed:", err);
  }
}

module.exports = { startCpuSubscriber };
