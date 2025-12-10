import * as actionTypes from '../actions/actionTypes'
import global from '../lib/global'

// 处理全局状态，全局弹窗等
const initialState = {
  globalModalProps: null,
  language: global.default_language,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_GLOBAL_MODAL:
      return {
        ...state,
        globalModalProps: action.data,
      }
    case actionTypes.CLEAR_GLOBAL_MODAL:
      return {
        ...state,
        globalModalProps: null,
      }
    case actionTypes.SET_LANGUAGE:
      return {
        ...state,
        language: action.data.language,
        en_access_config: action.data.language !== 'zh',
      }
    default:
      return state
  }
  return state
}
export default reducer
