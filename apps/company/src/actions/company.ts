import {
  CompanyBiddingInfoAction,
  CompanyBranchInfoAction,
  CompanyMailInfoAction,
  CompanyTelInfoAction,
  CompanyTenderingInfoAction,
  GetCompanyBasicNumAction,
  GetCompanyConfigListAction,
  GetCompanyHeaderInfoAction,
  GetCompanyInfoAction,
  PageShareholderAction,
  SetCollectStateAction,
  SetCompanyAreaAction,
  SetCompanyCategoryAction,
  SetCorpModuleReadyedAction,
  SetFeedbackParamAction,
  SetIsObjectionAction,
} from '@/reducers/company.types'
import * as actionTypes from './actionTypes'

export const setIsObjection = (data: SetIsObjectionAction['data']): SetIsObjectionAction => {
  return {
    type: actionTypes.SET_IS_OBJECTION,
    data,
  } as const
}

export const setCollectState = (data: SetCollectStateAction['data']): SetCollectStateAction => {
  return {
    type: actionTypes.SET_COLLECT_STATE,
    data,
  } as const
}

export const getCorpHeaderInfo = (data: GetCompanyHeaderInfoAction['data']): GetCompanyHeaderInfoAction => {
  return {
    type: actionTypes.GET_COMPANYHEADER_INFO,
    data,
  } as const
}

export const getCorpInfo = (data: GetCompanyInfoAction['data']): GetCompanyInfoAction => {
  return {
    type: actionTypes.GET_COMPANY_INFO,
    data,
  } as const
}

export const pageShareholder = (data: PageShareholderAction['data']): PageShareholderAction => {
  return {
    type: actionTypes.PAGE_SHAREHOLDER,
    data,
  } as const
}

export const getTenderingInfo = (data: CompanyTenderingInfoAction['data']): CompanyTenderingInfoAction => {
  return {
    type: actionTypes.COMPANY_TENDERING_INFO,
    data,
  }
}

export const getBiddingInfo = (data: CompanyBiddingInfoAction['data']): CompanyBiddingInfoAction => {
  return {
    type: actionTypes.COMPANY_BIDDING_INFO,
    data,
  }
}

export const pageTelInfo = (data: CompanyTelInfoAction['data']): CompanyTelInfoAction => {
  return {
    type: actionTypes.COMPANY_TEL_INFO,
    data,
  }
}

export const pageMailInfo = (data: CompanyMailInfoAction['data']): CompanyMailInfoAction => {
  return {
    type: actionTypes.COMPANY_MAIL_INFO,
    data,
  }
}

export const pageBranchInfo = (data: CompanyBranchInfoAction['data']): CompanyBranchInfoAction => {
  return {
    type: actionTypes.COMPANY_BRANCH_INFO,
    data,
  }
}

export const getConfigInfoList = (data: GetCompanyConfigListAction['data']): GetCompanyConfigListAction => {
  return {
    type: actionTypes.GET_COMPANY_CONFIG_LIST,
    data,
  }
}

export const setCorpModuleReadyed = (data: SetCorpModuleReadyedAction['data']): SetCorpModuleReadyedAction => {
  return {
    type: actionTypes.SET_CORP_MODULE_READYED,
    data,
  } as const
}

export const getCompanyBasicNum = (data: GetCompanyBasicNumAction['data']): GetCompanyBasicNumAction => {
  return {
    type: actionTypes.GET_COMPANY_BASICNUM,
    data,
  } as const
}

export const setCorpCategory = (data: SetCompanyCategoryAction['data']): SetCompanyCategoryAction => {
  return {
    type: actionTypes.SET_COMPANY_CATEGORY,
    data,
  } as const
}

export const setCorpArea = (data: SetCompanyAreaAction['data']): SetCompanyAreaAction => {
  return {
    type: actionTypes.SET_COMPANY_AREA,
    data,
  } as const
}

export const setFeedBack = (data: SetFeedbackParamAction['data']): SetFeedbackParamAction => {
  return {
    type: actionTypes.SET_FEEDBACK_PARAM,
    data,
  } as const
}
