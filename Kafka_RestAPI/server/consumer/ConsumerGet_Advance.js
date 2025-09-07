const kafka = require("../client/client");
const Register = require("../module/student");
const connectDB = require("../db/conn");

async function initConsumer() {
    const consumer = kafka.consumer({ groupId: "user-group-GetAdvanace" });

    try {
        console.log("🔄 Connecting Kafka Consumer...");
        await consumer.connect();
        console.log("✅ Consumer connected successfully");

        // Subscribe to the Kafka topic
        await consumer.subscribe({ topic: "UserAPI", fromBeginning: true });
        console.log("✅ Subscribed to topic 'UserAPI'");

        await consumer.run({
            eachMessage: async ({ message }) => {
                try {
                    // Log the raw message to inspect it
                    console.log("📥 Raw message from Kafka:", message.value.toString());

                    const user = JSON.parse(message.value.toString());
                    console.log(`📥 Received user data: ${JSON.stringify(user)}`);

                    // Validate required fields
                    const requiredFields = [
                        "name", "gender", "bio", "country", "email", 
                        "bloodGroup", "birthDate", "age", "price"
                    ];

                    for (const field of requiredFields) {
                        if (!user[field]) {
                            console.error(`❌ Missing required field: ${field} in message:`, user);
                            return;
                        }
                    }

                    // Create a new user in MongoDB without checking for duplicates
                    const newUser = new Register(user);
                    await newUser.save();
                    console.log(`✅ New user added: ${user.name}`);

                } catch (err) {
                    console.error("❌ Error processing message:", err.message);
                }
            },
        });
    } catch (err) {
        console.error("❌ Kafka Consumer Error:", err.message);
    }
}

// Initialize the consumer after connecting to the database
(async () => {
    await connectDB();
    await initConsumer();
})();
