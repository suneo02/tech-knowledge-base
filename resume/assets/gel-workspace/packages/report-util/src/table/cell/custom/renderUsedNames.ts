import { CorpBasicInfo } from 'gel-types'
import { ReportSimpleTableCellRenderFunc } from '../type'
import { isValidArray, isValidObject } from '../validate'

/**
 * 类型检查
 * 检查是否是 usedNames
 */
function isUsedNames(usedNames: any): usedNames is CorpBasicInfo['usednames'] {
  return Array.isArray(usedNames) && usedNames.every((item) => isValidObject(item) && 'used_name' in item)
}

/**
 * 渲染曾用名
 * 处理曾用名数组的特殊显示
 *
 * @param usedNames 曾用名数组
 * @returns 格式化后的曾用名列表
 */

export const renderUsedNames: ReportSimpleTableCellRenderFunc = (usedNames) => {
  try {
    if (!isValidArray(usedNames)) {
      return '--'
    }

    if (!isUsedNames(usedNames)) {
      return '--'
    }

    return usedNames
      .map((item) => {
        return `${item.used_name}\n`
      })
      .join('')
  } catch (error) {
    console.error('Error rendering used names:', error)
    return '--'
  }
}
