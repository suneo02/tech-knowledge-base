/**
 * 超时管理模块
 *
 * 职责：纯超时定时器管理，不包含业务逻辑
 * 遵循 TypeScript 规范：单函数 ≤ 50 行、参数 ≤ 5 个、职责单一
 */

import { ChatQuestionStatus } from 'gel-api'
import { ChatRunContext } from '../runContext'
import { StreamDependencies } from './types'

// 超时时间设置为10秒
const STREAM_TIMEOUT = 10000

/**
 * 重置超时定时器
 * @param context - 聊天运行上下文
 * @param timeout - 超时时间（毫秒），默认10秒
 * @param onTimeout - 超时回调函数
 */
export function resetTimeout(context: ChatRunContext, timeout: number = STREAM_TIMEOUT, onTimeout: () => void): void {
  // 使用类方法设置超时
  const timeoutId = setTimeout(() => {
    onTimeout()
  }, timeout)

  context.setTimeoutRef(timeoutId)
}

/**
 * 清除超时定时器
 * @param context - 聊天运行上下文
 */
export function clearTimeoutTimer(context: ChatRunContext): void {
  // 使用类方法清除超时
  context.clearTimeout()
}

/**
 * 处理流式请求中止
 * @param context - 聊天运行上下文
 * @param dependencies - 流式处理依赖
 * @param onStreamFinish - 流式完成处理函数
 */
export function handleStreamAbort(
  context: ChatRunContext,
  dependencies: StreamDependencies,
  onStreamFinish: (
    context: ChatRunContext,
    dependencies: StreamDependencies,
    params: { questionStatus: ChatQuestionStatus }
  ) => Promise<void>
): void {
  onStreamFinish(context, dependencies, { questionStatus: ChatQuestionStatus.FAILED })
}
