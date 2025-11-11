import type { ChatSendInput } from '@/types/ai-chat-perf'
import {
  ChatChatIdIdentifier,
  ChatQuestionStatus,
  ChatRawSentenceIdentifier,
  ChatRawSentenceIdIdentifier,
} from 'gel-api'
import type { ChatRunContext } from '../runContext'

export type CreateHandleError = {
  result: {
    chatId: string
    rawSentenceID: string | undefined
    rawSentence: string
  }
  errorCode?: ChatQuestionStatus
}

/**
 * 创建标准化的业务错误对象
 *
 * @param params 错误参数
 * @returns 标准化的错误对象
 */
export const createHandleError = ({
  chatId,
  rawSentenceID,
  rawSentence,
  errorCode,
}: {
  errorCode?: ChatQuestionStatus
} & ChatChatIdIdentifier &
  Partial<ChatRawSentenceIdIdentifier> &
  ChatRawSentenceIdentifier): CreateHandleError => {
  return {
    result: {
      chatId,
      rawSentenceID,
      rawSentence,
    },
    errorCode: errorCode,
  }
}

/**
 * 基于 ChatRunContext 创建标准化的业务错误对象
 *
 * 这是一个便捷函数，自动从 context 中提取必要的信息来创建错误
 *
 * @param context 聊天运行上下文，包含所有必要的状态信息
 * @param questionStatus 问题状态码，表示错误类型
 * @returns 标准化的错误对象
 *
 * @example
 * ```typescript
 * // 用户中止
 * throw createHandleErrorFromContext(context, ChatQuestionStatus.CANCELLED)
 *
 * // 分析失败
 * throw createHandleErrorFromContext(context, ChatQuestionStatus.FAILED)
 *
 * // 意图审计不通过
 * throw createHandleErrorFromContext(context, ChatQuestionStatus.AUDIT_FAILED)
 * ```
 */
export const createHandleErrorFromContext = <TInput extends ChatSendInput = ChatSendInput>(
  context: ChatRunContext<TInput>,
  questionStatus: ChatQuestionStatus
): CreateHandleError => {
  return createHandleError({
    chatId: context.runtime.chatId,
    rawSentenceID: context.runtime.rawSentenceID,
    rawSentence: context.input.content,
    errorCode: questionStatus,
  })
}
