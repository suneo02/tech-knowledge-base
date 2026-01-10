import { ChatSenderRes } from '@/service'
import { AxiosInstance } from 'axios'
import { AgentIdentifiers, QueryReferencePayload } from 'gel-api'
import { ChatMsgInputOptions } from './message'

/**
 * @deprecated use `ChatMsgInputOptions` instead
 */
export interface ChatSenderOptions
  extends ChatMsgInputOptions,
    Pick<AgentIdentifiers, 'reAgentId'>,
    Pick<QueryReferencePayload['body'], 'fileIds' | 'refFileIds'> {}

export interface ChatSenderState {
  content: string
  loadingText: string
  isLoading: boolean
}

export interface ConversationSetupHookResult {
  content: string
  setContent: (content: string) => void
  sendAndInitializeConversation: ({
    chatId,
    message,
    options,
    isFirstQuestionRef,
    signal,
    onReciveQuestion,
    splVersion,
  }: {
    axiosInstance: AxiosInstance
    chatId: string | undefined
    message: string
    options: ChatSenderOptions
    isFirstQuestionRef: React.MutableRefObject<boolean>
    signal?: AbortSignal
    onReciveQuestion?: (question: string[]) => void
    splVersion?: number
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
export type ChatCreator = (
  message: string,
  signal?: AbortSignal,
  entityCode?: string
) => Promise<{ chatId?: string } | undefined>
