// Simple in-memory cache implementation
interface CacheItem {
  data: any;
  expiresAt: number;
}

class MemoryCache {
  private cache: Record<string, CacheItem>;
  private defaultTTL: number;

  constructor(defaultTTL = 300000) {
    // Default 5 minutes (in milliseconds)
    this.cache = {};
    this.defaultTTL = defaultTTL;
  }

  /**
   * Set a value in the cache
   * @param key Cache key
   * @param data Data to store
   * @param ttl Time to live in milliseconds (optional, default from constructor is used if not provided)
   */
  set(key: string, data: any, ttl?: number): void {
    const expiresAt = Date.now() + (ttl || this.defaultTTL);
    this.cache[key] = { data, expiresAt };
  }

  /**
   * Get a value from the cache
   * @param key Cache key
   * @returns The cached data or null if expired or not found
   */
  get(key: string): any {
    const item = this.cache[key];

    // Return null if item doesn't exist or is expired
    if (!item || Date.now() > item.expiresAt) {
      // Clean up expired item
      if (item) delete this.cache[key];
      return null;
    }

    return item.data;
  }

  /**
   * Remove an item from the cache
   * @param key Cache key
   */
  del(key: string): void {
    delete this.cache[key];
  }

  /**
   * Clear all items from the cache
   */
  clear(): void {
    this.cache = {};
  }

  /**
   * Get cache statistics
   */
  stats(): { size: number; keys: string[] } {
    // Clean expired items before reporting stats
    this.cleanup();
    return {
      size: Object.keys(this.cache).length,
      keys: Object.keys(this.cache),
    };
  }

  /**
   * Remove all expired items from the cache
   */
  private cleanup(): void {
    const now = Date.now();
    for (const key in this.cache) {
      if (this.cache[key].expiresAt < now) {
        delete this.cache[key];
      }
    }
  }
}

// Export a singleton instance
export const cache = new MemoryCache();
