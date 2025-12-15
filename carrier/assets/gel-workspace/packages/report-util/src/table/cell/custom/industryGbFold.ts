import { DEFAULT_EMPTY_TEXT } from '../shared'
import { ReportSimpleTableCellRenderFunc } from '../type'

/**
 * @returns
 */
export const corpInfoIndustryGbFoldRender: ReportSimpleTableCellRenderFunc = (txt) => {
  try {
    if (!txt) {
      return DEFAULT_EMPTY_TEXT
    }
    // 将 - 替换为 >
    return txt.replace(/-/g, ' > ')
  } catch (error) {
    console.error(error)
    return txt
  }
}
