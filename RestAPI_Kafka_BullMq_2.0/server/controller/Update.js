const { sendMessageupdate } = require("../producer/producer-update");

exports.updatesAll = async (req, res) => {
    const { name, age, country } = req.body;
    const _id = req.params.id;

    try {
        const userUpdateData = { _id, name, age, country };

        await sendMessageupdate("user-Update", userUpdateData);

        res.status(200).json({
            message: "✅ User update request sent to Kafka successfully",
            user: userUpdateData,
        });
    } catch (error) {
        console.error("❌ Error sending update data to Kafka:", error);
        res.status(500).json({ error: "Failed to send user update to Kafka" });
    }
};