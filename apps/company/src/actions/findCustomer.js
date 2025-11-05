import * as actionTypes from './actionTypes'

export const getFilterItem = (data) => {
  return {
    type: actionTypes.GET_FILTER_ITEM,
    data,
  }
}

export const getIndicator = (data) => {
  return {
    type: actionTypes.GET_INDICATOR,
    data,
  }
}

export const speechSearch = (data) => {
  return {
    type: actionTypes.SPEECH_SEARCH,
    data,
  }
}

export const search = (data) => {
  return {
    type: actionTypes.SEARCH,
    data,
  }
}

export const measureSearch = (data) => {
  return {
    type: actionTypes.MEASURE_SEARCH,
    data,
  }
}

export const getMySusList = (data) => {
  return {
    type: actionTypes.GET_MYSUSLIST,
    data,
  }
}

export const getSeenList = (data) => {
  return {
    type: actionTypes.GET_SEENLIST,
    data,
  }
}

export const getFellowList = (data) => {
  return {
    type: actionTypes.GET_FELLOWLIST,
    data,
  }
}

export const queryUserIndustries = (data) => {
  return {
    type: actionTypes.QUERY_USER_INDUSTRIES,
    data,
  }
}
