import { ApiResponse } from '@/api/types'
import { CorpBasicInfoFront } from '@/components/company/info/handle'
import { CorpArea } from '@/handle/corp/corpArea'
import { TCorpCategory } from '@/handle/corp/corpType/category'
import { CorpBasicNum, CorpBasicNumFront, CorpCardInfo, CorpOtherInfo } from 'gel-types'

export type FeedBackPara = {
  type?: '数据纠错' | '功能提升' | '其他建议' | '异议处理'
  companyname?: string
  message?: string
  tel?: string
}

export interface CorpState {
  baseInfo: Partial<
    CorpBasicInfoFront & {
      basicNum?: CorpBasicNumFront
      corp: Partial<CorpBasicInfoFront>
    }
  >
  corpHeaderInfo: Partial<CorpCardInfo>
  corpOtherInfo?: CorpOtherInfo
  shareholder: any[]
  shareholderPagination: {
    pageNum: number
    pageSize: number
    total: number
  }
  collectState?: string
  tenderingTags: any[]
  tenderingTypes: any[]
  tenderingList: any[]
  tenderingPagination: {
    pageNum: number
    pageSize: number
    total: number
  }
  biddingTags: any[]
  biddingTypes: any[]
  biddingList: any[]
  biddingPagination: {
    pageNum: number
    pageSize: number
    total: number
  }
  telList: any[]
  telPagination: {
    pageNum: number
    pageSize: number
    total: number
  }
  mailList: any[]
  mailPagination: {
    pageNum: number
    pageSize: number
    total: number
  }
  branchList: any[]
  branchPagination: {
    pageNum: number
    pageSize: number
    total: number
  }
  corpNews: any[]
  companyConfigList: any[]
  scrollModuleIds: string[]
  basicnum: Record<string, any>
  corpCategory: TCorpCategory[]
  feedBackPara: FeedBackPara
  corpArea: CorpArea
  isObjection?: string
}

interface BaseAction<T extends string, P = any> {
  type: T
  data: P
}

export type SetCorpOtherInfoAction = BaseAction<'SET_CORP_OTHER_INFO', CorpOtherInfo>

export type SetCompanyAreaAction = BaseAction<'SET_COMPANY_AREA', CorpArea>

export type SetIsObjectionAction = BaseAction<'SET_IS_OBJECTION', string>

export type SetCollectStateAction = BaseAction<'SET_COLLECT_STATE', string>

export type SetFeedbackParamAction = BaseAction<'SET_FEEDBACK_PARAM', FeedBackPara>

export type SetCompanyCategoryAction = BaseAction<'SET_COMPANY_CATEGORY', TCorpCategory[]>

export type GetCompanyBasicNumAction = BaseAction<'GET_COMPANY_BASICNUM', ApiResponse<CorpBasicNum>>

export type SetCorpModuleReadyedAction = BaseAction<'SET_CORP_MODULE_READYED', string[]>

export type GetCompanyHeaderInfoAction = BaseAction<'GET_COMPANYHEADER_INFO', ApiResponse<Partial<CorpCardInfo>>>

export type GetCompanyInfoAction = BaseAction<
  'GET_COMPANY_INFO',
  ApiResponse<
    Partial<
      CorpBasicInfoFront & {
        basicNum?: CorpBasicNumFront
        corp: Partial<CorpBasicInfoFront>
      }
    >
  >
>

export type PageShareholderAction = BaseAction<
  'PAGE_SHAREHOLDER',
  ApiResponse<{
    list: any[]
    total: number
  }> & {
    pageNum: number
    pageSize: number
  }
>

interface TenderingBiddingResponse {
  aggregations: any
  highlight: any
  list: any[]
  total: number
}

export type CompanyTenderingInfoAction = BaseAction<
  'COMPANY_TENDERING_INFO',
  ApiResponse<TenderingBiddingResponse> & {
    pageNum: number
    pageSize: number
  }
>

export type CompanyBiddingInfoAction = BaseAction<
  'COMPANY_BIDDING_INFO',
  ApiResponse<TenderingBiddingResponse> & {
    pageNum: number
    pageSize: number
  }
>

interface TelMailBranchResponse {
  dataList: any[]
  total: number
}

export type CompanyTelInfoAction = BaseAction<
  'COMPANY_TEL_INFO',
  ApiResponse<TelMailBranchResponse> & {
    pageNum: number
    pageSize: number
  }
>

export type CompanyMailInfoAction = BaseAction<
  'COMPANY_MAIL_INFO',
  ApiResponse<TelMailBranchResponse> & {
    pageNum: number
    pageSize: number
  }
>

export type CompanyBranchInfoAction = BaseAction<
  'COMPANY_BRANCH_INFO',
  ApiResponse<TelMailBranchResponse> & {
    pageNum: number
    pageSize: number
  }
>

export type GetCompanyConfigListAction = BaseAction<'GET_COMPANY_CONFIG_LIST', ApiResponse<any[]>>

export type CorpAction =
  | SetCorpOtherInfoAction
  | SetCompanyAreaAction
  | SetIsObjectionAction
  | SetCollectStateAction
  | SetFeedbackParamAction
  | SetCompanyCategoryAction
  | GetCompanyBasicNumAction
  | SetCorpModuleReadyedAction
  | GetCompanyHeaderInfoAction
  | GetCompanyInfoAction
  | PageShareholderAction
  | CompanyTenderingInfoAction
  | CompanyBiddingInfoAction
  | CompanyTelInfoAction
  | CompanyMailInfoAction
  | CompanyBranchInfoAction
  | GetCompanyConfigListAction
