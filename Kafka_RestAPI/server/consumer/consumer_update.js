const kafka = require("../client/client");
const Register = require("../module/student");
const connectDB = require("../db/conn");

async function initConsumer() {
  const consumer = kafka.consumer({ groupId: "user-group-Update" });

  try {
    console.log("🔄 Connecting Kafka Consumer...");
    await consumer.connect();
    console.log("✅ Consumer connected successfully");

    await consumer.subscribe({ topic: "UserUpdateApi", fromBeginning: true });
    console.log("✅ Subscribed to topic 'UserUpdateApi'");

    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          // Parse the Kafka message value
          const { _id, name, age, country } = JSON.parse(message.value.toString());

          console.log(`📥 Received update for _id: ${_id}, name: ${name}, age: ${age}, country: ${country}`);

       const user = await Register.findOne({ _id });
      if (!user) {
        console.warn(`⚠️ No user found with _id: ${_id}`);
        return;
      }

          // Use updateOne or updateMany - usually updateOne is better for unique _id updates
          const updateResult = await Register.findByIdAndUpdate(_id, { name, age, country }, { new: true });

            console.log("🔍 Update Result:", updateResult);

          if (updateResult.modifiedCount > 0) {
            console.log(`✅ Successfully updated user with _id: ${_id}`);
          } else {
            console.warn(`⚠️ No user found with _id: ${_id}, or no changes made.`);
          }

        } catch (err) {
          console.error("❌ Error processing message:", err);
        }
      },
    });
  } catch (err) {
    console.error("❌ Kafka Consumer Error:", err);
  }
}

(async () => {
  await connectDB();
  await initConsumer();
})();
