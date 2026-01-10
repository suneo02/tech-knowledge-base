import type { ApiResponse } from '../../types'

// 招投标趋势分析数据
export interface TenderTrendData {
  startTime: string // 统计区间开始时间
  interval: 'month' | 'quarter' | 'year' // 表示统计的时间区间大小，month|quarter|year中的一种
  bidCount: number // 中标次数
  notBidCount: number // 未中标次数
  totalMoney: number // 中标总金额
}

// 招投标金额分析数据
export interface TenderMoneyData {
  startTime: string // 统计区间开始时间
  interval: 'month' | 'quarter' | 'year' // 表示统计的时间区间大小，month|quarter|year中的一种
  maxMoney: number // 最高中标金额
  minMoney: number // 最低中标金额
  midMoney: number // 中标金额中位数
  lowQuarterMoney: number // 下四分之一位数
  highQuarterMoney: number // 上四分之一位数
}

// 招投标标的物分析数据
export interface TenderSubjectData {
  subject: string // 标的物名称
  count: string // 中标项目个数
}

// 招投标地区分析数据
export interface TenderAreaData {
  areaCode: string // 地区代码
  bidCount: string // 该地区中标项目个数
}

// 招投标相关API路径定义
export type TenderApiPaths = {
  // 趋势分析
  'detail/company/tenderTrendAnalyseCompany': {
    params: {
      interval?: 'month' | 'quarter' | 'year'
      startTime?: string
      endTime?: string
    }
    response: ApiResponse<TenderTrendData[]>
  }
  // 金额分析
  'detail/company/tenderMoneyAnalyseCompany': {
    params: {
      interval?: 'month' | 'quarter' | 'year'
      startTime?: string
      endTime?: string
    }
    response: ApiResponse<TenderMoneyData[]>
  }
  // 标的物分析
  'detail/company/tenderSubjectAnalyseCompany': {
    params?: undefined
    response: ApiResponse<TenderSubjectData[]>
  }
  // 地区分析
  'detail/company/tenderAreaAnalyseCompany': {
    params?: {
      provinceCode?: string
      startTime?: string
      endTime?: string
    }
    response: ApiResponse<TenderAreaData[]>
  }
}