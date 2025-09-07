

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['192.168.29.78:9092'], // Your Kafka broker address
  connectionTimeout: 3000, // Optional: Adjust the timeout as needed
});



console.log("kafka client")

module.exports = kafka; // Ensure you export the Kafka instance



// module.exports = Kafka;
// brokers: ['listeners=PLAINTEXT://192.168.29.79:9092'],



// Environment Variables:

// KAFKA_ZOOKEEPER_CONNECT: Specifies the address of Zookeeper. Use the correct IP and port for your Zookeeper instance.
// KAFKA_ADVERTISED_LISTENERS: Specifies the listener address Kafka will advertise to clients. It should be reachable from your client (192.168.29.79 in your example).
// KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: Setting it to 1 is acceptable for development, but ensure you increase this for production to enable replication.
