import { DEFAULT_EMPTY_TEXT } from '../shared'
import { ReportSimpleTableCellRenderFunc } from '../type'
/**
 * 

 * @param record 
 * @returns 
 */
export const renderOverseasBusinessScope: ReportSimpleTableCellRenderFunc = (txt) => {
  if (txt?.length) {
    let val = ''
    txt.map((t) => {
      val = val ? val + ', ' + t.industryName : t.industryName
    })
    return val
  }
  return DEFAULT_EMPTY_TEXT
}
