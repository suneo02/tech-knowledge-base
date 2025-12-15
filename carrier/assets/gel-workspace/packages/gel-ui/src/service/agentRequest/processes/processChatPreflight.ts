/**
 * 基于新架构的非流式消息处理函数
 *
 * 基于优化指南中的函数式流程设计，整合现有的 process 函数
 * 提供统一的 ChatRunContext 上下文管理和事件通知机制
 */

import { isAbortError } from '@/constants'
import type { ChatSendInput } from '@/types/ai-chat-perf'
import { checkAbortSignal } from '../helper'
import { ChatRunContext } from '../runContext'
import { processAnalysis } from './processAnalysis'
import { processDataRetrieval } from './processDataRetrieval'
import { processQuestionDecomposition } from './processQuestionDecomposition'

/**
 * 对话预检查流程配置
 */
export interface ChatPreflightConfig {
  /** 是否启用数据召回 - 可选流程，失败不影响主流程 */
  enableDataRetrieval?: boolean
}

/**
 * 对话预检查流程处理函数
 *
 * 在正式的流式对话开始前执行的预处理流程，包括：
 * 1. 执行意图分析 (processAnalysis) - 必需流程
 * 2. 执行数据召回 (processDataRetrieval) - 可选流程，失败不影响主流程
 * 3. 执行问句拆解 (processQuestionDecomposition) - 必需流程
 * 4. 返回统一的 ChatSenderRes 结果
 *
 * @template TInput - 输入类型，默认为 ChatSendInput
 * @template TChunk - 模型分片类型，默认为 ModelChunk
 * @param context - 运行上下文，包含所有必要的配置和状态
 * @param callbacks - 回调函数，用于处理各个阶段的事件
 * @param config - 可选配置，控制数据召回流程的启用状态
 */
export async function processChatPreflight<TInput extends ChatSendInput = ChatSendInput>(
  context: ChatRunContext<TInput>,
  config: ChatPreflightConfig = {}
): Promise<void> {
  const { enableDataRetrieval = true } = config

  // 流程开始前检查中止信号
  checkAbortSignal(context)

  try {
    // 第一阶段：意图分析处理 - 必需流程
    await processAnalysis(context)

    // 阶段间检查中止信号
    checkAbortSignal(context)

    // 第二阶段：数据召回处理 - 可选流程，失败不影响主流程
    if (enableDataRetrieval && context.runtime.rawSentenceID) {
      try {
        await processDataRetrieval(context)
      } catch (error) {
        // 如果是中止错误，需要向上传播
        if (isAbortError(error)) {
          throw error
        }
        // 其他数据召回失败不影响主流程
      }
    }

    // 阶段间检查中止信号
    checkAbortSignal(context)

    // 第三阶段：问句拆解处理 - 必需流程
    if (context.runtime.rawSentenceID) {
      await processQuestionDecomposition(context)
    }
  } catch (error) {
    // 发出错误事件通知
    context.eventBus?.emit('error', { error: error as Error, phase: 'processChatPreflight' })

    // 直接抛出错误（子流程已经处理了中止逻辑）
    throw error
  }
}
