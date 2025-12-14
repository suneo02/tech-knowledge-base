import { ReportSimpleTableCellRenderFunc } from '../type'
import { isStringOrNumber } from '../validate'

/**
 * 渲染信用代码的部分内容
 * 提取信用代码的指定部分，如组织机构代码
 *
 * @param txt 完整的信用代码
 * @param record 数据记录
 * @param config 配置项
 * @returns 格式化后的部分信用代码
 */
export const renderCreditCodePart: ReportSimpleTableCellRenderFunc = (txt) => {
  try {
    if (!isStringOrNumber(txt)) return '--'

    const stringValue = String(txt)
    if (!stringValue) return '--'

    return stringValue.substr(8, 9) || '--'
  } catch (error) {
    console.error('Error rendering credit code part:', error)
    return '--'
  }
}
