import * as actionTypes from './actionTypes'

export const login = (data) => {
  return {
    type: actionTypes.REGESTER_LOGIN,
    data,
  }
}

export const sendMessage = (data) => {
  return {
    type: actionTypes.GET_VERIFYCODE,
    data,
  }
}
