const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const socketRegistry = require("../socket/socketRegistry"); // ✅ import mapping
const io = require("../server"); // reuse io from server.js

// Redis connection with required BullMQ config
const connection = new IORedis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null, // 🔧 Required for BullMQ to work properly
});

function createWorker() {
  const worker = new Worker(
    "NotificationQueue",
    async (job) => {
      console.log("⚙️ Processing job:", job.data);

      // Simulate processing (e.g., email, DB save)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const { userId, message } = job.data;

      // ✅ Lookup correct socket for this user
      const socketId = socketRegistry.getSocket(userId);
      if (socketId) {
        io.to(socketId).emit("notification", {
          jobId: job.id,
          userId,
          message,
        });
        console.log(`📡 Sent notification to ${userId}: ${message}`);
      } else {
        console.log(`💤 User ${userId} is offline, storing for later`);
      }
    },
    { connection, concurrency: 5 }
  );

  worker.on("completed", (job) => {
    console.log(`✅ Job ${job.id} completed successfully`);
  });

  worker.on("failed", (job, err) => {
    console.error(`❌ Job ${job?.id} failed:`, err.message);
  });

  console.log("🚀 BullMQ worker for 'NotificationQueue' is running...");
  return worker;
}

// Graceful shutdown
async function closeWorker(worker) {
  try {
    if (worker) {
      await worker.close();
      console.log("✅ Worker closed");
    }
  } catch (err) {
    console.error("❌ Error closing worker:", err);
  }
}

module.exports = { createWorker, closeWorker };
