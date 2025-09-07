const kafka = require("../client/client");

let producer;

async function initProducer() {
    try {
        producer = kafka.producer();
        await producer.connect();
        console.log("✅ Kafka Producer connected successfully");
    } catch (error) {
        console.error("❌ Error initializing Kafka Producer:", error);
    }
}

async function sendMessage(topic, messageObj) {
    try {
        if (!producer) {
            throw new Error("Kafka producer is not initialized.");
        }

        // Log the message before sending
        console.log("📩 Attempting to send message:", messageObj);

        // Validate the message
        const requiredFields = [
            "name", "gender", "bio", "country", "email", "bloodGroup", "birthDate", "age", "price"
        ];

        for (const field of requiredFields) {
            if (!messageObj[field]) {
                console.error(`❌ Missing required field: ${field} in message:`, messageObj);
                return;
            }
        }

        await producer.send({
                partition:1,
            topic,
            messages: [{ key: messageObj.name, value: JSON.stringify(messageObj) }],
        });
        console.log(`✅ Message sent to Kafka topic "${topic}":`, messageObj);
    } catch (error) {
        console.error("❌ Error sending message to Kafka:", error.message);
    }
}
async function disconnectProducer() {
    try {
        if (producer) {
            await producer.disconnect();
            console.log("✅ Kafka Producer disconnected successfully");
        }
    } catch (error) {
        console.error("❌ Error disconnecting Kafka Producer:", error);
    }
}

process.on("SIGINT", async () => {
    await disconnectProducer();
    process.exit(0);
});

initProducer();

module.exports = { sendMessage };
