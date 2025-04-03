import Redis from 'ioredis';

let redisClient: Redis | null = null;

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    redisClient = new Redis({
      host: 'redis',
      port: 6379,
      retryStrategy: (times) => {
        // 指数退避重连策略
        const delay = Math.min(times * 1000, 5000);
        return delay;
      },
      maxRetriesPerRequest: 10, // 限制重试次数
    });

    redisClient.on('error', (err) => {
      console.error('Redis error:', err);
    });

    redisClient.on('ready', () => {
      console.log('Redis client connected');
    });

    redisClient.on('reconnecting', () => {
      console.log('Redis client reconnecting...');
    });
  }
  return redisClient;
};
