import type {
  ClearGlobalModalAction,
  GlobalModalProps,
  SetGlobalModalAction,
  SetLanguageAction,
} from '../reducers/global.types'
import * as actionTypes from './actionTypes'

export const setGolbalModal = (data: GlobalModalProps): SetGlobalModalAction => {
  return {
    type: actionTypes.SET_GLOBAL_MODAL,
    data,
  } as const
}

export const clearGolbalModal = (): ClearGlobalModalAction => {
  return {
    type: actionTypes.CLEAR_GLOBAL_MODAL,
    data: undefined,
  } as const
}

export const setLanguage = (data: { language: string }): SetLanguageAction => {
  return {
    type: actionTypes.SET_LANGUAGE,
    data,
  } as const
}

export const setGolbalVipModal = (data) => {
  return {
    type: actionTypes.SET_GLOBAL_VIP_MODAL,
    data,
  } as const
}
