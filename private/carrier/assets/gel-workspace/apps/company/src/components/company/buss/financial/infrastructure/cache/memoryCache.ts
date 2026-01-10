/**
 * 简易内存缓存：Map 实现，支持 TTL、读取、写入、清理与移除。
 * @author yxlu.calvin
 * @example
 * memoryCache.set('key', { foo: 'bar' }, 60000)
 * const v = memoryCache.get('key')
 * memoryCache.remove('key')
 */
export const memoryCache = (() => {
  const store = new Map()
  const defaultTTL = 5 * 60 * 1000 // 5分钟

  const get = <T>(key: string): T | null => {
    const entry = store.get(key)
    if (!entry) return null

    if (Date.now() - entry.timestamp > (entry.ttl || defaultTTL)) {
      store.delete(key)
      return null
    }

    return entry.data
  }

  const set = <T>(key: string, data: T, ttl?: number): void => {
    store.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || defaultTTL,
    })
  }
  // entry结构：{ data: any, timestamp: number, ttl?: number }

  const clear = (): void => {
    store.clear()
  }

  const remove = (key: string): void => {
    store.delete(key)
  }

  return {
    get,
    set,
    clear,
    remove,
  }
})()
