import * as actionTypes from '../actions/actionTypes'
import global from '../lib/global'
import { message } from 'antd'
import { arrayToMap } from '../lib/utils'

const initialState = {
  filters: [],
  areaMap: {},
  industryMap: {},
  industry2Map: {},
  mySusList: [],
  seenList: [],
  fellowList: [],
  company: '',
  industryList: [],
  subEmail: '',
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_MYSUSLIST:
      if (action.data.code === global.SUCCESS) {
        return {
          ...state,
          subEmail: action.data.data.mail || state.subEmail || '',
          mySusList: action.data.data.records && action.data.data.records.length ? action.data.data.records : [],
        }
      }
      break
    case actionTypes.GET_SEENLIST:
      console.log('GET_SEENLIST', action.data.data.list)
      if (action.data.code === global.SUCCESS) {
        if (action.data.data.list && action.data.data.list.length > 0) {
          return {
            ...state,
            seenList: state.seenList.concat(action.data.data.list),
          }
        } else {
          if (action.data.pageNum > 1) {
            message.info('已经到底啦~')
          }
          return state
        }
      }
      break
    case actionTypes.GET_FELLOWLIST:
      // console.log('GET_FELLOWLIST', action.data.data.list)
      if (action.data.code === global.SUCCESS) {
        if (action.data.data.list && action.data.data.list.length > 0) {
          return {
            ...state,
            // fellowList: state.fellowList.concat(action.data.data.list),
            fellowList: action.data.data.list,
          }
        } else {
          if (action.data.pageNum > 1) {
            message.info('已经到底啦~')
          }
          return state
        }
      }
      break
    case actionTypes.QUERY_USER_INDUSTRIES:
      // console.log('GET_FELLOWLIST', action.data.data.list)
      if (action.data.code === global.SUCCESS) {
        const { company, industryList } = action.data.data
        return {
          ...state,
          company: company || '',
          industryList: industryList || [],
        }
      }
      break
    case 'RESET':
      return {
        ...state,
        mySusList: [],
        seenList: [],
        fellowList: [],
      }
    default:
      return state
  }
  return state
}
export default reducer
