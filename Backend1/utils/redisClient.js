const Redis = require("ioredis");

// Create a Redis client instance
const redis = new Redis({
    host: 'localhost',   // Redis server address (use your Redis server URL if remote)
    port: 6379,          // Redis port
    password: '',        // Optional: if your Redis server requires authentication
    db: 0                // Optional: Redis database index
});

redis.on('connect', () => {
    console.log('Connected to Redis');
});

redis.on('error', (err) => {
    console.error('Redis error:', err);
});

module.exports = redis;

