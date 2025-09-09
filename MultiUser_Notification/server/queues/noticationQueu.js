
const { Queue } = require('bullmq');

const NotificationQueue = new Queue('NotificationQueue', {
    connection: {
        host: 'localhost',
        port: 6379,
    },
});

module.exports = NotificationQueue;