import * as actionTypes from './actionTypes'

export const addSearchHistory = (data) => {
  return {
    type: actionTypes.ADD_SEARCH_HISTORY,
    data,
  }
}

export const getSearchHistory = (data) => {
  return {
    type: actionTypes.GET_SEARCH_HISTORY,
    data,
  }
}

export const deleteAllSearchHistory = (data) => {
  return {
    type: actionTypes.DELETEALL_SEARCH_HISTORY,
    data,
  }
}

export const deleteOneSearchHistory = (data) => {
  return {
    type: actionTypes.DELETEONE_SEARCH_HISTORY,
    data,
  }
}

export const addVisitHistory = (data) => {
  return {
    type: actionTypes.ADD_VISIT_HISTORY,
    data,
  }
}

export const getVisitHistory = (data) => {
  return {
    type: actionTypes.GET_VISIT_HISTORY,
    data,
  }
}

export const deleteAllVisitHistory = (data) => {
  return {
    type: actionTypes.DELETEALL_VISIT_HISTORY,
    data,
  }
}

export const deleteOneVisitHistory = (data) => {
  return {
    type: actionTypes.DELETEONE_VISIT_HISTORY,
    data,
  }
}

export const rankingListSearchCorps = (data) => {
  return {
    type: actionTypes.RANKINGLIST_SEARCH_CROPS,
    data,
  }
}

export const rankingListSuggest = (data) => {
  return {
    type: actionTypes.RANKINGLIST_SUGGEST,
    data,
  }
}

export const inputSearch = (data) => {
  return {
    type: actionTypes.RANKINGLIST_INPUT_SEARCH,
    data,
  }
}

export const treeSearch = (data) => {
  return {
    type: actionTypes.RANKINGLIST_TREE_SEARCH,
    data,
  }
}

export const getRankingListType = (data) => {
  return {
    type: actionTypes.GET_RANKINGLIST_TYPE,
    data,
  }
}

export const rankingListStatistics = (data) => {
  return {
    type: actionTypes.RANKINGLIST_STATISTICS,
    data,
  }
}

// 清空名单详情页面数据
export const clearRankingListDetail = (data?) => {
  return {
    type: actionTypes.CLEAR_RANKINGLIST_DETAIL,
    data,
  }
}
