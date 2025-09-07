const kafka = require("../client/client");
const Register = require("../module/student"); // MongoDB model

async function initConsumer() {
  const consumer = kafka.consumer({ groupId: "user-consumer-group" });

  try {
    await consumer.connect();
    console.log("Kafka Consumer connected");

    await consumer.subscribe({ topic: "user-fetch-events", fromBeginning: true });

    console.log("Listening for user-fetch-events...");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const receivedUsers = JSON.parse(message.value.toString());
          console.log(`Received users from Kafka:`, receivedUsers);

          // ✅ Process users as needed (e.g., log, store, or modify them)
        } catch (err) {
          console.error("Error processing message:", err);
        }
      },
    });
  } catch (error) {
    console.error("Error initializing consumer:", error);
  }
}

// Start consumer
initConsumer();
