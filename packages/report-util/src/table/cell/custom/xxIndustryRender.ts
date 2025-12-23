import { CorpBasicInfo } from 'gel-types'
import { DEFAULT_EMPTY_TEXT } from '../shared'
import { ReportSimpleTableCellRenderFunc } from '../type'

function isXXIndustryList(txt: any): txt is CorpBasicInfo['xxIndustryList'] {
  if (typeof txt !== 'object' || txt === null) return false
  for (const key in txt) {
    if (!Array.isArray(txt[key])) {
      return false
    }
  }
  return true
}
/**
 * @param txt
 * @returns
 */
export const corpInfoXXIndustryRender: ReportSimpleTableCellRenderFunc = (txt) => {
  try {
    if (isXXIndustryList(txt)) {
      const resultList: string[] = []
      for (const key in txt) {
        const arr = txt[key]
        if (Array.isArray(arr)) {
          resultList.push(
            arr
              .map((item: { industryName?: string }) => {
                return item.industryName
              })
              .join(' > ')
          )
        }
      }
      if (resultList.length === 0) {
        return DEFAULT_EMPTY_TEXT
      }
      return resultList.join(', ')
    } else {
      console.error('xxIndustryList 类型错误', txt)
      return DEFAULT_EMPTY_TEXT
    }
  } catch (error) {
    console.error(error)
    return txt
  }
}
