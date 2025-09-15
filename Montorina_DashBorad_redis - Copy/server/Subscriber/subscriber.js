// const { subClient } = require("../RedisClient/redis");

// async function startSubscriber(io) {
//   await subClient.subscribe("dashboard_updates", (message) => {
//     try {
//       const payload = JSON.parse(message);
//       io.emit("dashboard_data", payload);
//       console.log(`[Redis -> Socket.IO] Sent update: ${payload.timestamp}`);
//     } catch (err) {
//       console.error("[Subscriber] Invalid Redis message:", err, message);
//     }
//   });
// }

// module.exports = { startSubscriber };




// const { subClient } = require("../RedisClient/redis");

// async function startSubscriber(io) {
//   await subClient.subscribe("metrics:cpu", (message) => {
//     try {
//       io.to("cpu").emit("cpu_update", JSON.parse(message));
//     } catch (err) {
//       console.error("[Subscriber] CPU parse error:", err);
//     }
//   });

//   await subClient.subscribe("metrics:network", (message) => {
//     try {
//       io.to("network").emit("network_update", JSON.parse(message));
//     } catch (err) {
//       console.error("[Subscriber] Network parse error:", err);
//     }
//   });

//   console.log("✅ Subscribers ready for metrics:cpu & metrics:network");
// }

// module.exports = { startSubscriber };
