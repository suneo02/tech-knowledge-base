// 获取近三月舆情资讯
import axios from '@/api'
import { ApiResponse } from '@/api/types.ts'
import { BusinessOpportunity } from 'gel-types'
import { ICorpEvent } from './eventTypes'

export const getCompanyHeadScanning = (_companyCode, data) => {
  return axios.request({
    cmd: '/detail/company/get_company_head_scanning',
    method: 'post',
    data: {
      check: false,
      ...data,
    },
  })
}
//获取舆情卡片中三条舆情
export const getNewsInternal = (_companyCode, data) => {
  return axios.request({
    cmd: '/detail/company/getNewsInternal',
    method: 'post',
    data: {
      ...data,
    },
  })
}
//获取舆情卡片中舆情
export const getMyCorpEventListNew = ({
  companyCode,
  category = '',
  endDate,
  dateRange = 365,
  sortAfter,
  type,
}: {
  companyCode: string
  category?: string
  endDate: string
  dateRange?: number
  sortAfter?: string
  type?: number
}): Promise<ApiResponse<ICorpEvent[]>> => {
  return axios.request({
    cmd: 'search/company/getmycorpeventlistnew',
    method: 'post',
    data: {
      foldType: '', // 需要折叠的类别
      companyCode,
      category,
      requestFrom: 'list',
      endDate: endDate,
      dateRange,
      type,
      sortAfter,
    },
  })
}

export type BusinessOpportunityResponse = {
  list: BusinessOpportunity[]
  more: Partial<BusinessOpportunity>
}
//获取舆情卡片中舆情
export const getBusinessOpportunityTab = async (id) => {
  const { Data } = await axios.request<BusinessOpportunity[]>({
    cmd: 'detail/company/getBusinessOpportunityTab',
    method: 'post',
    data: {
      __primaryKey: id,
    },
  })
  const returnData: BusinessOpportunityResponse = {
    list: [],
    more: {},
  }
  if (Data && Array.isArray(Data)) {
    if (Data.length > 0) {
      returnData.list = Data.slice(1, Data.length)
      returnData.more = Data[0]
    }
  }
  return returnData
}
// 查询企业新闻/企业动态
export const queryCorpNews = (data) => {
  return axios.request({
    url: '/api/search/corpnews/queryByCorpId',
    method: 'post',
    data,
  })
}
