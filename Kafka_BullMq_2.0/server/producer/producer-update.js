const kafka = require("../client/client");
const Register = require("../module/student"); // This is unused here, can remove
const producer = kafka.producer();

async function connectProducer() {
    await producer.connect();
    console.log("Kafka Producer connected Update");
}

async function sendMessageupdate(topic, message) {
    try {
        if (!producer) {
            throw new Error("Kafka producer is not initialized.");
        }
        await producer.send({
                partition:0,
            topic,
            messages: [{ key: message._id, value: JSON.stringify(message) }],
        });
        console.log(`📩 Message sent to Kafka topic "${topic}":`, message);
    } catch (error) {
        console.error("❌ Error sending message to Kafka:", error);
    }
}

// Connect producer when the app starts
connectProducer();

module.exports = { sendMessageupdate };