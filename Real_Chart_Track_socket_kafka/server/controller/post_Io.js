const shortid = require('shortid');
const { PostsendMessage } = require('./Producer/Postproducer');

function socketHandler(io, socket) {
  let lastRandomNumber = null;

  // Emit random number every 2s
  const emitInterval = setInterval(() => {
    lastRandomNumber = Math.floor(Math.random() * 100);
    socket.emit('randomNumber', lastRandomNumber);
    console.log('🔁 Sent to client:', lastRandomNumber);
  }, 2000);

  // Save number to Kafka every 5 min
  const saveInterval = setInterval(async () => {
    if (lastRandomNumber !== null) {
      const payload = {
        value: lastRandomNumber,
        shortId: shortid.generate(),
        timestamp: new Date().toISOString(),
      };

      try {
        await PostsendMessage("user-signup", payload);
      } catch (err) {
        console.error("❌ Kafka error:", err);
      }
    }
  }, 300000);

  // Handle disconnect
  socket.on('disconnect', () => {
    clearInterval(emitInterval);
    clearInterval(saveInterval);
    console.log('User disconnected:', socket.id);
  });
}

module.exports = socketHandler;
