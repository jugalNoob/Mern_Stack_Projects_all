
const kafka = require("../client/client");
const connectDB = require("../db/conn");
// const RegisterQueue = require("../queues/registerQueue"); // BullMQ queue

 const NotificationQueue = require("../queues/noticationQueu"); // Correct queue import


async function initConsumer() {
    const consumer = kafka.consumer({ groupId: "user-signUp-group" });

    try {
        console.log("🔄 Connecting Kafka Consumer...");
        await consumer.connect();
        console.log("✅ Consumer connected successfully");

        await consumer.subscribe({ topic: "user-signup", fromBeginning: true });
        console.log("✅ Subscribed to topic 'user-signup'");

        await consumer.run({
            eachMessage: async ({ message }) => {
                try {
                    const userData = JSON.parse(message.value.toString());
                    console.log(`📥 Received message: ${JSON.stringify(userData)}`);

                    // Validate fields (minimal check here)
                    const { name, price, age, birthDate, bloodGroup, email, hobbies, country, bio, gender } = userData;
                    if (
                        !name || !price || !age || !birthDate || !bloodGroup || !email ||
                        !hobbies || !country || !bio || !gender
                    ) {
                        console.warn("⚠️ Missing required fields. Skipping.");
                        return;
                    }

                    // Add job to BullMQ for processing
                    const job = await NotificationQueue.add('saveUser', userData, {
                        delay: 1000,
                        attempts: 3,
                        backoff: {
                            type: 'exponential',
                            delay: 1000
                        },
                        removeOnComplete: true,
                        removeOnFail: false
                    });

                    console.log(`📤 Job queued (ID: ${job.id}) for MongoDB insert`);
                } catch (error) {
                    console.error("❌ Error processing Kafka message:", error);
                }
            },
        });
    } catch (error) {
        console.error("❌ Kafka Consumer Error:", error);
    }
}

(async () => {
    await connectDB();
    await initConsumer();
})();