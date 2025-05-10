// Simple in-memory cache implementation
class MemoryCache {
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
  set(key, data, ttl) {
    const expiresAt = Date.now() + (ttl || this.defaultTTL);
    this.cache[key] = { data, expiresAt };
  }

  /**
   * Get a value from the cache
   * @param key Cache key
   * @returns The cached data or undefined if expired or not found
   */
  get(key) {
    const item = this.cache[key];

    // Return undefined if item doesn't exist or is expired
    if (!item || Date.now() > item.expiresAt) {
      // Clean up expired item
      if (item) delete this.cache[key];
      return undefined;
    }

    return item.data;
  }

  /**
   * Remove an item from the cache
   * @param key Cache key
   */
  del(key) {
    delete this.cache[key];
  }

  /**
   * Clear all items from the cache
   */
  clear() {
    this.cache = {};
  }

  /**
   * Get cache statistics
   */
  stats() {
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
  cleanup() {
    const now = Date.now();
    for (const key in this.cache) {
      if (this.cache[key].expiresAt < now) {
        delete this.cache[key];
      }
    }
  }
}

// Export a singleton instance
const cache = new MemoryCache();
module.exports = { cache };
