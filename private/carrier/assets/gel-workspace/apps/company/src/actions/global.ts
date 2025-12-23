import * as actionTypes from './actionTypes'

export const setGolbalModal = (data) => {
  return {
    type: actionTypes.SET_GLOBAL_MODAL,
    data,
  }
}

export const clearGolbalModal = () => {
  return {
    type: actionTypes.CLEAR_GLOBAL_MODAL,
  }
}

export const setLanguage = (data) => {
  return {
    type: actionTypes.SET_LANGUAGE,
    data,
  }
}

export const setGolbalVipModal = (data) => {
  return {
    type: actionTypes.SET_GLOBAL_VIP_MODAL,
    data,
  }
}
