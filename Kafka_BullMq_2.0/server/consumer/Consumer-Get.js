// consumer.js
const kafka = require("../client/client");
const connectDB = require("../db/conn");

async function initConsumer() {
  const consumer = kafka.consumer({ groupId: "user-consumer-group" });

  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    await consumer.connect();
    console.log("✅ Kafka Consumer connected");

    await consumer.subscribe({ topic: "get_user", fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const value = message.value.toString();
          const parsed = JSON.parse(value);

          console.log(`📩 Topic: ${topic} | Partition: ${partition}`);
          console.log("👤 Users received:", parsed);

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