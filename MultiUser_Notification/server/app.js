const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const router = require("./routes/router");
const redisClient = require("./Redis/redisClient");
const socketHandler = require("./socket/socketHandler"); // ✅ new

const app = express();
const port = 9000;

// ✅ CORS setup
const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
  credentials: true,
};
app.use(express.json());
app.use(cors(corsOptions));
app.use(router);

// ✅ Create HTTP server for Socket.IO
const server = http.createServer(app);

// ✅ Setup Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Delegate socket logic
io.on("connection", (socket) => socketHandler(io, socket));

// ✅ Start server
(async () => {
  try {
    server.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();

// ✅ Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  if (redisClient) await redisClient.quit();
  process.exit(0);
});

module.exports = io;
