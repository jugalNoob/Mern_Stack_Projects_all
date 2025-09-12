// workers/registerWorker.js

const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const Register = require('../module/student');
const connectDB = require('../db/conn');

// Redis connection with required BullMQ config
const connection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null, // 🔧 Required for BullMQ to work properly
});

// Main worker function
async function createWorker() {
  await connectDB();

  const worker = new Worker(
    'NotificationQueue',
    async (job) => {
      const data = job.data;
      const { name, price, age, birthDate, bloodGroup, email, hobbies, country, bio, gender } = data;

      const existingUser = await Register.findOne({ email });
      if (existingUser) {
        console.warn(`⚠️ User with email ${email} already exists. Skipping insert.`);
        return;
      }

      const newUser = new Register({
        name, price, age, birthDate, bloodGroup, email, hobbies, country, bio, gender,
      });

      await newUser.save();
      console.log(`✅ MongoDB: User saved from BullMQ job ${job.id}:`, newUser);

      // Optional delay to simulate email sending
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`📧 Email sent successfully for job ${job.id}`);
    },
    { connection,
            concurrency: 5 // 🔥 Process 5 jobs in parallel
     }
  );

  // Events
  worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed successfully`);
  });

  worker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed with error: ${err.message}`);
  });

  console.log("🚀 BullMQ worker for 'NotificationQueue' is running...");
}

createWorker().catch(console.error);

module.exports = { createWorker };

 