const { sendMessageToKafka } = require("../producer/product_get"); 

exports.usersGet = async (req, res) => {
  try {
    const users = await Register.find({}); // Fetch all users from MongoDB

    // ✅ Send user data to Kafka
    await sendMessageToKafka("user-fetch-events", "all_users", users);
    console.log("Users sent to Kafka successfully");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
