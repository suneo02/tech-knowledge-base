import { CorpBasicNum as CorpBasicNumFromType } from 'gel-types'

import { myWfcAjax } from '@/api/common.ts'

export const getCorpPatentNum = (companyCode: string) => {
  const data = { companycode: companyCode, pageNo: 0, pageSize: 1, roleType: 0, __primaryKey: companyCode }
  return myWfcAjax<any, typeof data>('detail/company/patent_statistical_number', data)
}

export const getCorpBidNum = (companyCode: string) => {
  const data = { companycode: companyCode, pageNo: 0, pageSize: 1, roleType: 0, __primaryKey: companyCode }
  return myWfcAjax<any, typeof data>('detail/company/penetration_bid_statistical_number', data)
}

export const getCorpBidPenetrationNum = (companyCode: string) => {
  const data = { companycode: companyCode, pageNo: 0, pageSize: 1, roleType: 1, __primaryKey: companyCode }
  return myWfcAjax<any, typeof data>('detail/company/penetration_bid_statistical_number', data)
}

/**
 * 企业详情 基础数字
 */
export type CorpBasicNum = CorpBasicNumFromType
export const getCompanyBasicNumT = async (id: string) => {
  const res = await myWfcAjax<CorpBasicNum>(`detail/company/getentbasicnum/${id}`)

  return res
}
