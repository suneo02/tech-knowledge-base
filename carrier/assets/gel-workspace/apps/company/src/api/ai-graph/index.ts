// 新版图谱平台api

import { getWsid } from '@/utils/env'
import axios from '../index'
import { wftCommon } from '@/utils/utils'
import { postStreamRequest } from './stream'

export const getBaseUrl = () => {
  const host = window.location.host
  const isTestEnvironment = host.indexOf('8.173') > -1 || host.indexOf('test.wind.') > -1
  const usedInClient = wftCommon.usedInClient()

  if (!isTestEnvironment && !usedInClient) {
    return 'http://114.80.213.47/EnterpriseGraph/v1' // 体验站
    // return 'https://exp.wind.com.cn/EnterpriseGraph/v1'

    // return 'https://180.96.8.44/rime/backend/graph_api'
    // return 'https://test.wind.com.cn/EnterpriseGraph/v1'
    // return 'https://wx.wind.com.cn/EnterpriseGraph/v1' // web端主站
    // return 'http://10.220.33.21:23903/EnterpriseGraph/v1' // 开发站
  }
  return '/EnterpriseGraph/v1'
}

export const createAiGraphChat = () => {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/create-chat`

  return makeGraphRequest(url, {})
}

export const postAiGraphMessage = async (params) => {
  const { chatId, content, version, abortSignal, requestId, taskId, attachmentText } = params
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/chat`

  const requestData = {
    chatId,
    content,
    version,
    requestId,
    taskId,
    attachmentText, // 附件文本，用于记录附件信息
  }
  // 网关1min请求会超时，前端难以准确拿到超时状态，此处前端控制最大请求时间
  return makeGraphRequest(url, requestData, { signal: abortSignal, timeout: 58000 })
}

// 取消对话,告知后端不用再生成，同时不记录到历史记录中
export const cancelAiGraphChat = async () => {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/cancel-chat`

  return makeGraphRequest(url, {})
}

// 获取历史对话列表
export const getAiGraphChatHistory = (pageNo: number, pageSize = 10) => {
  const sessionid = getWsid()

  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/chat-list?pageNo=${pageNo}&pageSize=${pageSize}`
  return axios.request({
    url,
    method: 'get',
    headers: { sessionid },
  })
}

// 获取某一次对话标题信息
export const getAiGraphChatInfo = (chatId: string) => {
  const sessionid = getWsid()

  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/chat-info?chatId=${chatId}`
  return axios.request({
    url,
    method: 'get',
    headers: { sessionid },
  })
}

// 回复响应超时，重新接口轮询数据状态
export const getAiGraphChatResponse = (chatId: string, requestId: string) => {
  const sessionid = getWsid()

  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/chat-response?chatId=${chatId}&requestId=${requestId}`
  return axios.request({
    url,
    method: 'get',
    headers: { sessionid },
  })
}

// 获取历史对话列表
export const getAiGraphHistoryMessage = (historyChatId) => {
  const sessionid = getWsid()
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/chat-messages?chatId=${historyChatId}`
  return axios.request({
    url,
    method: 'get',
    headers: { sessionid },
  })
}

// 获取某次chat最后一次生成的图数据
export const getAiGraphHistoryGraph = (historyChatId: string, version: number) => {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/info`
  const requestData = {
    chatId: historyChatId,
    version,
  }
  return makeGraphRequest(url, requestData)
}

interface SaveModifiedGraphParams {
  chatId: string
  version: number
  question: string
  config?: any
  relations?: any[]
  list?: any[]
  abortSignal?: any
}

// 数据表格保存
export const saveModifiedGraph = (params: SaveModifiedGraphParams) => {
  const { chatId, version, question, config, relations, list, abortSignal } = params
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/modify-graph`
  const requestData = {
    chatId,
    version,
    question,
    config,
    relations,
    list,
  }
  return makeGraphRequest(url, requestData, { signal: abortSignal })
}
interface GiveLikeOrDislikeParams {
  answer: string
  appraise: string
  detailedFeedback: string
  feedbackType: string
  question: string
}

// 对回答的问题点赞、点踩
export const giveLikeOrDislike = (params: GiveLikeOrDislikeParams) => {
  const { answer, appraise, detailedFeedback, feedbackType, question } = params
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/feedback`
  const requestData = {
    answer,
    appraise,
    detailedFeedback,
    feedbackType,
    question,
  }
  return makeGraphRequest(url, requestData)
}

// 对话埋点
export const postAiGraphChatPoint = (contentType: string, content: string) => {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/question_record`
  const requestData = {
    contentType,
    content,
  }
  return makeGraphRequest(url, requestData)
}

export const editAiGraphChatTitle = (chatId: string, title: string) => {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/update-title`
  const requestData = {
    chatId,
    title,
  }
  return makeGraphRequest(url, requestData)
}

export const deleteAiGraphChat = (chatId: string) => {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/delete-chat`
  const requestData = {
    chatId,
  }
  return makeGraphRequest(url, requestData)
}

// 上传Excel生成图谱
export const uploadExcelGraph = (params: any) => {
  const { file, version, chatId } = params
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/upload-excel`
  const requestData = {
    chatId,
    file,
    baseVersion: version || 0,
  }
  return makeGraphRequest(url, requestData)
}

// 上传Markdown生成图谱
export const markdownGraph = (params: any) => {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/markdown-to-graph`
  const { content } = params
  const requestData = {
    content,
  }
  return makeGraphRequest(url, requestData)
}

export const aiGraphSummary = (params: any) => {
  const { chatId, baseVersion } = params
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/graph-summary`
  const requestData = {
    chatId,
    baseVersion: baseVersion || 0,
  }
  return makeGraphRequest(url, requestData)
}

const makeGraphRequest = (url: string, data: any, params = {}, method = 'post') => {
  const sessionid = getWsid()

  return axios.request({
    url,
    method,
    data,
    formType: 'payload',
    headers: { sessionid },
    ...params,
  })
}

// 上传图谱缩略图
export const uploadAiGraphThumbnail = (params: any) => {
  const { chatId, thumbnail, version } = params
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/upload-thumbnail`
  const requestData = {
    chatId,
    imageData: thumbnail,
    baseVersion: version || 0,
  }
  return makeGraphRequest(url, requestData)
}

// 下载图谱缩略图
export const getAiGraphThumbnail = (params: any) => {
  const { resourceId, resourceName } = params
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/download?resourceId=${resourceId}`
  return makeGraphRequest(url, {}, {}, 'get')
}

// 图谱平台生成探查Agent
export const exploreAiGraphAgent = (params: any) => {
  const { entityId, entityType, question } = params
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/explore-relation`
  const requestData = {
    companyId: entityId,
    entityType,
    question,
  }
  return makeGraphRequest(url, requestData)
}
