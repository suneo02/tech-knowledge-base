import { ApiResponse } from '../types'

// 基础请求参数
export type BaseFeturedParams = {
  corpListId: string
  areaCode: string
}

// 养老机构性质接口参数
export type CorplistPropertyParams = BaseFeturedParams & {
  queryType: 'institutionType'
}

// 床位数量分布接口参数
export type CorplistBedParams = BaseFeturedParams & {
  queryType: 'bedNumber'
}

// 聚合数据选项类型
export type AggregationOption = {
  key: string
  doc_count: number
}

// 养老机构性质接口响应
export type CorplistPropertyResponse = {
  institutionType: AggregationOption[]
}

// 床位数量分布接口响应
export type CorplistBedResponse = {
  bedNumber: AggregationOption[]
}

// 特色企业相关API路径类型
export type FeturedApiPaths = {
  // 养老机构性质
  'rankinglist/rankListAggSelectV2': {
    params: CorplistPropertyParams | CorplistBedParams
    response: ApiResponse<CorplistPropertyResponse | CorplistBedResponse>
  }
}
