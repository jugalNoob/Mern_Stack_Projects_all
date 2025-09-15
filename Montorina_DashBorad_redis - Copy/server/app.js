const express = require("express");
const http = require("http");
const { initSocket } = require("./sockets/io");
const {  startCpuSubscriber} = require("./Subscriber/cpuSubscriber");
const {startNetworkSubscriber }=require('./Subscriber/networkSubscriber')
const { startPublishing } = require("./Publisher/publisher");
const { connectRedis } = require("./RedisClient/redis");
const { PORT } = require("./config");

const app = express();
const server = http.createServer(app);

// Option 1: Call each subscriber directly
(async () => {
  await connectRedis();

  const io = initSocket(server);

  // Start Redis subscribers individually
  await  startCpuSubscriber(io);
  await startNetworkSubscriber (io);

  await startPublishing();

  server.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
})();

// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const { subClient } = require("./RedisClient/redis");

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000", // React frontend
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// // Handle client connections
// io.on("connection", (socket) => {
//   console.log(`[Socket.IO] Client connected: ${socket.id}`);

//   socket.on("disconnect", () => {
//     console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
//   });
// });

// // Subscribe to Redis updates
// (async () => {
//   await subClient.subscribe("dashboard_updates", (message) => {
//     try {
//       const payload = JSON.parse(message);
//       io.emit("dashboard_data", payload);
//       console.log(`[Redis -> Socket.IO] Sent update: ${payload.timestamp}`);
//     } catch (err) {
//       console.error("[Server] Invalid Redis message:", err, message);
//     }
//   });
// })();

// const PORT = process.env.PORT || 9000;
// server.listen(PORT, () => {
//   console.log(`[Server] Listening on port ${PORT}`);
// });
