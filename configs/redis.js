const redis = require('redis');
const url = process.env.REDIS_URL;

const client = redis.createClient({ url });

client.on('connect', () => {
    // console.log('Redis database connected');
});

client.on('reconnecting', () => {
    // console.log('Redis client reconnecting');
});

client.on('ready', () => {
    // console.log('Redis client is ready');
});

client.on('error', (err) => {
    console.error('Redis client error:', err);
});

module.exports = {
    getClient: async () => {
        if (!client.isOpen) {
            await client.connect();
        }

        return client;
    },
};
