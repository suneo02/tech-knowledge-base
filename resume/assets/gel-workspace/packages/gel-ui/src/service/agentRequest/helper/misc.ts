import { ChatSendInput } from '@/types'
import { ChatQuestionStatus } from 'gel-api'
import { ChatRunContext } from '../runContext'
import { CreateHandleError, createHandleErrorFromContext } from './createHandleError'

/**
 * 检查并处理中止信号
 *
 * 这是一个统一的中止检查函数，如果检测到中止信号，会抛出标准化的中止错误
 *
 * @param context 聊天运行上下文
 * @throws {CreateHandleError} 当检测到中止信号时抛出标准化的中止错误
 *
 * @example
 * ```typescript
 * // 在流程开始前检查
 * checkAbortSignal(context)
 *
 * // 在长时间操作前检查
 * await someAsyncOperation()
 * checkAbortSignal(context)
 * ```
 */
export const checkAbortSignal = <TInput extends ChatSendInput = ChatSendInput>(
  context: ChatRunContext<TInput>
): void => {
  if (context.abortController?.signal?.aborted) {
    throw createHandleErrorFromContext(context, ChatQuestionStatus.CANCELLED)
  }
}
