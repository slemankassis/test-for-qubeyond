/**
 * Type definitions for cache items
 */
interface CacheItem<T> {
  data: T;
  expiresAt: number;
}

/**
 * Type definitions for cache statistics
 */
interface CacheStats {
  size: number;
  keys: string[];
  hitRate?: number;
  missRate?: number;
}

/**
 * Enhanced in-memory cache implementation with TypeScript support
 */
class MemoryCache {
  private cache: Record<string, CacheItem<any>>;
  private defaultTTL: number;
  private hits: number;
  private misses: number;

  /**
   * Create a new MemoryCache instance
   * @param defaultTTL Default time to live in milliseconds (default: 5 minutes)
   */
  constructor(defaultTTL = 300000) {
    this.cache = {};
    this.defaultTTL = defaultTTL;
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Set a value in the cache
   * @param key Cache key
   * @param data Data to store
   * @param ttl Time to live in milliseconds (optional, default from constructor is used if not provided)
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const expiresAt = Date.now() + (ttl || this.defaultTTL);
    this.cache[key] = { data, expiresAt };
  }

  /**
   * Get a value from the cache
   * @param key Cache key
   * @returns The cached data or undefined if expired or not found
   */
  get<T>(key: string): T | undefined {
    const item = this.cache[key];

    // Return undefined if item doesn't exist or is expired
    if (!item || Date.now() > item.expiresAt) {
      // Clean up expired item
      if (item) delete this.cache[key];
      this.misses++;
      return undefined;
    }

    this.hits++;
    return item.data as T;
  }

  /**
   * Check if a key exists in the cache and is not expired
   * @param key Cache key
   * @returns True if the key exists and is not expired
   */
  has(key: string): boolean {
    const item = this.cache[key];
    const exists = !!item && Date.now() <= item.expiresAt;
    
    // Track metrics but don't delete expired items
    if (exists) {
      this.hits++;
    } else {
      this.misses++;
    }
    
    return exists;
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
    this.resetMetrics();
  }

  /**
   * Reset hit/miss metrics
   */
  resetMetrics(): void {
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Get cache statistics
   */
  stats(): CacheStats {
    // Clean expired items before reporting stats
    this.cleanup();
    
    const totalAccesses = this.hits + this.misses;
    const hitRate = totalAccesses > 0 ? this.hits / totalAccesses : 0;
    const missRate = totalAccesses > 0 ? this.misses / totalAccesses : 0;
    
    return {
      size: Object.keys(this.cache).length,
      keys: Object.keys(this.cache),
      hitRate: parseFloat(hitRate.toFixed(2)),
      missRate: parseFloat(missRate.toFixed(2))
    };
  }

  /**
   * Remove all expired items from the cache
   */
  cleanup(): void {
    const now = Date.now();
    for (const key in this.cache) {
      if (this.cache[key].expiresAt < now) {
        delete this.cache[key];
      }
    }
  }

  /**
   * Set multiple values in the cache at once
   * @param entries Object containing key-value pairs to cache
   * @param ttl Time to live in milliseconds (optional)
   */
  setMany<T>(entries: Record<string, T>, ttl?: number): void {
    for (const [key, value] of Object.entries(entries)) {
      this.set(key, value, ttl);
    }
  }

  /**
   * Update the TTL for a cached item
   * @param key Cache key
   * @param ttl New TTL in milliseconds
   * @returns boolean indicating if the item was found and updated
   */
  touch(key: string, ttl: number): boolean {
    const item = this.cache[key];
    if (!item || Date.now() > item.expiresAt) {
      return false;
    }
    
    item.expiresAt = Date.now() + ttl;
    return true;
  }
}

// Export a singleton instance
const cache = new MemoryCache();
export { cache, MemoryCache };
