import { ChatSenderRes } from '@/hooks/conversationSetup/types'
import { MessageRaw } from '@/types/message'
import { } from '@/types/message/raw'
import { SessionCompleteResponse, StreamChunk, StreamResponse } from 'gel-api'


export const createHandleError = ({
  chatId,
  rawSentenceID,
  rawSentence,
  errorCode,
}: {
  chatId: string
  rawSentenceID: string
  rawSentence: string
  errorCode?: string
}) => {
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
 * Helper function to handle streaming updates from chat API
 */
export const handleStreamUpdate = (
  chunk: StreamChunk,
  abortStreamControllerRef: React.MutableRefObject<AbortController | null>,
  callbacks: {
    onSuccess: () => void
    onAbort: (isAbort: boolean) => void
    onUpdate: (response: { content: string; reasonContent: string }) => void
  }
) => {
  // Check if already aborted
  if (abortStreamControllerRef.current?.signal?.aborted) {
    // callbacks.onAbort(true)
    return
  }

  if (chunk?.data?.includes('[DONE]')) {
    callbacks.onSuccess()
    return
  }

  const data = JSON.parse(chunk.data) as StreamResponse
  const content = data.choices[0].delta.content
  const reasonContent = data.choices[0].delta.reasoning_content

  callbacks.onUpdate({
    content,
    reasonContent,
  })
}

/**
 * ai 消息在任意接口之前
 */
export const createAIResponseInit = (message: MessageRaw): MessageRaw => ({
  role: 'ai',
  rawSentence: message.content,
  think: message.think,
  content: '',
  reasonContent: '',
  entity: [],
})

/**ai 消息在 字句拆解中 */
export const createAIResponseSubQuestion = (message: MessageRaw, subQuestion: string[]): MessageRaw => ({
  ...createAIResponseInit(message),
  subQuestion,
})

/**ai 消息在 数据召回后 */
export const createAIResponseDataRetrieval = (
  message: MessageRaw,
  subQuestion: string[],
  entities: SessionCompleteResponse[],
  result: ChatSenderRes
): MessageRaw => {
  console.log('🚀 ~createAIResponseDataRetrieval result:', result)
  return {
    ...createAIResponseInit(message),
    entity: entities,
    rawSentenceID: result.rawSentenceID,
    refBase: result?.suggest?.items,
    refTable: result?.refTable,
    chartType: result?.chartType,
    subQuestion,
  }
}

/** ai 消息在流式输出中 */
export const createAIResponseStream = (
  message: MessageRaw,
  content: string,
  reasonContent: string,
  entities: SessionCompleteResponse[],
  result: ChatSenderRes
): MessageRaw => ({
  ...createAIResponseDataRetrieval(message, [], entities, result),
  content,
  reasonContent,
})
