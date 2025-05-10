import { cache } from "../cache";

describe("Cache Module", () => {
  beforeEach(() => {
    cache.clear();
  });

  test("should store and retrieve values", () => {
    const key = "test-key";
    const value = { data: "test-value" };

    cache.set(key, value);
    const retrieved = cache.get(key);

    expect(retrieved).toEqual(value);
  });

  test("should expire values after TTL", () => {
    const key = "test-key";
    const value = { data: "test-value" };
    const ttl = 100;

    cache.set(key, value, ttl);

    expect(cache.get(key)).toEqual(value);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(cache.get(key)).toBeUndefined();
        resolve();
      }, ttl + 10);
    });
  });

  test("should return undefined for non-existent keys", () => {
    expect(cache.get("non-existent")).toBeUndefined();
  });

  test("should delete values", () => {
    const key = "test-key";
    const value = { data: "test-value" };

    cache.set(key, value);
    const beforeDelete = cache.get(key);
    cache.del(key);
    const afterDelete = cache.get(key);

    expect(beforeDelete).toEqual(value);
    expect(afterDelete).toBeUndefined();
  });

  test("should return stats", () => {
    cache.set("key1", "value1");
    cache.set("key2", "value2");

    const stats = cache.stats();

    expect(stats.size).toBe(2);
    expect(stats.keys).toContain("key1");
    expect(stats.keys).toContain("key2");
  });

  test("should clear all values", () => {
    cache.set("key1", "value1");
    cache.set("key2", "value2");

    cache.clear();

    expect(cache.stats().size).toBe(0);
    expect(cache.get("key1")).toBeUndefined();
    expect(cache.get("key2")).toBeUndefined();
  });
});
