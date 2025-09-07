


const kafka = require("../client/client");

let producer;

/**
 * Initialize Kafka producer and connect
 */
async function initProducer() {
    try {
        producer = kafka.producer();
        await producer.connect();
        console.log("✅ Kafka Producer connected successfully UserSignUp");
    } catch (error) {
        console.error("❌ Error initializing Kafka Producer:", error);
    }
}

/**
 * Send a message object to Kafka topic
 * @param {string} topic - Kafka topic name
 * @param {Object} messageObj - Message object to send (must include 'email' field for message key)
 */
async function sendMessage(topic, messageObj) {
    try {
        if (!producer) {
            throw new Error("Kafka producer is not initialized.");
        }
        
        if (!messageObj.email) {
            // If you want to allow missing email, comment out below error and uncomment the key=null line below
            throw new Error("Message object must include an 'email' field for message key.");
            // console.warn("⚠️ Warning: email field missing, using null key");
        }

        await producer.send({
            partition:0,
            topic,
            messages: [
                {
                    key: messageObj.email || null, // Use email as key, or null if not present (optional)
                    value: JSON.stringify(messageObj),
                },
            ],
        });
        console.log(`📩 Message sent to Kafka topic "${topic}":`, messageObj);
    } catch (error) {
        console.error("❌ Error sending message to Kafka:", error);
    }
}

/**
 * Disconnect Kafka producer gracefully
 */
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

// Listen for SIGINT (Ctrl+C) and disconnect producer cleanly
process.on("SIGINT", async () => {
    await disconnectProducer();
    process.exit(0);
});

module.exports = { initProducer, sendMessage };