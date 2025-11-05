import { IndustryInfoResult, NewBigShareholderResult, StructuralSubjectResult, SubjectInfoResult } from '@/api/corp'
import { TCorpTechScoreReport } from '@/api/corp/report.ts'
import { CorpInfoApiPaths } from '@/api/paths/corp/info.ts'
import { PaginationBaseParams } from 'gel-api/*'
import type { ApiResponse } from '../types'
import { CorpBussApiPaths } from './corp/buss'

// 企业相关API路径定义
export type CompanyApiPaths = {
  // 企业详情
  'detail/company/getnewbigshareholder': {
    params: PaginationBaseParams
    response: ApiResponse<NewBigShareholderResult[]>
  }
  'detail/company/technologicalScore': {
    params: PaginationBaseParams
    response: ApiResponse<TCorpTechScoreReport[]>
  }
  // 结构性主体
  'detail/company/getstructuralsubject': {
    params: PaginationBaseParams
    response: ApiResponse<StructuralSubjectResult>
  }
  // 发行股票
  'detail/company/getsubjectinfo': {
    params: undefined
    response: ApiResponse<SubjectInfoResult>
  }
  // 所属行业/产业
  'detail/company/getcorpindustry': {
    params: {
      type: string
    }
    response: ApiResponse<IndustryInfoResult[]>
  }
} & CorpBussApiPaths &
  CorpInfoApiPaths
