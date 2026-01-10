import { CorpBasicNumFront } from '@/types/corpDetail'
import { CorpBasicInfo } from 'gel-types'
import { isNil } from 'lodash'

/**
 * 判断是否是上市企业
 * @param basicNum
 */
export const getIfIPOCorpByBasicNum = (basicNum: Partial<CorpBasicNumFront>) => {
  try {
    const keys: (keyof CorpBasicNumFront)[] = ['outputCount', 'salesCount', 'businessCount', 'stockCount']
    return keys.some((key) => Number(basicNum[key]) > 0)
  } catch (e) {
    console.error(e)
    return false
  }
}

/**
 * 判断发债企业  >0就是发债企业，=0就是非发债企业
 */
export const getIfBondCorpByBasicNum = (basicNum: Partial<CorpBasicNumFront>) => {
  try {
    return Number(basicNum.sharedbonds_num) > 0
  } catch (e) {
    console.error(e)
    return false
  }
}

export const getIfFundCorpByBasicNum = (basicNum: Partial<CorpBasicNumFront>) => {
  if (isNil(basicNum) || isNil(basicNum.fund_type)) {
    return ''
  }
  return String(basicNum.fund_type) !== '0'
}

export const getIfPublicFundCorpByBasicNum = (basicNum: Partial<CorpBasicNumFront>) => {
  if (isNil(basicNum) || isNil(basicNum.fund_type)) {
    return ''
  }
  return String(basicNum.fund_type) === '1'
}

export const getIfPrivateFundCorpByBasicNum = (basicNum: Partial<CorpBasicNumFront>) => {
  try {
    return (
      Number(basicNum.pe_amac_fundmanager_self_managed_fund_num) > 0 ||
      Number(basicNum.pe_enterpriselp_invested_fund_num) > 0
    )
  } catch (e) {
    console.error(e)
    return false
  }
}

/**
 * 判断是否为海外企业
 * @param corpTypeId 企业类型ID
 * @param areaCode 地区代码
 * @returns boolean
 */
export const isOverseaCorp = (
  corpTypeId?: CorpBasicInfo['corp_type_id'],
  areaCode?: CorpBasicInfo['areaCode']
): boolean => {
  return String(corpTypeId) === '298060000' || areaCode === '030407' || areaCode?.indexOf('18') === 0
}
