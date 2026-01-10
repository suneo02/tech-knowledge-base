import * as actionTypes from './actionTypes'

export const setGlobalSearchTimeStamp = (data: number) => {
  return {
    type: actionTypes.SET_GLOBAL_SEARCH_TIMESTAMP,
    data,
  } as const
}

export const setGlobalSearchKeyWord = (data) => {
  return {
    type: actionTypes.SET_GLOBAL_SEARCH_KEYWORD,
    data,
  } as const
}

export const getCompanySearchList = (data) => {
  return {
    type: actionTypes.SEARCH_COMPANY,
    data,
  } as const
}

export const getCompanyView = (data) => {
  return {
    type: actionTypes.VIEW_COMPANY,
    data,
  } as const
}

export const getCompanyHotView = (data) => {
  return {
    type: actionTypes.HOT_VIEW_COMPANY,
    data,
  } as const
}

export const clearCompanyView = (data) => {
  return {
    type: actionTypes.CLEAR_VIEW,
    data,
  } as const
}

export const getGroupList = (data) => {
  return {
    type: actionTypes.SEARCH_GROUP,
    data,
  } as const
}

export const getGroupHotView = (data) => {
  return {
    type: actionTypes.HOT_VIEW_GROUP,
    data,
  } as const
}

export const getJobView = (data) => {
  return {
    type: actionTypes.VIEW_JOB,
    data,
  } as const
}

export const getJobHotView = (data) => {
  return {
    type: actionTypes.HOT_VIEW_JOB,
    data,
  } as const
}

export const getIntellectualList = (data) => {
  return {
    type: actionTypes.SEARCH_INTELLECTUAL,
    data,
  } as const
}

export const getIntellectualViewList = (data) => {
  return {
    type: actionTypes.VIEW_INTELLECTUAL,
    data,
  } as const
}

export const clearIntellectualFilter = (data) => {
  return {
    type: actionTypes.CLEAR_FILTER,
    data,
  } as const
}

export const getBidSearchList = (data) => {
  return {
    type: actionTypes.SEARCH_BID,
    data,
  } as const
}
export const getCollectlist = (data) => {
  return {
    type: actionTypes.COLLECT_CLIST,
    data,
  } as const
}

export const addCollect = (data) => {
  return {
    type: actionTypes.ADD_COLLECT,
    data,
  } as const
}

export const getOutCompanySearch = (data) => {
  return {
    type: actionTypes.SEARCH_OUTCOMPANY,
    data,
  } as const
}

export const getOutCompanyView = (data) => {
  return {
    type: actionTypes.VIEW_OUTCOMPANY,
    data,
  } as const
}

export const getPatentList = (data) => {
  return {
    type: actionTypes.SEARCH_PATENT,
    data,
  } as const
}

export const getPersonList = (data: any) => {
  return {
    type: actionTypes.SEARCH_PERSON,
    data,
  } as const
}

export const getPersonView = (data: any) => {
  return {
    type: actionTypes.VIEW_PERSON,
    data,
  } as const
}

export const getOverSeaList = (data: any) => {
  return {
    type: actionTypes.SEARCH_GLOBALWORLD,
    data,
  } as const
}
