/**
 * 设置一个带有过期时间的键值对到localStorage。
 * @param {string} key - 要存储的键。
 * @param {*} value - 要存储的值。
 * @param {number} ttl - 过期时间，单位为小时。
 */
export const setLocalStorageWithExpiry = (key: string, value: any, ttl: number) => {
  ttl = ttl * 60 * 60 * 1000
  const now = new Date()
  // `item` 是一个包含值和过期时间的对象
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  }

  localStorage.setItem(key, JSON.stringify(item))
}

/**
 * 从localStorage获取一个带有过期时间的键值对。
 * 如果键的值已经过期，那么该方法将删除该键值对并返回null。
 * @param {string} key - 要获取的键。
 * @return {*} - 键对应的值，如果键的值已经过期，则返回null。
 */
export const getLocalStorageWithExpiry = (key: string) => {
  const itemStr = localStorage.getItem(key)

  // 如果没有值，返回 null
  if (!itemStr) {
    return null
  }

  const item = JSON.parse(itemStr)
  const now = new Date()

  // 如果过期时间已过，删除item并返回 null
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key)
    return null
  }

  return item.value
}
