const kafka = require("../client/client"); // Import Kafka client
const producer = kafka.producer();

async function connectProducer() {
  await producer.connect();
  console.log("Kafka Producer connected");
}

// Function to send messages to Kafka
async function sendMessageToKafka(topic, key, message) {
  try {
    const serializedMessage = JSON.stringify(message);

    await producer.send({
      topic,
      messages: [{ key, value: serializedMessage }],
    });

    console.log(`Message sent to Kafka topic "${topic}":`, message);
  } catch (error) {
    console.error("Error sending message to Kafka:", error);
    throw error;
  }
}

// Connect producer when the app starts
connectProducer();

module.exports = { sendMessageToKafka };
