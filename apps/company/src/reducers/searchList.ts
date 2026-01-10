import * as actionTypes from '../actions/actionTypes'
import global from '../lib/global'
import type { SearchListAction, SearchListState } from './searchList.types'

const initialState: SearchListState = {}

const reducer = (state = initialState, action: SearchListAction): SearchListState => {
  switch (action.type) {
    case actionTypes.HOT_VIEW_GROUP:
      if (action.data.code === global.SUCCESS) {
        if (action.data.data && action.data.data.length > 0) {
          return {
            ...state,
            groupViewHot: action.data.data,
          }
        }
      }
      break
    case actionTypes.HOT_VIEW_COMPANY:
      if (action.data.code === global.SUCCESS) {
        if (action.data.data && action.data.data.length > 0) {
          return {
            ...state,
            companyViewHot: action.data.data,
          }
        }
      }
      break
    case actionTypes.SEARCH_COMPANY:
      if (action.data.code == global.SUCCESS) {
        return {
          ...state,
          companySearchList: state.companySearchList
            ? action.data.pageNo > 0
              ? state.companySearchList.concat(action.data.data?.search || [])
              : action.data.data?.search
            : action.data.data?.search,
          companySearchErrorCode: action.data.ErrorCode,
        }
      } else {
        return {
          ...state,

          companySearchList: state.companySearchList ? state.companySearchList : [],
          companySearchErrorCode: action.data.ErrorCode,
        }
      }
      break
    case actionTypes.CLEAR_VIEW:
      if (action.data.data == 'deleting user history') {
        return {
          ...state,
          companyView: '',
        }
      }
      break
    case actionTypes.VIEW_COMPANY:
      if (action.data.code === global.SUCCESS) {
        return {
          ...state,
          companyView: action.data.data,
        }
      }
      break
    case actionTypes.VIEW_PERSON:
      if (action.data.code === global.SUCCESS) {
        return {
          ...state,
          personView: action.data.data,
        }
      }
      break
    case actionTypes.COLLECT_CLIST:
      if (action.data.code === global.SUCCESS) {
        return {
          ...state,
          collectList: action.data.data,
        }
      }
      break
    case actionTypes.SEARCH_GROUP:
      if (action.data.code) {
        if (action.data.data) {
          return {
            ...state,
            groupList: state.groupList
              ? action.data.Page.CurrentPage > 0
                ? state.groupList.concat(action.data.data.list)
                : action.data.data.list
              : action.data.data.list,
            groupListErrorCode: action.data.ErrorCode,
          }
        } else {
          return {
            ...state,
            groupList: '',
            groupListErrorCode: action.data.ErrorCode,
          }
        }
      }
      break

    case actionTypes.SEARCH_PERSON:
      if (action.data.code) {
        if (action.data.data) {
          return {
            ...state,
            personList: state.personList
              ? action.data.Page.CurrentPage > 0
                ? state.personList.concat(action.data.data)
                : action.data.data
              : action.data.data,
            personListErrorCode: action.data.ErrorCode,
          }
        } else {
          return {
            ...state,
            personList: [],
            personListErrorCode: action.data.ErrorCode,
          }
        }
      }
      break

    case 'UPDATE_PERSON_TRANSLATION':
      if (action.data.translatedData && Array.isArray(state.personList)) {
        // 根据 personId 精确替换翻译数据
        const updatedList = state.personList.map((item) => {
          const translatedItem = action.data.translatedData.find(
            (t) => t.personId === item.personId && t.companyCode === item.companyCode
          )
          return translatedItem ? { ...item, ...translatedItem } : item
        })
        return {
          ...state,
          personList: updatedList,
        }
      }
      break
    case actionTypes.SEARCH_GLOBALWORLD:
      if (action.data.code) {
        if (action.data.data) {
          return {
            ...state,
            overseaSearchList: state.overseaSearchList
              ? action.data.pageNo > 0
                ? state.overseaSearchList.concat(action.data.data)
                : action.data.data
              : action.data.data,
            overseaSearchListErrorCode: action.data.ErrorCode,
          }
        } else {
          return {
            ...state,
            overseaSearchList: [],
            overseaSearchListErrorCode: action.data.ErrorCode,
          }
        }
      }
      break
    case actionTypes.SEARCH_JOB:
      if (action.data.code === global.SUCCESS) {
        if (action.data.data) {
          return {
            ...state,
            jobList: state.jobList
              ? action.data.Page.CurrentPage > 0
                ? state.jobList.concat(action.data.data.list)
                : action.data.data.list
              : action.data.data.list,
            jobListErrorCode: action.data.ErrorCode,
          }
        } else {
          return {
            ...state,
            jobList: '',
            jobListErrorCode: action.data.ErrorCode,
          }
        }
      }
      break
    case actionTypes.VIEW_JOB:
      if (action.data.code === global.SUCCESS) {
        if (action.data.data && action.data.data.length > 0) {
          return {
            ...state,
            jobView: action.data.data,
          }
        }
      }
      break
    case actionTypes.HOT_VIEW_JOB:
      if (action.data.code === global.SUCCESS) {
        if (action.data.data && action.data.data.length > 0) {
          return {
            ...state,
            jobHotView: action.data.data,
          }
        }
      }
      break
    case actionTypes.SEARCH_INTELLECTUAL:
      if (action.data.code === global.SUCCESS) {
        if (action.data.data) {
          return {
            ...state,
            intelluctalList: state.intelluctalList
              ? action.data.Page.CurrentPage > 0
                ? state.intelluctalList.concat(action.data.data.list)
                : action.data.data.list
              : action.data.data.list,
            brandState: state.brandState
              ? state.brandState
              : action.data.data.aggregations
                ? action.data.data.aggregations.aggs_trademark_status
                : '',
            brandType: state.brandType
              ? state.brandType
              : action.data.data.aggregations
                ? action.data.data.aggregations.aggs_international_classification
                : '',
            intelluctalErrorCode: action.data.ErrorCode,
            patentSecondType: [],
          }
        } else {
          return {
            ...state,
            intelluctalList: [],
            brandState: '',
            brandType: '',
            intelluctalErrorCode: action.data.ErrorCode,
            patentSecondType: [],
          }
        }
      }
      break
    case actionTypes.SEARCH_PATENT:
      console.log(action.data)
      if (action.data.code === global.SUCCESS) {
        if (action.data.data) {
          return {
            ...state,
            intelluctalList: state.intelluctalList
              ? action.data.pageNo > 0
                ? state.intelluctalList.concat(action.data.data.list)
                : action.data.data.list
              : action.data.data.list,
            patentSecondType: state.patentSecondType
              ? action.data.patentType == state.patentType
                ? state.patentSecondType
                : action.data.data.aggregations && action.data.data.aggregations.agg_patentClassification
                  ? action.data.data.aggregations.agg_patentClassification
                  : []
              : action.data.data.aggregations && action.data.data.aggregations.agg_patentClassification
                ? action.data.data.aggregations.agg_patentClassification
                : [],
            intelluctalErrorCode: action.data.ErrorCode,
            patentType: action.data.patentType ? action.data.patentType : '',
          }
        } else {
          return {
            ...state,
            intelluctalList: [],
            patentSecondType: [],
            intelluctalErrorCode: action.data.ErrorCode,
          }
        }
      } else {
        if (!action.data.pageNo) {
          return {
            ...state,
            intelluctalList: [],
          }
        }
      }
      break
    case actionTypes.VIEW_INTELLECTUAL:
      if (action.data.code === global.SUCCESS) {
        if (action.data.data && action.data.data.length > 0) {
          return {
            ...state,
            intelluctalViewList: action.data.data,
          }
        }
      }
      break
    case actionTypes.CLEAR_FILTER:
      return {
        ...state,
        brandState: '',
        brandType: '',
        patentSecondType: [],
      }
      break
    case actionTypes.SEARCH_BID:
      if (action.data.code === global.SUCCESS) {
        if (action.data.data) {
          return {
            ...state,
            bidSearchList: state.bidSearchList
              ? action.data.Page.CurrentPage > 0
                ? state.bidSearchList.concat(action.data.data.list)
                : action.data.data.list
              : action.data.data.list,
            bidErrorCode: action.data.ErrorCode,
          }
        } else {
          return {
            ...state,
            bidSearchList: [],
            bidErrorCode: action.data.ErrorCode,
          }
        }
      }
      break

    case 'UPDATE_BID_TRANSLATION':
      if (action.data.translatedData && Array.isArray(state.bidSearchList)) {
        // 根据 detail_id 精确替换翻译数据
        const updatedList = state.bidSearchList.map((item) => {
          const translatedItem = action.data.translatedData.find((t) => t.detail_id === item.detail_id)
          return translatedItem ? { ...item, ...translatedItem } : item
        })
        return {
          ...state,
          bidSearchList: updatedList,
        }
      }
      break

    case 'UPDATE_PATENT_TRANSLATION':
      if (action.data.translatedData && Array.isArray(state.intelluctalList)) {
        // 根据 dataId 精确替换翻译数据
        const updatedList = state.intelluctalList.map((item) => {
          const translatedItem = action.data.translatedData.list.find((t) => item.dataId && item.dataId === t.dataId)
          return translatedItem ? { ...item, ...translatedItem } : item
        })
        const translatedAgg = action.data.translatedData.aggregations?.agg_patentClassification
        let updatedPatentSecondType = state.patentSecondType
        if (Array.isArray(state.patentSecondType) && Array.isArray(translatedAgg) && translatedAgg.length) {
          updatedPatentSecondType = state.patentSecondType.map((item: any, idx: number) => {
            const t = translatedAgg[idx]
            const en = t?.key_en ?? t?.key
            return typeof en === 'string' ? { ...item, key_en: en } : item
          })
        }
        return {
          ...state,
          intelluctalList: updatedList,
          patentSecondType: updatedPatentSecondType,
        }
      }
      break

    case actionTypes.SET_GLOBAL_SEARCH_KEYWORD:
      if (action.data !== undefined && action.data !== null) {
        return {
          ...state,
          searchKeyWord: action.data,
        }
      }

      break
    case actionTypes.SET_GLOBAL_SEARCH_TIMESTAMP:
      return {
        ...state,
        globalSearchTimeStamp: action.data,
      }
    // case actionTypes.SEARCH_HOT_OUTCOMPANY:
    // if (action.data.code === global.SUCCESS) {
    //     if (action.data.data && action.data.data.length > 0) {
    //         return {
    //             ...state,
    //             companyViewHot:action.data.data
    //         }

    //     }
    // }
    // break;
    case actionTypes.SEARCH_OUTCOMPANY:
      console.log(action)
      if (action.data.code) {
        if (action.data.data) {
          return {
            ...state,
            outCompanySearchList: state.outCompanySearchList
              ? action.data.pageNo > 0
                ? state.outCompanySearchList.concat(action.data.data.list)
                : action.data.data.list
              : action.data.data.list,
            outCompanySearchErrorCode: action.data.ErrorCode,
          }
        } else {
          return {
            ...state,
            outCompanySearchList: '',
            outCompanySearchErrorCode: action.data.ErrorCode,
          }
        }
      }
      break
    case actionTypes.VIEW_OUTCOMPANY:
      if (action.data.code === global.SUCCESS) {
        if (action.data.data && action.data.data.length > 0) {
          return {
            ...state,
            outCompanyView: action.data.data,
          }
        }
      }
      break
    // case actionTypes.VIEW_COMPANY:
    // if (action.data.code === global.SUCCESS) {
    //     if (action.data.data && action.data.data.length > 0) {

    //         return {
    //             ...state,
    //             companyView: action.data.data
    //         }

    //     }
    // }
    // break;
    default:
      return state
  }
  return state
}
export default reducer
