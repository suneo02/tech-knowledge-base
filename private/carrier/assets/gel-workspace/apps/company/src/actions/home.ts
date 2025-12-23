import * as actionTypes from './actionTypes'

export const getHotcorp = (data) => {
  return {
    type: actionTypes.GET_HOTCORP,
    data,
  }
}

export const getCorpevent = (data) => {
  return {
    type: actionTypes.GET_CORPEVENT,
    data,
  }
}

export const getCorpnews = (data) => {
  return {
    type: actionTypes.GET_CORPNEWS,
    data,
  }
}

export const getAds = (data) => {
  return {
    type: actionTypes.GET_ADS,
    data,
  }
}

export const getUserPackageInfo = (data) => {
  return {
    type: actionTypes.GET_USERPACKAGE,
    data,
  }
}

export const showVipPopup = (data) => {
  console.log(data)
  return {
    type: actionTypes.SHOW_VIPPOPUP,
    data,
  }
}

export const getPreGroupSearch = (data) => {
  return {
    type: actionTypes.GET_PREGROUPSEARCH,
    data,
  }
}

export const createPayOrder = (data) => {
  return {
    type: actionTypes.GET_PAYORDER,
    data,
  }
}

export const getPayGoods = (data) => {
  return {
    type: actionTypes.GET_PAYGOODS,
    data,
  }
}

export const setGlobalSearch = (data) => {
  return {
    type: actionTypes.SET_GLOBALSEARCH,
    data,
  }
}

export const setBindPhoneModal = (data) => {
  return {
    type: actionTypes.SET_BIND_PHONE_MODAL,
    data,
  }
}

export const setUserPackageLoaded = (data) => {
  return {
    type: actionTypes.SET_USERPACKAGE_LOADED,
    data,
  }
}
