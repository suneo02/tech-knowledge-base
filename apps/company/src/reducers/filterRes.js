import * as actionTypes from "../actions/actionTypes";
import global from '../lib/global';
import { message } from "antd";
// import { translation } from '../locales/i18n';

const initialState = {
  indicators: [],
  superQueryLogic: [],
  data: [],
  pageNum: 1,
  pageSize: 10,
  total: 0,
  subscribed: false,
  subscribeId: null,    // 订阅id
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_INDICATOR:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        action.data.data[0].indicator === "corp_name" && action.data.data.splice(0, 1);
        return {
          ...state,
          indicators: action.data.data,
        }
      }
      break;
    case actionTypes.SEARCH:
      // console.log(action)
    //   action.data = JSON.parse(action.data.Data)
      if (action.data.code === global.SUCCESS) {
        // if (action.data.data.pageNum === 1) {          
        //   return {
        //     ...state,
        //     ...action.data.data,
        //   }
        // }
        // let data = JSON.parse(JSON.stringify(state.data));
        // [].push.apply(data, action.data.data.data);
        return {
          ...state,
          ...action.data.data,
        //   data,
        }
      } else {
        return {
          ...state,
          // data: []
        }
      }
    case actionTypes.MEASURE_SEARCH:
      // console.log(action)
      const { code, data, pageNum } = action.data;
      if (action.data.code === global.SUCCESS) {
        state.data.splice(pageNum * 20, 20, ...data);
        let _data = JSON.parse(JSON.stringify(state.data));
        return {
          ...state,
          data: _data,
        }
      }
      break;
    case actionTypes.RES_SUBSCRIBE:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        // message.info("开启订阅成功！");
        return {
          ...state,
          // subscribed: !state.subscribed,
          subscribed: true,
          subscribeId: action.data.data,
        }
      }
      break;
    case actionTypes.RES_DISSUBSCRIBE:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        message.info(window.intl(283403));
        return {
          ...state,
          // subscribed: !state.subscribed,
          subscribed: false,
          subscribeId: null,
        }
      }
      break;
    case actionTypes.CLEAR_DATAS:
      // console.log(action)
      return {
        ...state,
        data: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        // subscribed: false,
        // subscribeId: null,    // 订阅id
      }
      break;
    case actionTypes.CLEAR_SUBTYPE:
      // console.log(action)
      return {
        ...state,
        data: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        subscribed: false,
        subscribeId: null,    // 订阅id
      }
      break;
    case actionTypes.GET_CONTACT_BY_CROPID:
      // console.log(action);
      if (action.data.code === global.SUCCESS) {
        const { data, index } = action.data;
        Object.assign(state.data[index], data);
        // console.log(state.data[index])
        let dataArr = JSON.parse(JSON.stringify(state.data));
        return {
          ...state,
          data: dataArr,
        }
      }
      break;
    default:
      return state;
  }
  return state;
}
export default reducer;