/**
 * 验证工具模块
 *
 * 包含各种用于验证数据的工具函数，基于lodash实现，用于在渲染前检查数据类型和有效性
 */

/**
 * 检查值是否是字符串或数字类型
 * @param value 要检查的值
 * @returns 是否是字符串或数字
 */
export function isStringOrNumber(value: any): value is string | number {
  return typeof value === 'string' || typeof value === 'number'
}

/**
 * 检查值是否是非空数组
 * @param value 要检查的值
 * @returns 如果值是非空数组则返回true
 */
export function isValidArray(value: any): value is any[] {
  return Array.isArray(value) && value.length > 0
}

/**
 * 检查值是否是有效的对象
 * @param value 要检查的值
 * @returns 如果值是非null对象则返回true
 */
export function isValidObject(value: any): value is Record<string, any> {
  return typeof value === 'object' && value != null
}

/**
 * 检查字符串是否是有效的日期
 * @param value 要检查的值
 * @returns 如果值可以被解析为有效日期则返回true
 */
export function isValidDate(value: any): boolean {
  if (!isStringOrNumber(value)) return false

  const date = new Date(value)
  return !isNaN(date.getTime())
}
