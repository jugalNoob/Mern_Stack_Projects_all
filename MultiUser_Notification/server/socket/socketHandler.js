const { sendMessage } = require("../producer/producer"); // ✅ make sure this is uncommented
const socketRegistry = require("./socketRegistry");

module.exports = (io, socket) => {
  console.log("👤 User connected:", socket.id);

  socket.on("registerUser", async ({ userId }) => {
    if (userId) {
      socketRegistry.register(userId, socket.id);

      const now = new Date();
      const greeting = now.getHours() < 12 ? "🌞 Good Morning!" : "🌙 Good Night!";
      const payload = {
        userId,
        message: greeting,
        timestamp: now.toISOString(),
      };

      // ✅ Send message to Kafka
      await sendMessage(process.env.KAFKA_TOPIC || "NotificationQueue", payload, userId);

      console.log(`✅ Greeting queued for user ${userId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    socketRegistry.unregisterSocket(socket.id);
  });
};
