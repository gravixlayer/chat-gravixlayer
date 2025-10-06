// Redis-based storage for production (requires Redis server)
import { Redis } from "@upstash/redis";

// Initialize Redis (you'd need REDIS_URL in production)
const redis = process.env.REDIS_URL ? Redis.fromEnv() : null;

export async function getRedisData<T>(key: string): Promise<T[]> {
  if (!redis) {
    return [];
  }

  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data as string) : [];
  } catch (error) {
    console.error("Redis get error:", error);
    return [];
  }
}

export async function setRedisData<T>(key: string, data: T[]): Promise<void> {
  if (!redis) {
    return;
  }

  try {
    await redis.set(key, JSON.stringify(data), { ex: 86_400 }); // 24 hour expiry
  } catch (error) {
    console.error("Redis set error:", error);
  }
}

export async function appendRedisData<T>(key: string, item: T): Promise<void> {
  const currentData = await getRedisData<T>(key);
  currentData.push(item);
  await setRedisData(key, currentData);
}
