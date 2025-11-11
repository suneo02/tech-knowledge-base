// 新版图谱平台api

import { getWsid } from '@/utils/env'
import axios from '../index'
import { wftCommon } from '@/utils/utils'
import { isTestSite } from '@/utils/env'
import { WIND_BDG_GRAPH_TYPE } from '@/views/Charts/types'

interface Entity {
  entityId: string
  entityType: 'company' | 'person'
}

interface GetWindBDGraphDataParams {
  type: WIND_BDG_GRAPH_TYPE
  mainEntity: Entity[]
  subEntity?: Entity
  filter?: any
  [key: string]: any
}

export const getBaseUrl = () => {
  const host = window.location.host
  const isTestEnvironment = isTestSite()
  const usedInClient = wftCommon.usedInClient()

  if (!isTestEnvironment && !usedInClient) {
    return 'https://wx.wind.com.cn//EnterpriseGraph/v1' // web端主站
    // return 'http://10.220.33.21:23903/v1/graph' // 开发站
  }
  return '/EnterpriseGraph/v1'
}

export const getWindBDGraphData = async (params: GetWindBDGraphDataParams) => {
  const { type, mainEntity, subEntity, filter, ...extraParams } = params
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/wind-graph`

  const requestData = {
    graphType: type,
    mainEntity,
    subEntity,
    filter,
    ...extraParams,
  }

  return makeGraphRequest(url, requestData)
}

export const getWindBDGraphChildData = async (data: any) => {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/expand-nodes`

  return makeGraphRequest(url, data)
}

const makeGraphRequest = (url: string, data: any) => {
  const sessionid = getWsid()

  return axios.request({
    url,
    method: 'post',
    data,
    formType: 'payload',
    headers: sessionid ? { sessionid } : {},
  })
}
