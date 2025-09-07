// consumer.js
const kafka = require('../client/client');
const Register = require('../model/student');
const connectDB = require('../db/conn');

async function runConsumer() {
  await connectDB();

  const consumer = kafka.consumer({ groupId: 'random-group' });
  await consumer.connect();
  console.log("✅ Kafka Consumer connected");

  await consumer.subscribe({ topic: 'user-signup', fromBeginning: false });
  console.log("✅ Subscribed to topic: random-numbers");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const data = JSON.parse(message.value.toString());
        console.log("📥 Received from Kafka:", data);

        const newEntry = new Register({
          value: data.value,
          shortId: data.shortId,
          createdAt: data.timestamp,
        });

        await newEntry.save();
        console.log("✅ Saved to MongoDB:", newEntry);
      } catch (err) {
        console.error("❌ Error processing message:", err);
      }
    },
  });
}

runConsumer();
