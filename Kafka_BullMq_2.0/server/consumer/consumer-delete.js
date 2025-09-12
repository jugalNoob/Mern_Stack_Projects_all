const kafka     = require("../client/client");
const Register  = require("../module/student");
const mongoose  = require("mongoose");
const connectDB = require("../db/conn");

async function initConsumer() {
  const consumer = kafka.consumer({ groupId: "user-group-delete" });
  await consumer.connect();
  await consumer.subscribe({ topic: "user-Delete", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const { id, name } = JSON.parse(message.value.toString());

      // Convert string `id` into a real ObjectId:
      const _id = mongoose.Types.ObjectId.isValid(id)
        ? new mongoose.Types.ObjectId(id)
        : null;

      if (!_id) {
        console.warn(`⚠️ Invalid ObjectId: ${id}`);
        return;
      }

      // Actually delete by _id and name:
      const deletedUser = await Register.findOneAndDelete({ _id, name });

      if (deletedUser) {
        console.log(`🗑️ Deleted user:`, deletedUser);
      } else {
        console.warn(`⚠️ No user found with _id=${id} & name="${name}"`);
      }
    },
  });
}

(async () => {
  await connectDB();
  await initConsumer();
})();