import * as actionTypes from '../actions/actionTypes'
import global from '../lib/global'

const initialState = {
  notice: {},
  // recommend: {},
  userInfo: {},
  bizOppSwitch: false,
  industryNewsSwitch: false,
  recommendSwitch: false,
  saleInfo: {},
  userIndustry: {},
  territoryList: [],
  territoryPagination: {
    pageNum: 1,
    pageSize: 10,
    total: 0,
  },
  downloadList: [],
  downloadPagination: {
    pageNum: 1,
    pageSize: 10,
    total: 0,
  },
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.NOTICE_QUERY:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        return {
          ...state,
          notice: action.data.data,
        }
      }
      break
    case actionTypes.NOTICE_UPDATE:
      // console.log(action);
      if (action.data.code === global.SUCCESS) {
        return { ...state }
      }
      break
    case actionTypes.GET_CUSTOME_SETTINGS:
      // console.log(action);
      if (action.data.code === global.SUCCESS) {
        return { ...state, ...action.data.data }
      }
      break
    case actionTypes.RECOMMEND_UPDATE:
      // console.log(action);
      if (action.data.code === global.SUCCESS) {
        const { bizOppSwitch, industryNewsSwitch, recommendSwitch } = action.data
        return {
          ...state,
          bizOppSwitch,
          industryNewsSwitch,
          recommendSwitch,
        }
      }
      break
    case actionTypes.MY_TERRITORY_LIST:
      // console.log(action);
      if (action.data.code === global.SUCCESS) {
        const { list, pageNum, pageSize, total } = action.data.data
        return {
          ...state,
          territoryList: list,
          territoryPagination: {
            pageNum,
            pageSize,
            total,
          },
        }
      }
      break
    case actionTypes.GET_FILES:
      // console.log(action);
      if (action.data.code === global.SUCCESS) {
        const { list, pageNum, pageSize, total } = action.data.data
        return {
          ...state,
          downloadList: list,
          downloadPagination: {
            pageNum,
            pageSize,
            total,
          },
        }
      }
      break
    default:
      return state
  }
  return state
}
export default reducer
