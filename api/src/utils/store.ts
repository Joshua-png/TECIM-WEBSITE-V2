import { Redis } from "ioredis";
import { env } from "../config/env.js";
import { MemoryStore } from "./memoryStore.js";
import { logger } from "./logger.js";

export interface Store {
  set(key: string, value: string, ttlSeconds: number): Promise<void>;
  get(key: string): Promise<string | null>;
  del(key: string): Promise<void>;
  incr(key: string, ttlSeconds: number): Promise<number>;
  quit(): Promise<void>;
}

class RedisStore implements Store {
  constructor(private readonly client: Redis) {}

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    await this.client.set(key, value, "EX", ttlSeconds);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async incr(key: string, ttlSeconds: number): Promise<number> {
    const count = await this.client.incr(key);
    if (count === 1) {
      await this.client.expire(key, ttlSeconds);
    }
    return count;
  }

  async quit(): Promise<void> {
    await this.client.quit();
  }
}

let store: Store | null = null;

export function getStore(): Store {
  if (store) {
    return store;
  }
  if (env.redisUrl) {
    try {
      const client = new Redis(env.redisUrl, { maxRetriesPerRequest: 1 });
      store = new RedisStore(client);
      logger.info("Using Redis store");
    } catch (err) {
      logger.warn("Redis unavailable; falling back to in-memory store", err);
    }
  }
  if (!store) {
    logger.warn("REDIS_URL not set; using in-memory store");
    store = new MemoryStore();
  }
  return store;
}

export function resetStore(): void {
  store = null;
}
