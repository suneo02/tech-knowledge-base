import { getUrlSearchValue } from 'gel-util/link'

/**
 * 获取 URL 中的 menuKey 参数值（适用于类组件）
 * @returns {number | undefined} 返回解析后的 menuKey 数值，如果不存在或无效则返回 undefined
 * @description 从当前 URL 中获取 menuKey 参数，并转换为数字类型，适合在类组件中使用
 */
export const getMenuKeyFromUrl = (): number | undefined => {
  const menuKeyValue = getUrlSearchValue('menuKey')

  if (menuKeyValue !== null && menuKeyValue !== undefined) {
    const numValue = parseInt(menuKeyValue, 10)
    if (!isNaN(numValue)) {
      return numValue
    }
  }

  return undefined
}
