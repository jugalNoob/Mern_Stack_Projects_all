// producer_del.js
const kafka = require("../client/client");
let producer;

async function initProducer() {
  if (!producer) {
    producer = kafka.producer();
    await producer.connect();
    console.log("✅ Kafka Producer connected deltete");
  }
}

async function sendMessagedelete(topic, message) {
  try {
    // lazy init
    if (!producer) await initProducer();

    await producer.send({
          partition:3,
      topic,
      messages: [
        {
          key: message.id?.toString() || null,
          value: JSON.stringify(message),
        },
      ],
    });

    console.log(`📤 Message sent to Kafka topic "${topic}":`, message);
  } catch (error) {
    console.error("❌ Error sending message to Kafka:", error);
  }
}

async function disconnectProducer() {
  if (producer) await producer.disconnect();
  console.log("✅ Kafka Producer disconnected");
}

process.on("SIGINT", async () => {
  await disconnectProducer();
  process.exit(0);
});

module.exports = {
  initProducer,
  sendMessagedelete,
  disconnectProducer,
};
