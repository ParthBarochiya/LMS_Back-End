const {Redis} = require('ioredis')
require('dotenv').config()

const redisClient = () => {
    if(process.env.REDIS_SECRET_KEY){
        console.log('redis connected');
        return process.env.REDIS_SECRET_KEY
    }
    throw new Error('Redis connection failed')
};

module.exports = new Redis(redisClient())