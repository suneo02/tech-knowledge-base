/**
 * 聊天记录保存处理函数
 *
 * 基于 ChatRunContext 的聊天记录保存逻辑，替代原有的 saveChatItem 函数
 * 主要功能：
 * 1. 从 ChatRunContext 中提取必要的聊天信息
 * 2. 调用后端 API 保存聊天记录
 * 3. 处理保存结果和错误
 * 4. 通过回调通知保存状态
 *
 * @template TInput - 输入类型，默认为 ChatSendInput
 * @template TChunk - 模型分片类型，默认为 ModelChunk
 */

import type { ChatSendInput } from '@/types/ai-chat-perf'
import { ChatQuestionStatus, requestToChatWithAxios } from 'gel-api'
import { ChatRunContext } from '../runContext'
/**
 * 聊天保存配置
 */
export interface ChatSaveConfig {
  /** 问答状态 */
  questionStatus?: ChatQuestionStatus
  /** 自定义原始句子（如果不提供，将从 context 中获取） */
  customRawSentence?: string
}

/**
 * 聊天保存结果
 */
export interface ChatSaveResult {
  /** 保存是否成功 */
  success: boolean
  /** 聊天ID */
  chatId: string
  /** 原始句子ID */
  rawSentenceID?: string
  /** 错误信息（如果保存失败） */
  error?: Error
}

/**
 * 聊天记录保存处理函数
 *
 * 从 ChatRunContext 中提取聊天信息并保存到后端
 *
 * @template TInput - 输入类型，默认为 ChatSendInput
 * @template TChunk - 模型分片类型，默认为 ModelChunk
 * @param context - 运行上下文，包含所有必要的配置和状态
 * @param config - 聊天保存配置
 * @param callbacks - 回调函数，用于处理各个阶段的事件
 */
export async function processChatSave<TInput extends ChatSendInput = ChatSendInput>(
  context: ChatRunContext<TInput>,
  config: ChatSaveConfig = {}
): Promise<ChatSaveResult> {
  const { staticCfg, input, runtime } = context
  const { axiosInstance } = staticCfg
  const { chatId, rawSentenceID } = runtime
  const isFirstQuestion = context.isFirstQuestion
  const { questionStatus, customRawSentence } = config

  if (!chatId) {
    const error = new Error('chatId is required for chat save')

    // 事件：保存错误
    context.eventBus?.emit('chatSave:error', {
      error,
      input: context.input,
      runtime: context.runtime,
    })

    return {
      success: false,
      chatId: '',
      error,
    }
  }

  // rawSentenceID 是可选的，但如果没有则记录警告
  if (!rawSentenceID) {
    // rawSentenceID is missing, this may affect chat tracking
  }

  try {
    // 事件：保存开始
    context.eventBus?.emit('chatSave:start', {
      chatId,
      rawSentenceID,
      questionStatus,
      input: context.input,
      runtime: context.runtime,
    })

    // Saving chat item

    // 调用后端 API 保存聊天记录
    const saveResponse = await requestToChatWithAxios(axiosInstance, 'chat/addChatItem', {
      chatId,
      rawSentence: customRawSentence || input.content,
      rawSentenceID: rawSentenceID || '', // 如果没有 rawSentenceID，使用空字符串
      agentId: input.agentId,
      questionStatus,
      renameFlag: isFirstQuestion,
    })

    const result: ChatSaveResult = {
      success: true,
      chatId,
      rawSentenceID,
    }

    // 事件：保存成功
    context.eventBus?.emit('chatSave:success', {
      ...result,
      response: saveResponse,
      input: context.input,
      runtime: context.runtime,
    })

    return result
  } catch (error) {
    const saveError = error as Error
    const result: ChatSaveResult = {
      success: false,
      chatId,
      rawSentenceID,
      error: saveError,
    }

    // 事件：保存错误
    context.eventBus?.emit('chatSave:error', {
      error: saveError,
      input: context.input,
      runtime: context.runtime,
    })

    // 聊天保存失败通常不应该阻断主流程，所以返回结果而不是抛出错误
    return result
  }
}
