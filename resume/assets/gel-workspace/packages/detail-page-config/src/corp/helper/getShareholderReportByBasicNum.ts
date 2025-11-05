import { CorpBasicNumFront } from 'gel-types'
import { corpShareholderBig, corpShareholderReport } from '../baseInfo'

/**
 * 根据企业地区获取 公告披露
 *
 */
export const getShareholderReportByBasicNum = (basicNum: Partial<CorpBasicNumFront> | undefined) => {
  // 如果统计数字中大股东数量大于0，则返回大股东信息
  if (corpShareholderBig.countKey && basicNum && basicNum.majorShareholderCount) {
    return corpShareholderBig
  }
  return corpShareholderReport
}
