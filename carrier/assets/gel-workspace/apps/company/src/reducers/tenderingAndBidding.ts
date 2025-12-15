import * as actionTypes from '../actions/actionTypes'
import global from '../lib/global'

const roleOrder = {
  采购单位: 1,
  代理机构: 2,
  拟定供应商: 3,
  '中标人/供应商': 4,
  中标候选人: 5,
  投标单位: 6,
}

const initialState = {
  filterItems: null,
  biddingList: [],
  biddingPageNum: 1,
  biddingPageSize: 10,
  biddingTotal: 0,
  suggestList: [],
  suggestPageNum: 1,
  suggestPageSize: 10,
  suggestTotal: 0,
  biddingInfo: {},
  biddingInfoCompany: [],
  biddingContent: {},
  subList: [],
  attachments: [],
  process: [],
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.BIDDING_FILTERITEMS:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        return {
          ...state,
          filterItems: action.data.data,
        }
      }
      break
    case actionTypes.BIDDING_SEARCH:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        const { data, pageNum, pageSize, total } = action.data.data
        if (pageNum === 1) {
          return {
            ...state,
            biddingList: data,
            biddingPageNum: pageNum,
            biddingPageSize: pageSize,
            biddingTotal: total,
          }
        }
        ;[].push.apply(state.biddingList, data)
        return {
          ...state,
          biddingPageNum: pageNum,
          biddingPageSize: pageSize,
          biddingTotal: total,
        }
      }
      break
    case actionTypes.BIDDING_SUGGEST:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        const { data, pageNum, pageSize, total } = action.data.data
        if (pageNum === 1) {
          return {
            ...state,
            suggestList: data,
            suggestPageNum: pageNum,
            suggestPageSize: pageSize,
            suggestTotal: total,
          }
        }
        ;[].push.apply(state.suggestList, data)
        return {
          ...state,
          suggestPageNum: pageNum,
          suggestPageSize: pageSize,
          suggestTotal: total,
        }
      }
      break
    case actionTypes.BIDDING_DETAIL:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        return {
          ...state,
          biddingInfo: action.data.data,
        }
      }
      break
    case actionTypes.BIDDING_DETAIL_SUB:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        return {
          ...state,
          biddingInfoCompany: action.data.data.biddingSubVOList || [],
        }
      }
      break
    case actionTypes.BIDDING_DETAIL_SUB_REL:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        action.data.data.biddingSubRelVOList.sort((a, b) => {
          return roleOrder[a.subjectType] - roleOrder[b.subjectType]
        })
        return {
          ...state,
          subList: action.data.data.biddingSubRelVOList,
        }
      }
      break
    case actionTypes.BIDDING_ATTACHMENT:
      console.log(action)
      if (action.data.code === global.SUCCESS) {
        return {
          ...state,
          attachments: action.data.data,
        }
      }
      break
    case actionTypes.BIDDING_PROCESS:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        return {
          ...state,
          process: action.data.data.biddingProcessList || [],
        }
      }
      break
    case actionTypes.BIDDING_CLEAR:
      return {
        ...state,
        biddingList: [],
      }
    default:
      return state
  }
  return state
}
export default reducer
