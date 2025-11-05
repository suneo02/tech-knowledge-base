// 新版图谱平台api

import { getWsid } from '@/utils/env'
import axios from '../index'
import { wftCommon } from '@/utils/utils'
import { isTestSite } from '@/utils/env'

// 接口传参图谱类型
export enum WIND_BDG_GRAPH_TYPE {
  EquityPenetrationChart = 'equity-penetration-chart', // 股权穿透图
  InvestmentChart = 'investment-chart', // 对外投资图
  ActualControllerChart = 'actual-controller-chart', // 实控人图谱
  BeneficiaryChart = 'beneficiary-chart', // 受益人图谱
  EnterpriseChart = 'enterprise-chart', // 企业图谱
  RelatedPartyChart = 'related-party-chart', // 关联方图谱
  SuspectedRelationChart = 'suspected-relation-chart', // 疑似关系图谱
  RelationQueryChart = 'relation-query-chart', // 查关系
  MultiToOneChart = 'multi-to-one-chart', // 多对一触达
}

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

  if (isTestEnvironment) {
    return 'https://test.wind.com.cn/rimedata/backend'
  }
  if (usedInClient) {
    return '/rime/backend'
  }
  return 'https://wx.wind.com.cn/rime/backend'
}

export const getWindBDGraphData = async (params: GetWindBDGraphDataParams) => {
  const { type, mainEntity, subEntity, filter, ...extraParams } = params
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/graph_api/wind-graph`

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
  const url = `${baseUrl}/graph_api/expand-nodes`

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
