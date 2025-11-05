import { AxiosInstance } from 'axios'
import {
  AgentIdentifiers,
  ChatReviewSignal,
  ChatThinkSignal,
  ChatTypeEnum,
  GelData,
  QueryReferenceResponse,
  RefTableData,
} from 'gel-api'

export const CHAT_CONSTANTS = {
  DEFAULT_ANALYSIS_PARAMS: {
    transLang: 'CMN',
  },
  LOADING_TEXT: {
    CREATE: '创建对话中',
    ANALYSIS: '意图识别中',
    RETRIEVAL: '数据召回中',
  },
} as const

export interface ChatSenderState {
  content: string
  loadingText: string
  isLoading: boolean
}

export type ChatSenderRes = QueryReferenceResponse & {
  chatId: string
  gelData: GelData[]
  refTable: RefTableData[] | undefined
  chartType: ChatTypeEnum | undefined
}

export type EntityOptions = {
  entityType?: string
  entityName?: string
}

export type ChatSenderOptions = AgentIdentifiers & ChatThinkSignal & ChatReviewSignal & EntityOptions

export interface ChatSenderHookResult {
  content: string
  setContent: (content: string) => void
  sendAndInitializeConversation: ({
    chatId,
    message,
    options,
    isFirstQuestionRef,
    signal,
    onReciveQuestion,
  }: {
    axiosInstance: AxiosInstance
    chatId: string | undefined
    message: string
    options: ChatSenderOptions
    isFirstQuestionRef: React.MutableRefObject<boolean>
    signal?: AbortSignal
    onReciveQuestion?: (question: string[]) => void
  }) => Promise<ChatSenderRes | undefined>
  onReciveQuestion?: (question: string[]) => void
  loadingText: string
}
export interface ChatSenderHookResultForStream {
  content: string
  setContent: (content: string) => void
  sendAndInitializeConversation: ({
    chatId,
    message,
    options,
    signal,
    onReciveQuestion,
  }: {
    chatId: string | undefined
    message: string
    options: ChatSenderOptions
    signal?: AbortSignal
    onReciveQuestion?: (question: string[]) => void
  }) => Promise<ChatSenderRes | undefined>
  onReciveQuestion?: (question: string[]) => void
  loadingText: string
}

// 通用的聊天创建函数类型
export type ChatCreator = (message: string, signal?: AbortSignal, entityCode?: string) => Promise<{ chatId?: string }>
