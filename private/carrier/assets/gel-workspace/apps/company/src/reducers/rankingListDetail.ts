import * as actionTypes from '../actions/actionTypes'
import global from '../lib/global'

const initialState = {
  rankingListInfo: {},
  cropList: [],
  cropListPagination: {
    pageNum: 1,
    pageSize: 10,
    total: 0,
  },
  cropListByArea: [],
  cropListByAreaTotal: 0,
  cropListByIndustry: [],
  cropListByIndustryTotal: 0,
  cropListByIPO: [],
  cropListByIPOTotal: 0,
  cropListByType: [],
  cropListByTypeTotal: 0,
  cropListByCapital: [],
  cropListByCapitalTotal: 0,
  cropListByPeople: [],
  cropListByPeopleTotal: 0,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RANKINGLIST_SEARCH_CROPS:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        const { corpResponsePageInfo, directoryDto } = action.data.data
        return {
          ...state,
          rankingListInfo: directoryDto,
          cropList: corpResponsePageInfo?.list || [],
          cropListPagination: {
            pageNum: corpResponsePageInfo?.pageNum,
            pageSize: corpResponsePageInfo?.pageSize,
            total: corpResponsePageInfo?.total,
          },
        }
      }
      break
    case actionTypes.RANKINGLIST_STATISTICS:
      // console.log(action)
      if (action.data.code === global.SUCCESS) {
        const { type } = action.data
        const { rangeRes, staticRes, total } = action.data.data
        if (type === 0) {
          return {
            ...state,
            cropListByArea: staticRes || [],
            cropListByAreaTotal: total || 0,
          }
        }
        if (type === 1) {
          return {
            ...state,
            cropListByIndustry: staticRes || [],
            cropListByIndustryTotal: total || 0,
          }
        }
        if (type === 2) {
          return {
            ...state,
            cropListByIPO: staticRes || [],
            cropListByIPOTotal: total || 0,
          }
        }
        if (type === 3) {
          return {
            ...state,
            cropListByType: staticRes || [],
            cropListByTypeTotal: total || 0,
          }
        }
        if (type === 4) {
          return {
            ...state,
            cropListByCapital: rangeRes || [],
            cropListByCapitalTotal: total || 0,
          }
        }
        if (type === 5) {
          return {
            ...state,
            cropListByPeople: rangeRes || [],
            cropListByPeopleTotal: total || 0,
          }
        }
      }
      break
    case actionTypes.CLEAR_RANKINGLIST_DETAIL:
      return initialState
    default:
      return state
  }
  return state
}
export default reducer
