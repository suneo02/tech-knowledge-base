import type { ChatSendInput } from '@/types/ai-chat-perf'
import { ApiResponseForGetUserQuestion, ChatQuestionStatus, requestToChatWithAxios } from 'gel-api'
import { createHandleErrorFromContext } from '../helper'
import { ChatRunContext } from '../runContext'
/**
 * 问句拆解处理函数 - 纯函数实现
 *
 * 主要功能：
 * 1. 根据分析结果进行问句拆解轮询
 * 2. 处理拆解结果和回调
 * 3. 更新上下文状态
 * 4. 返回拆解结果
 *
 * @template TInput - 输入类型，默认为 ChatSendInput
 * @template TChunk - 模型分片类型，默认为 ModelChunk
 */
export async function processQuestionDecomposition<TInput extends ChatSendInput = ChatSendInput>(
  context: ChatRunContext<TInput>
): Promise<void> {
  const { runtime } = context
  const { rawSentenceID } = runtime

  if (!rawSentenceID) {
    // No rawSentenceID found, skipping question decomposition
    return
  }

  // 事件：问句拆解开始
  context.eventBus?.emit('questionDecomposition:start', {
    rawSentenceID,
    input: context.input,
    runtime: context.runtime,
  })

  try {
    await executePolling(context)
  } catch (error) {
    // 事件：问句拆解错误
    context.eventBus?.emit('questionDecomposition:error', {
      error: error as Error,
      input: context.input,
      runtime: context.runtime,
    })

    // 失败不影响主流程
  }
}

/**
 * 执行轮询逻辑
 */
async function executePolling<TInput extends ChatSendInput = ChatSendInput>(
  context: ChatRunContext<TInput>
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let timer: ReturnType<typeof setInterval> | null = null

    const handleSingleRequest = async () => {
      try {
        const response = await makeQuestionRequest(context)

        processResponse(context, response)

        if (response.finish) {
          cleanupTimer(timer)
          // 事件：问句拆解成功
          context.eventBus?.emit('questionDecomposition:success', {
            result: response,
            input: context.input,
            runtime: context.runtime,
          })
          resolve()
        }
      } catch (error) {
        cleanupTimer(timer)
        resolve() // 失败不影响主流程
      }
    }

    // 立即执行第一次调用
    handleSingleRequest()

    // 设置定时器进行后续轮询
    timer = setInterval(handleSingleRequest, context.staticCfg.getUserQuestionInterval || 3000)

    // 设置中止信号监听
    setupAbortListener(context, timer, reject)
  })
}

/**
 * 发起问句拆解请求
 */
async function makeQuestionRequest<TInput extends ChatSendInput = ChatSendInput>(context: ChatRunContext<TInput>) {
  const { staticCfg, input, runtime, abortController } = context
  const { axiosInstance } = staticCfg
  const { rawSentenceID } = runtime

  return await requestToChatWithAxios(
    axiosInstance,
    'chat/getUserQuestion',
    {
      version: 3,
      rawSentence: input.content,
      rawSentenceID: rawSentenceID!,
      agentId: input.agentId,
      clientType: input.clientType,
      think: input.think,
      deepSearch: input.deepSearch,
    },
    {
      signal: abortController?.signal,
    }
  )
}

/**
 * 处理响应结果
 */
function processResponse<TInput extends ChatSendInput = ChatSendInput>(
  context: ChatRunContext<TInput>,
  response: ApiResponseForGetUserQuestion<string>
): void {
  const { content, result, suggest, gelData, splTable, reportData, modelType } = response

  // 事件：收到拆解问题列表
  if (result && typeof result === 'string') {
    const questions = result.split('\n')
    context.eventBus?.emit('question:received', {
      questions,
      input: context.input,
      runtime: context.runtime,
    })
  }

  // 更新运行时状态
  Object.assign(context.runtime, {
    dpuResponse: content,
    ragResponse: suggest,
    gelData,
    splTable,
    reportData,
    modelType,
  })
}

/**
 * 清理定时器
 */
function cleanupTimer(timer: ReturnType<typeof setInterval> | null): void {
  if (timer) {
    clearInterval(timer)
  }
}

/**
 * 设置中止信号监听
 */
function setupAbortListener<TInput extends ChatSendInput = ChatSendInput>(
  context: ChatRunContext<TInput>,
  timer: ReturnType<typeof setInterval> | null,
  reject: (reason?: any) => void
): void {
  if (context.abortController?.signal) {
    context.abortController.signal.addEventListener('abort', () => {
      cleanupTimer(timer)
      // 用户手动中止，使用便捷函数创建标准化错误
      reject(createHandleErrorFromContext(context, ChatQuestionStatus.CANCELLED))
    })
  }
}
