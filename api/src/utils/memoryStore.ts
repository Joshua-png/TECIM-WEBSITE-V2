interface Entry {
  value: string;
  expiresAt: number;
}

export class MemoryStore {
  private readonly entries = new Map<string, Entry>();

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    this.entries.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async get(key: string): Promise<string | null> {
    const entry = this.entries.get(key);
    if (!entry) {
      return null;
    }
    if (entry.expiresAt < Date.now()) {
      this.entries.delete(key);
      return null;
    }
    return entry.value;
  }

  async del(key: string): Promise<void> {
    this.entries.delete(key);
  }

  async incr(key: string, ttlSeconds: number): Promise<number> {
    const now = Date.now();
    const current = this.entries.get(key);
    if (!current || current.expiresAt < now) {
      this.entries.set(key, { value: "1", expiresAt: now + ttlSeconds * 1000 });
      return 1;
    }
    const next = Number(current.value) + 1;
    this.entries.set(key, { value: String(next), expiresAt: current.expiresAt });
    return next;
  }

  async flush(): Promise<void> {
    this.entries.clear();
  }

  async quit(): Promise<void> {
    this.entries.clear();
  }
}
