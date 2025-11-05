// 新版图谱平台api

import { getWsid } from '@/utils/env'
import axios from '../index'
import { wftCommon } from '@/utils/utils'
import { postStreamRequest } from './stream'

export const getBaseUrl = () => {
  const host = window.location.host
  const isTestEnvironment = host.indexOf('8.173') > -1 || host.indexOf('test.wind.') > -1
  const usedInClient = wftCommon.usedInClient()

  if (isTestEnvironment) {
    return 'https://test.wind.com.cn/rimedata/backend'
  }
  if (usedInClient) {
    return '/rime/backend'
  }
  // return 'https://wx.wind.com.cn/rime/backend'
  return 'http://10.220.33.21:23903/v1'
}

export const createAiGraphChat = (params) => {
  const { chatId, userId } = params
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/graph/create-chat`

  const requestData = {
    chatId,
    userId,
  }
  return makeGraphRequest(url, requestData)
}

export const postAiGraphMessage = async (params) => {
  const { chatId, userId, content, graphType, processEventCb, abortSignal } = params
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/graph/chat`

  const requestData = {
    chatId,
    userId,
    content,
    graphType,
  }
  postStreamRequest(url, requestData, processEventCb, abortSignal)
}

// 获取历史对话列表
export const getAiGraphChatHistory = (userId) => {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/graph/chat-list?userId=${userId}`
  return axios.request({
    url,
    method: 'get',
  })
}

// 获取历史对话列表
export const getAiGraphHistoryMessage = (historyChatId) => {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/graph/chat-messages?chatId=${historyChatId}&page=0&pageSize=100`
  return axios.request({
    url,
    method: 'get',
  })
}

// 获取某次chat最后一次生成的图数据
export const getAiGraphHistoryGraph = (historyChatId) => {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/graph/info`
  const requestData = {
    chatId: historyChatId,
  }
  return makeGraphRequest(url, requestData)
}

const makeGraphRequest = (url: string, data: any, headers = {}) => {
  const sessionid = getWsid()

  return axios.request({
    url,
    method: 'post',
    data,
    formType: 'payload',
    headers: { sessionid, ...headers },
  })
}
