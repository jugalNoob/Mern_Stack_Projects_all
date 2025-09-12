

const {   initProducer,
  sendMessagedelete, } = require("../producer/producer-Delete");

exports.deleteuser= async (req, res) => {
  // **correct** destructuring:
  const { id, name } = req.params;

  if (!id || !name) {
    return res.status(400).json({ error: "_id and name are required" });
  }

  try {

    await sendMessagedelete("user-Delete", { id, name });

    res.status(200).json({
      message: "Delete request sent to Kafka successfully",
      data: { id, name }
    });
  } catch (err) {
    console.error("Error sending delete data to Kafka:", err);
    res.status(500).json({ error: "Failed to send delete data to Kafka" });
  }
};

 initProducer()