// 实体识别请求参数
import { AgentIdentifiers } from '../types'
import { GelData } from './gelData'
import { QueryReferenceResponse } from './QueryReference'

export type SessionCompleteRequest = {
  rawSentenceID: string
} & AgentIdentifiers

// 实体信息
export interface SessionCompleteResponse {
  key: string
  name: string
  code: string
  type: 'company' // 可以根据实际需要扩展类型
}

export interface ChatTraceRequest {
  rawSentenceID: string
}
export interface ChatTraceResponse {
  traced: {
    start: number
    end: number
    index: number
  }[]
  value: string
}

// 历史会话请求参数
export interface ChatHistoryRequest {
  pageSize: number
  pageIndex: number
  collectFlag?: boolean
}

export interface ChatHistoryResponse {
  /**
   * 会话问句数量
   */
  questionsNum: number
  /**
   * 会话 id
   */
  groupId: string
  /**
   * 会话内容
   */
  questions: string
  /**
   * 会话更新时间
   */
  updateTime: string

  id: number
  userId: string

  // 收藏相关
  isDelete: boolean // 是否删除
  collectTime: string // 收藏时间 收藏专用
  answers: string // 回答 收藏专用
  title: string // 标题 收藏专用
}

// 会话还原请求参数
export interface ChatRestoreRequest {
  pageSize?: number
  pageIndex?: number
  groupId: string
  entityCode?: string
}

export type ChatRestoreResponse = Pick<ChatHistoryResponse, 'groupId' | 'questions' | 'updateTime'> & {
  questionsID: string
  data: {
    message: string
    result: Pick<QueryReferenceResponse, 'content' | 'suggest'>
    gelData?: GelData[]
  }
  traceContent?: ChatTraceResponse[]
  think?: string
  createTime: string
  answers: string
  entity?: SessionCompleteResponse[]
  questionStatus?: string // 问题状态码
}

// 删除会话请求参数
export interface DeleteChatGroupRequest {
  groupIds: string[]
}

export interface DeleteChatGroupResponse {
  Data: {
    total: number
    code: number
    data: number
  }
}

// 更新会话请求参数
export interface UpdateChatGroupRequest {
  groupId: string
  title: string
}

// 更新会话响应参数
export interface UpdateChatGroupResponse {
  code: number
}

export interface CreateRecordStampRequest {
  questionsID: string
  problem?: string
  problemType?: string
}
