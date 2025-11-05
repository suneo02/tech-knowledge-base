import * as actionTypes from "../actions/actionTypes";
import global from '../lib/global';

const initialState = {
  userInfo: {},
  verifycodeReqTime: {},
  wechatInfo: {},
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.REGESTER_LOGIN:
      if (action.data.code === global.SUCCESS) {
        let userInfo = action.data.data;
        return {
          ...state,
          userInfo
        }
      }
      break;
    case actionTypes.GET_VERIFYCODE:
      // console.log(action);
      // if (action.data.code === global.SUCCESS) {
      //   state.verifycodeReqTime[action.data.phone] = new Date().getTime();
      //   return { ...state };
      // }
      return state;
    case actionTypes.USERINFO_UPDATE:
      console.log(action);
      if (action.data.code === global.SUCCESS) {
        return { ...state };
      }
      break;
    case actionTypes.LOGIN_OUT:
      return { ...state, userInfo: {} }
    case actionTypes.GET_QRCODE:
      if (action.data.code === global.SUCCESS) {
        return {
          ...state,
          wechatInfo: action.data.data
        }
      }
      break;
    case actionTypes.WECHAT_REFRESH:
      return {
        ...state,
        // userInfo
      }
    default:
      return state;
  }
  return state;
}
export default reducer;