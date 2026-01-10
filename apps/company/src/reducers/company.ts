/** @format */

import { getCorpNameOriginalByBaseAndCardInfo, getCorpNameTransByCardInfo } from 'gel-util/misc'
import * as actionTypes from '../actions/actionTypes'
import global from '../lib/global'
import { CorpAction, CorpState } from './company.types'
import { IState } from './type'

export type { CorpState, FeedBackPara } from './company.types'

const initialState: CorpState = {
  baseInfo: {},
  corpHeaderInfo: {},
  // 股东
  shareholder: [],
  shareholderPagination: {
    pageNum: 1,
    pageSize: 10,
    total: 0,
  },
  // 招标标签
  tenderingTags: [],
  tenderingTypes: [],
  // 招标
  tenderingList: [],
  tenderingPagination: {
    pageNum: 1,
    pageSize: 10,
    total: 0,
  },
  // 投标标签
  biddingTags: [],
  biddingTypes: [],
  // 投标
  biddingList: [],
  biddingPagination: {
    pageNum: 1,
    pageSize: 10,
    total: 0,
  },
  // 电话
  telList: [],
  telPagination: {
    pageNum: 1,
    pageSize: 10,
    total: 0,
  },
  // 邮箱
  mailList: [],
  mailPagination: {
    pageNum: 1,
    pageSize: 10,
    total: 0,
  },
  // 分支机构
  branchList: [],
  branchPagination: {
    pageNum: 1,
    pageSize: 10,
    total: 0,
  },
  corpNews: [],

  // 企业地图
  companyConfigList: [],

  // 已经加载过的module集合
  scrollModuleIds: [],
  // 统计数字
  basicnum: {},
  corpCategory: [],
  feedBackPara: {},
  corpArea: '',
}

const reducer = (state = initialState, action: CorpAction): CorpState => {
  switch (action.type) {
    case 'SET_CORP_OTHER_INFO':
      return {
        ...state,
        corpOtherInfo: action.data,
      }
    case actionTypes.SET_COMPANY_AREA: {
      return {
        ...state,
        corpArea: action.data,
      }
    }
    case actionTypes.SET_IS_OBJECTION: {
      return {
        ...state,
        isObjection: action.data,
      }
    }
    case actionTypes.SET_COLLECT_STATE: {
      return {
        ...state,
        collectState: action.data,
      }
    }
    case actionTypes.SET_FEEDBACK_PARAM:
      return {
        ...state,
        feedBackPara: action.data,
      }
    case actionTypes.SET_COMPANY_CATEGORY:
      return {
        ...state,
        corpCategory: action.data,
      }
    case actionTypes.GET_COMPANY_BASICNUM:
      return {
        ...state,
        basicnum: action.data.data,
      }
    case actionTypes.SET_CORP_MODULE_READYED:
      return {
        ...state,
        scrollModuleIds: action.data,
      }
    case actionTypes.GET_COMPANYHEADER_INFO:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        return {
          ...state,
          corpHeaderInfo: action.data.data,
        }
      }
      break
    case actionTypes.GET_COMPANY_INFO:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        return {
          ...state,
          baseInfo: action.data.data,
        }
      }
      break
    case actionTypes.PAGE_SHAREHOLDER:
      if (action.data.code === global.SUCCESS) {
        return {
          ...state,
          shareholder: action.data.data.list,
          shareholderPagination: {
            pageNum: action.data.pageNum,
            pageSize: action.data.pageSize,
            total: action.data.data.total,
          },
        }
      }
      break
    case actionTypes.COMPANY_TENDERING_INFO:
      if (action.data.code === global.SUCCESS) {
        const { pageNum, pageSize } = action.data
        const { aggregations, highlight, list, total } = action.data.data
        return {
          ...state,
          tenderingTags: pageNum === 1 ? highlight || [] : state.tenderingTags,
          tenderingTypes: pageNum === 1 ? aggregations?.aggs_bid_type || [] : state.tenderingTypes,
          tenderingList: list,
          tenderingPagination: {
            pageNum: pageNum,
            pageSize: pageSize,
            total: total,
          },
        }
      }
      break
    case actionTypes.COMPANY_BIDDING_INFO:
      if (action.data.code === global.SUCCESS) {
        const { pageNum, pageSize } = action.data
        const { aggregations, highlight, list, total } = action.data.data
        return {
          ...state,
          biddingTags: pageNum === 1 ? highlight || [] : state.biddingTags,
          biddingTypes: pageNum === 1 ? aggregations?.aggs_bid_type || [] : state.biddingTypes,
          biddingList: list,
          biddingPagination: {
            pageNum: pageNum,
            pageSize: pageSize,
            total: total,
          },
        }
      }
      break

    case actionTypes.COMPANY_TEL_INFO:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        return {
          ...state,
          telList: action.data.data.dataList,
          telPagination: {
            pageNum: action.data.pageNum,
            pageSize: action.data.pageSize,
            total: action.data.data.total,
          },
        }
      }
      break
    case actionTypes.COMPANY_MAIL_INFO:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        return {
          ...state,
          mailList: action.data.data.dataList,
          mailPagination: {
            pageNum: action.data.pageNum,
            pageSize: action.data.pageSize,
            total: action.data.data.total,
          },
        }
      }
      break
    case actionTypes.COMPANY_BRANCH_INFO:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        return {
          ...state,
          branchList: action.data.data.dataList,
          branchPagination: {
            pageNum: action.data.pageNum,
            pageSize: action.data.pageSize,
            total: action.data.data.total,
          },
        }
      }
      break

    case actionTypes.GET_COMPANY_CONFIG_LIST:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        return {
          ...state,
          companyConfigList: action.data.data,
        }
      }
      break
    default:
      return state
  }
  return state
}
export default reducer

export const selectCorpNameIntl = (state: IState): string => {
  const { baseInfo, corpHeaderInfo } = state.company
  const trans = getCorpNameTransByCardInfo(corpHeaderInfo || {}) || ''
  const original = getCorpNameOriginalByBaseAndCardInfo(baseInfo || {}, corpHeaderInfo || {}) || ''
  const val = typeof trans === 'string' ? trans.trim() : ''
  return val ? val : original
}
