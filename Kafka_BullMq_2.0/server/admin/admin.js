

const kafka = require('../client/client'); // Import the Kafka instance from client.js

async function init() {
  const admin = kafka.admin();
  console.log("Admin connecting...");
  
  await admin.connect();
  console.log("✅ Admin connected successfully");

  console.log("📦 Creating Topics: [signUp, GetUser]");

  await admin.createTopics({
    topics: [
      {
        topic: 'user-signup',
        numPartitions: 3,
        replicationFactor: 1
      },
       {
        topic: 'get_user',
        numPartitions: 3,
        replicationFactor: 1
      },
          {
        topic: 'user-Delete',
        numPartitions: 3,
        replicationFactor: 1
      },

          {
        topic: 'user-Update',
        numPartitions: 3,
        replicationFactor: 1
      }
    ],
  });

  console.log("✅ Topics Created Successfully [north-updates, south-updates]");

  console.log("🔌 Disconnecting Admin...");
  await admin.disconnect();
  console.log("✅ Admin disconnected");
}

init().catch(console.error);