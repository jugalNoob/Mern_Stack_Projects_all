const { sendMessage, initProducer } = require("../producer/producer");

exports.UserCreate = async (req, res) => {
    try {
        let { name, price, age, birthDate, bloodGroup, email, hobbies, country, bio, gender } = req.body;

        if (
            !name || !price || !age || !birthDate || !bloodGroup || !email ||
            !hobbies || !country || !bio || !gender
        ) {
            console.warn("⚠️ Missing required fields in message. Skipping insert.");
            return res.status(400).json({ error: "❌ Missing required fields" });
        }

        const user = {
            name,
            price,
            age,
            birthDate,
            bloodGroup,
            email,
            hobbies,
            country,
            bio,
            gender
        };

        // Pass the object, NOT the JSON string
        await sendMessage("UserRestapi", user);

        res.status(201).json({
            message: "✅ User created and sent to Kafka successfully",
            user,
        });
    } catch (error) {
        console.error("❌ Error sending user data to Kafka:", error);
        res.status(500).json({ error: "Failed to send user data to Kafka" });
    }
};

// Initialize Kafka Producer
initProducer();
