import * as actionTypes from './actionTypes'

export const noticeQuery = (data) => {
  return {
    type: actionTypes.NOTICE_QUERY,
    data,
  }
}

export const noticeUpdate = (data) => {
  return {
    type: actionTypes.NOTICE_UPDATE,
    data,
  }
}

export const getCustomSettings = (data) => {
  return {
    type: actionTypes.GET_CUSTOME_SETTINGS,
    data,
  }
}

export const recommendUpdate = (data) => {
  return {
    type: actionTypes.RECOMMEND_UPDATE,
    data,
  }
}

export const getUserIndustry = (data) => {
  return {
    type: actionTypes.GET_USER_INDUSTRY,
    data,
  }
}

export const setUserIndustry = (data) => {
  return {
    type: actionTypes.SET_USER_INDUSTRY,
    data,
  }
}

export const getUserSale = (data) => {
  return {
    type: actionTypes.GET_USER_SALE,
    data,
  }
}

export const setUserSale = (data) => {
  return {
    type: actionTypes.SET_USER_SALE,
    data,
  }
}

export const getTerritoryList = (data) => {
  return {
    type: actionTypes.MY_TERRITORY_LIST,
    data,
  }
}

export const getFiles = (data) => {
  return {
    type: actionTypes.GET_FILES,
    data,
  }
}
