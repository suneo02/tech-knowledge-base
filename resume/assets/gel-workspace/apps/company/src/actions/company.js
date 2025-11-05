import * as actionTypes from './actionTypes'

export const setIsObjection = (data) => {
  return {
    type: actionTypes.SET_IS_OBJECTION,
    data,
  }
}

export const setCollectState = (data) => {
  return {
    type: actionTypes.SET_COLLECT_STATE,
    data,
  }
}

export const getCorpHeaderInfo = (data) => {
  return {
    type: actionTypes.GET_COMPANYHEADER_INFO,
    data,
  }
}

export const getCorpInfo = (data) => {
  return {
    type: actionTypes.GET_COMPANY_INFO,
    data,
  }
}

export const pageShareholder = (data) => {
  return {
    type: actionTypes.PAGE_SHAREHOLDER,
    data,
  }
}

export const queryCorpNews = (data) => {
  return {
    type: actionTypes.QUERY_CROPNEWS,
    data,
  }
}

export const toggleCollect = (data) => {
  return {
    type: actionTypes.COMPANY_DETAIL_TOGGLE_COLLECT,
    data,
  }
}

export const getTenderingInfo = (data) => {
  return {
    type: actionTypes.COMPANY_TENDERING_INFO,
    data,
  }
}

export const getBiddingInfo = (data) => {
  return {
    type: actionTypes.COMPANY_BIDDING_INFO,
    data,
  }
}

export const pageTelInfo = (data) => {
  return {
    type: actionTypes.COMPANY_TEL_INFO,
    data,
  }
}

export const pageMailInfo = (data) => {
  return {
    type: actionTypes.COMPANY_MAIL_INFO,
    data,
  }
}

export const pageBranchInfo = (data) => {
  return {
    type: actionTypes.COMPANY_BRANCH_INFO,
    data,
  }
}

export const getConfigInfoList = (data) => {
  return {
    type: actionTypes.GET_COMPANY_CONFIG_LIST,
    data,
  }
}

export const setCorpModuleReadyed = (data) => {
  return {
    type: actionTypes.SET_CORP_MODULE_READYED,
    data,
  }
}

export const getCompanyBasicNum = (data) => {
  return {
    type: actionTypes.GET_COMPANY_BASICNUM,
    data,
  }
}

export const setCorpCategory = (data) => {
  return {
    type: actionTypes.SET_COMPANY_CATEGORY,
    data,
  }
}

export const setCorpArea = (data) => {
  return {
    type: actionTypes.SET_COMPANY_AREA,
    data,
  }
}

export const setFeedBack = (data) => {
  return {
    type: actionTypes.SET_FEEDBACK_PARAM,
    data,
  }
}
