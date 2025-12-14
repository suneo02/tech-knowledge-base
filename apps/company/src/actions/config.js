import * as actionTypes from './actionTypes'

export const getFilterItem = (data) => {
  // 获取企业数据浏览器全部筛选配置
  return {
    type: actionTypes.GET_FILTER_ITEM,
    data,
  }
}

export const getRegions = (data) => {
  return {
    type: actionTypes.GET_REGIONS,
    data,
  }
}

export const getIndustries = (data) => {
  return {
    type: actionTypes.GET_INDUSTRIES,
    data,
  }
}
