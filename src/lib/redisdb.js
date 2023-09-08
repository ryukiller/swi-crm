import { Redis } from '@upstash/redis'

export const RedisDb = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

// Save a message to a sorted set with a timestamp as the score
export const saveMessageToRedis = async (chatId, encryptedMessage) => {
    const timestamp = new Date().getTime();
    await RedisDb.zadd(`chat:${chatId}:messages`, {
        score: timestamp,
        member: JSON.stringify({
            message: encryptedMessage.message,
            sender: encryptedMessage.sender,
            username: encryptedMessage.username,
            avatar: encryptedMessage.avatar,
            time: encryptedMessage.time
        }),
    })
};

// Get all messages from a sorted set for a specific chat
export const getMessagesFromRedis = async (chatId) => {
    // Retrieve elements with scores (timestamps) in ascending order
    const result = await RedisDb.zrange(`chat:${chatId}:messages`, 0, -1);
    console.log(result)
    return result;
};
