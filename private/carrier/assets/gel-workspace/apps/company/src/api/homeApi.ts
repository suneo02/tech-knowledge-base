import { ApiResponseForWFC } from 'gel-api/*'
import { UserPackageInfo } from 'gel-types'
import axios from './index'

// 查询热门企业-推荐关注
export const getHotcorp = (lastIndex = -1) => {
  return axios.request({
    url: '/api/search/suggest/hotEnt/list',
    method: 'post',
    data: {
      lastIndex,
      pageSize: 6,
    },
  })
}

// 查询企业动态
export const getCorpevent = (data) => {
  return axios.request({
    url: '/api/search/corpnews/list',
    method: 'post',
    data: { ...data, type: 'collect' },
  })
}

// 查询企业新闻-最新资讯
export const getCorpnews = (data) => {
  return axios.request({
    url: '/api/search/corpnews/list',
    method: 'post',
    data: { ...data, type: 'hot' },
  })
}

export const getUserPackageInfo = (
  data?
): Promise<
  ApiResponseForWFC<UserPackageInfo> & {
    data?: UserPackageInfo
  }
> => {
  return axios.request({
    cmd: 'getuserpackageinfo',
    method: 'post',
    data,
  })
}

export const getPreCorpSearchNew = (data) => {
  return axios.request({
    cmd: '/search/company/presearch',
    method: 'post',
    data: { ...data },
  })
}

export const getPreCompanySearch = (data) => {
  return axios.request({
    cmd: '/search/company/getGlobalCompanyPreSearch',
    method: 'post',
    data: {
      version: 1,
      ...data,
    },
  })
}

export const getPreGroupSearch = (data) => {
  if (data?.key) {
    data.queryText = data.key
  }
  return axios.request({
    cmd: 'search/group/getgroupsystempresearch',
    method: 'post',
    data: { ...data },
  })
}

export const createPayOrder = (data) => {
  return axios.request({
    cmd: 'createpayorder2',
    method: 'post',
    data: { ...data },
  })
}

export const createPayOrderByClient = (data) => {
  return axios.request({
    cmd: '/operation/insert/createPayOrder',
    method: 'post',
    data: { ...data },
  })
}

export const getPayOrderInfo = (data) => {
  return axios.request({
    cmd: 'getpayorderinfo2',
    method: 'post',
    data: { ...data },
  })
}

export const createCrmOrder = (data) => {
  return axios.request({
    cmd: 'purchaseintention',
    method: 'post',
    data: { ...data },
  })
}

export const getPayOrderByClient = (data) => {
  return axios.request({
    cmd: '/operation/get/getOrderPayStatus',
    method: 'post',
    data: { ...data },
  })
}

export const getUserAgreements = (data) => {
  return axios.request({
    cmd: 'getuseragreement',
    method: 'post',
    data: { ...data },
  })
}

// 申请试用
export const applytrailsvip = (data) => {
  return axios.request({
    cmd: '/operation/get/applyTrailSVIP',
    method: 'post',
    data: { ...data },
  })
}

export const setUserAgreements = (data?) => {
  return axios.request({
    cmd: 'setuseragreement',
    method: 'post',
    data: data,
  })
}

export const getPayGoods = (data?) => {
  return axios.request({
    cmd: '/operation/get/listPayGoods',
    method: 'post',
    data: { ...(data || {}), type: 'ENTERPRISE' },
  })
}
