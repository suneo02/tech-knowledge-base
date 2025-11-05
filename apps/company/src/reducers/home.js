import * as actionTypes from '../actions/actionTypes'
import global from '../lib/global'

const initialState = {
  hotcorps: [],
  lastIndex: -1, // 推荐关注的参数
  corpevents: [],
  corpnews: [],
  ads: [],
  globalModalProps: null,
  userPackageinfo: null,
  // 用户权限接口是否完成
  userPackageInfoApiLoaded: false,
  preCorpList: [],
  preGroupList: [],
  vipPopupShow: false,
  wechatQrcode: null,
  paygoods: [],
  globalSearchReloadCurrent: false,
  bindPhoneModal: '',
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_BIND_PHONE_MODAL:
      return {
        ...state,
        bindPhoneModal: action.data,
      }
    case actionTypes.SET_GLOBALSEARCH:
      return {
        ...state,
        globalSearchReloadCurrent: action.data.globalSearchReloadCurrent,
      }
    case actionTypes.GET_PAYGOODS:
      return {
        ...state,
        paygoods: action.data.data,
      }
    case actionTypes.GET_PAYORDER:
      return {
        ...state,
        wechatQrcode: action.data.data,
      }
    case actionTypes.SHOW_VIPPOPUP:
      return {
        ...state,
        vipPopupShow: action.data.visible,
      }
    case actionTypes.GET_USERPACKAGE:
      if (action.data.code === global.SUCCESS) {
        return {
          ...state,
          userPackageinfo: action.data.data,
        }
      }
      break
    case actionTypes.SET_USERPACKAGE_LOADED:
      return {
        ...state,
        userPackageInfoApiLoaded: action.data,
      }

    case actionTypes.GET_PRECORPSEARCH:
      if (action.data.code === global.SUCCESS) {
        return {
          ...state,
          preCorpList: action.data.data,
        }
      }
      break

    case actionTypes.GET_PREGROUPSEARCH:
      if (action.data.code === global.SUCCESS) {
        return {
          ...state,
          preGroupList: action.data.data,
        }
      }
      break

    case actionTypes.GET_HOTCORP:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        return {
          ...state,
          hotcorps: action.data.data.data,
          lastIndex: action.data.data.lastIndex,
        }
      }
      break
    case actionTypes.GET_CORPEVENT:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        return {
          ...state,
          corpevents: state.corpevents.concat(action.data.data),
        }
      }
      break
    case actionTypes.GET_CORPNEWS:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        return {
          ...state,
          corpnews: state.corpnews.concat(action.data.data),
        }
      }
      break
    case actionTypes.GET_ADS:
      // console.log(action)
      if (action.data.errorCode === 0) {
        return {
          ...state,
          ads: action.data.data.list,
        }
      }
      break
    case actionTypes.TOGGLE_COLLECT:
      // console.log(action)
      if (state.hotcorps.length === 0) {
        return state
      }
      if (action.data.code === global.SUCCESS) {
        state.hotcorps[action.data.index].collect_flag =
          state.hotcorps[action.data.index].collect_flag === '0' ? '1' : '0'
        return {
          ...state,
          hotcorps: JSON.parse(JSON.stringify(state.hotcorps)),
        }
      }
      break
    case actionTypes.SET_GLOBAL_MODAL:
      return {
        ...state,
        globalModalProps: action.data,
      }
    case actionTypes.CLEAR_GLOBAL_MODAL:
      // console.log(1111)
      return {
        ...state,
        globalModalProps: null,
      }
    case actionTypes.SET_GLOBAL_VIP_MODAL:
      return {
        ...state,
        globalVipModalProps: action.data,
      }
    default:
      return state
  }
  return state
}
export default reducer
