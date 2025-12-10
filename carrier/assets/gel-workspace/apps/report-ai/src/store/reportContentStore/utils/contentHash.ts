/**
 * 内容哈希工具
 *
 * @description 用于计算文档内容的哈希值，支持文档级变更检测
 */

/**
 * 计算内容哈希
 *
 * @description 使用简单的字符串哈希算法计算内容指纹，用于文档级变更检测
 * @param content - 需要计算哈希的内容字符串
 * @returns 内容的哈希值（36进制字符串）
 *
 * @example
 * ```typescript
 * const hash1 = calculateContentHash('<p>Hello World</p>')
 * const hash2 = calculateContentHash('<p>Hello World</p>')
 * console.log(hash1 === hash2) // true
 *
 * const hash3 = calculateContentHash('<p>Hello Universe</p>')
 * console.log(hash1 === hash3) // false
 * ```
 */
export function calculateContentHash(content: string): string {
  let hash = 0;
  if (content.length === 0) return hash.toString();

  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return Math.abs(hash).toString(36);
}
