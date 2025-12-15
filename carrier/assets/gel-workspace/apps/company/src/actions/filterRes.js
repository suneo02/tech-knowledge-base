import * as actionTypes from './actionTypes'

export const subscribe = (data) => {
  return {
    type: actionTypes.RES_SUBSCRIBE,
    data,
  }
}

export const dissubscribe = (data) => {
  return {
    type: actionTypes.RES_DISSUBSCRIBE,
    data,
  }
}

export const clearDatas = () => {
  return {
    type: actionTypes.CLEAR_DATAS,
  }
}

export const clearSubType = () => {
  return {
    type: actionTypes.CLEAR_SUBTYPE,
  }
}

export const getContactByCropid = (data) => {
  return {
    type: actionTypes.GET_CONTACT_BY_CROPID,
    data,
  }
}
