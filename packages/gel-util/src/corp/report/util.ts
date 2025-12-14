import { CorpBasicNum, CorpBasicNumStock } from 'gel-types'
import { ECorpReport, getCompanyReportConfig } from './config'

/**
 * 安全地获取对象属性值
 */
function safeGetProperty<T extends Record<string, any>>(obj: T, key: string): any {
  return obj && typeof obj === 'object' && key in obj ? obj[key] : undefined
}

/**
 * 过滤报告 根据 统计数字
 * @param item
 * @returns
 */
export function filterRPByBasicNum(
  reportEnum: ECorpReport,
  basicNum: Partial<CorpBasicNum> | undefined,
  basicNumStock: CorpBasicNumStock | undefined
) {
  try {
    const cfgMap = getCompanyReportConfig(() => '')
    const cfg = cfgMap[reportEnum]
    // 1. 如果 cfg.modelNum 不存在，直接返回 true
    if (!cfg.modelNum) {
      return true
    }

    const valFromBasicNum = safeGetProperty(basicNum || {}, cfg.modelNum)
    const valFromBasicNumStock = safeGetProperty(basicNumStock || {}, cfg.modelNum)

    // 3. 如果有一个 为 true 或者是数字并且 大于 0 ，则返回 true
    if (valFromBasicNum || valFromBasicNumStock) {
      return true
    }

    return false
  } catch (e) {
    console.error(e)
    return false
  }
}
