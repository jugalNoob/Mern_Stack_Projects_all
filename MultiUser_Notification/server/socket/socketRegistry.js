// Simple in-memory user ↔ socketId mapping
const userSocketMap = new Map();

function register(userId, socketId) {
  userSocketMap.set(userId, socketId);
  console.log(`🔗 Registered ${userId} -> ${socketId}`);
}

function unregisterSocket(socketId) {
  for (const [userId, sId] of userSocketMap.entries()) {
    if (sId === socketId) {
      userSocketMap.delete(userId);
      console.log(`❌ Unregistered ${userId}`);
      break;
    }
  }
}

function getSocket(userId) {
  return userSocketMap.get(userId);
}

module.exports = { register, unregisterSocket, getSocket };
