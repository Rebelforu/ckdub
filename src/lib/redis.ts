import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// Only initialize if we have the credentials, else provide a dummy/mock client for build safety
export const redis = (redisUrl && redisToken)
  ? new Redis({
      url: redisUrl,
      token: redisToken,
    })
  : {
      incr: async () => 0,
      get: async () => 0,
      mget: async () => [],
    } as any;

