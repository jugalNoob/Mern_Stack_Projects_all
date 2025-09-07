const kafka = require("../client/client");
let producer;

async function initProducer() {
  try {
    producer = kafka.producer();
    await producer.connect();
    console.log("✅ Kafka Producer connected post data ");
  } catch (error) {
    console.error("❌ Kafka init error:", error.message);
  }
}

async function PostsendMessage(topic, messageObj) {
  try {
    if (!producer) throw new Error("Kafka producer is not initialized.");

    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(messageObj) }],
    });

    console.log(`📩 Sent to "${topic}":`, messageObj);
  } catch (error) {
    console.error("❌ Kafka send error:", error.message || error);
    throw error;
  }
}

async function disconnectProducer() {
  try {
    if (producer) {
      await producer.disconnect();
      console.log("✅ Kafka Producer disconnected");
    }
  } catch (error) {
    console.error("❌ Disconnect error:", error.message);
  }
}

process.on("SIGINT", async () => {
  await disconnectProducer();
  process.exit(0);
});

module.exports = { initProducer, PostsendMessage };
