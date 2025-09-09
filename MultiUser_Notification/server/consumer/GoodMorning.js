const kafka = require("../client/client");
const NotificationQueue = require("../queues/notificationQueue"); // ✅ fixed name

async function initConsumer() {
  const consumer = kafka.consumer({ groupId: "user-consumer-group" });

  try {
    await consumer.connect();
    console.log("✅ Kafka Consumer connected");

    // ✅ Topic name fixed
    await consumer.subscribe({ topic: process.env.KAFKA_TOPIC || "NotificationQueue", fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const value = message.value.toString();
          const parsed = JSON.parse(value);

          console.log(`📩 Topic: ${topic} | Partition: ${partition}`);
          console.log("👤 User message received:", parsed);

          // Add job to BullMQ for processing
          const job = await NotificationQueue.add("saveUser", parsed, {
            delay: 1000,
            attempts: 3,
            backoff: {
              type: "exponential",
              delay: 1000,
            },
            removeOnComplete: true,
            removeOnFail: false,
          });

          console.log("📥 Job queued:", job.id);
        } catch (err) {
          console.error("❌ Failed to parse message:", err.message);
        }
      },
    });

    process.on("SIGINT", async () => {
      console.log("🛑 Disconnecting Kafka consumer...");
      await consumer.disconnect();
      process.exit(0);
    });
  } catch (err) {
    console.error("❌ Consumer init error:", err.message);
    process.exit(1);
  }
}

initConsumer();
