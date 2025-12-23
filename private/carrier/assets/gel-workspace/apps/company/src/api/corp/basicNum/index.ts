export type { CorpBasicNum } from 'gel-types'

import { myWfcAjax } from '@/api/common.ts'
import { CorpBasicNum } from 'gel-types'

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

export const getCompanyBasicNumT = async (id: string) => {
  const res = await myWfcAjax<CorpBasicNum>(`detail/company/getentbasicnum/${id}`)

  return res
}
