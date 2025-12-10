/**
 * ConfigTable utility functions
 */

/**
 * 日志辅助函数 - 打印错误
 * @param message - 错误信息
 * @param error - 错误对象（可选）
 */
export function logError(message: string, error?: any): void {
  console.error(`[ConfigTable] ${message}`, error)
}
