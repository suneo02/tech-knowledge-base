import * as actionTypes from './actionTypes'
import type {
  GetMySusListAction,
  GetSeenListAction,
  GetFellowListAction,
  QueryUserIndustriesAction,
} from '../reducers/findCustomer.types'

export const getFilterItem = (data: any) => {
  return {
    type: actionTypes.GET_FILTER_ITEM,
    data,
  } as const
}

export const getIndicator = (data: any) => {
  return {
    type: actionTypes.GET_INDICATOR,
    data,
  } as const
}

export const speechSearch = (data: any) => {
  return {
    type: actionTypes.SPEECH_SEARCH,
    data,
  } as const
}

export const search = (data: any) => {
  return {
    type: actionTypes.SEARCH,
    data,
  } as const
}

export const measureSearch = (data: any) => {
  return {
    type: actionTypes.MEASURE_SEARCH,
    data,
  } as const
}

export const getMySusList = (data: GetMySusListAction['data']): GetMySusListAction => {
  return {
    type: actionTypes.GET_MYSUSLIST,
    data,
  } as const
}

export const getSeenList = (data: GetSeenListAction['data']): GetSeenListAction => {
  return {
    type: actionTypes.GET_SEENLIST,
    data,
  } as const
}

export const getFellowList = (data: GetFellowListAction['data']): GetFellowListAction => {
  return {
    type: actionTypes.GET_FELLOWLIST,
    data,
  } as const
}

export const queryUserIndustries = (data: QueryUserIndustriesAction['data']): QueryUserIndustriesAction => {
  return {
    type: actionTypes.QUERY_USER_INDUSTRIES,
    data,
  } as const
}
