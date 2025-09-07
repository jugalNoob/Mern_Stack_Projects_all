
// redisClient.js
const redis = require('redis');

const redisClient = redis.createClient();

redisClient.on('error', (error) => {
  console.error(`Redis connection error: ${error}`);
});

(async () => {
  await redisClient.connect();
  console.log('Connected to Redis mern');
})();

module.exports = redisClient;