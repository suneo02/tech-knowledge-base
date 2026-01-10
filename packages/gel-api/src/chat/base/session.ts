// 实体识别请求参数
import { PaginationParams } from '@/types'
import {
  AgentIdentifiers,
  ChatClientTypeIdentifier,
  ChatDPUResponse,
  ChatGroupIdIdentifier,
  ChatRAGResponse,
  ChatRawSentenceIdIdentifier,
  EModelType,
  GelData,
  ReportChatData,
  SplTable,
} from '../types'
import { ChatEntityRecognize } from '../types/entity'
import { ChatTraceItem } from './trace'

export type SessionCompleteRequest = AgentIdentifiers & ChatRawSentenceIdIdentifier

// 历史会话请求参数
export interface AIChatHistoryRequest extends PaginationParams, ChatClientTypeIdentifier {
  collectFlag?: boolean // 是否收藏
  queryText?: string // 查询文本
  queryFlag?: boolean // 是否查询
}

export interface AIChatHistory extends ChatGroupIdIdentifier {
  /**
   * 会话问句数量
   */
  questionsNum: number
  /**
   * 会话内容
   */
  questions?: string
  /**
   * 会话更新时间
   */
  updateTime?: string

  id: string
  userId: string

  // 搜索相关
  index: number // 该页所在索引位置

  // 收藏相关
  isDelete: boolean // 是否删除
  collectTime: string // 收藏时间 收藏专用
  answers: string // 回答 收藏专用
  title: string // 标题 收藏专用

  /**
   * 会话相关联的实体
   */
  entities?: {
    entityCode?: string
    entityType?: 'report'
  }[]
}

/** 问答状态枚举 */
export enum ChatQuestionStatus {
  /** 默认状态 */
  DEFAULT = '-2',
  /** 手动取消 */
  CANCELLED = '-1',
  /** 失败 */
  FAILED = '0',
  /** 回答正确 */
  SUCCESS = '1',
  /** 意图审计不通过 */
  AUDIT_FAILED = '70001',
}

// 会话还原请求参数
export interface ChatRestoreRequest extends PaginationParams, ChatGroupIdIdentifier {
  entityCode?: string
}

export type ChatDetailTurn = ChatGroupIdIdentifier &
  Pick<AIChatHistory, 'questions' | 'updateTime'> & {
    questionsID: string
    data: {
      message: string
      result: {
        content?: ChatDPUResponse
        suggest?: ChatRAGResponse
        splTable?: SplTable[]
      }
      gelData?: GelData[]
    }
    reportData?: ReportChatData
    traceContent?: ChatTraceItem[]
    think?: string
    createTime: string
    answers: string
    entity?: ChatEntityRecognize[]
    questionStatus?: ChatQuestionStatus // 问题状态码
    modelType?: EModelType // 回答使用模型
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
export interface UpdateChatGroupRequest extends ChatGroupIdIdentifier {
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
  source?: 'SuperAI' | 'SuperChat' | 'AIChat' // 问题来源
}
