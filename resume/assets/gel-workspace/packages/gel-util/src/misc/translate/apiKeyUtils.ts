/**
 * API 翻译键名工具
 *
 * 用于生成和解析翻译 API 的键名格式。
 * 键名格式：`{index}$$word`，例如 `0$$word`, `1$$word`
 */

/** API 键名分隔符 */
export const API_KEY_SEPARATOR = '$$'

/** API 键名后缀 */
export const API_KEY_SUFFIX = 'word'

/**
 * 生成翻译 API 键名
 *
 * @param index - 文本在列表中的索引位置
 * @returns 格式化的 API 键名，例如 `0$$word`
 *
 * @example
 * ```typescript
 * generateApiKey(0) // '0$$word'
 * generateApiKey(42) // '42$$word'
 * ```
 */
export function generateApiKey(index: number): string {
  return `${index}${API_KEY_SEPARATOR}${API_KEY_SUFFIX}`
}

/**
 * 解析 API 键名获取索引
 *
 * @param key - API 键名，格式为 `{index}$$word`
 * @returns 解析出的索引值，解析失败返回 null
 *
 * @example
 * ```typescript
 * parseApiKey('0$$word') // 0
 * parseApiKey('42$$word') // 42
 * parseApiKey('invalid') // null
 * ```
 */
export function parseApiKey(key: string): number | null {
  const parts = key.split(API_KEY_SEPARATOR)
  if (parts.length !== 2 || parts[1] !== API_KEY_SUFFIX) {
    return null
  }
  const index = parseInt(parts[0], 10)
  return isNaN(index) ? null : index
}

/**
 * 按索引排序 API 键名
 *
 * @param keys - 需要排序的键名数组
 * @returns 按索引升序排列的键名数组
 *
 * @example
 * ```typescript
 * sortApiKeys(['10$$word', '2$$word', '1$$word'])
 * // ['1$$word', '2$$word', '10$$word']
 * ```
 */
export function sortApiKeys(keys: string[]): string[] {
  return keys.sort((a, b) => {
    const indexA = parseApiKey(a) ?? 0
    const indexB = parseApiKey(b) ?? 0
    return indexA - indexB
  })
}
