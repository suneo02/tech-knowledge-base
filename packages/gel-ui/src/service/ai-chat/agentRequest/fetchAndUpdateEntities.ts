import { AgentMsgAIOverall, AgentMsgOverall } from '@/types/ai-chat/message/agent'
import { AxiosInstance } from 'axios'
import { ChatEntityRecognize, ChatQuestionStatus } from 'gel-api'
import { formatAIAnswerFull } from 'gel-util/common'
import { fetchEntities } from '../fetchEntities'
import { fetchTrace } from '../fetchTrace'
import { ChatSenderRes, saveChatItem } from '../saveChatItem'

type FetchAndUpdateEntitiesOptions = {
  questionStatus: ChatQuestionStatus
  axiosChat: AxiosInstance
  result: ChatSenderRes
  lines: { content: string; reason: string }
  onSuccess: (response: AgentMsgOverall, entities: ChatEntityRecognize[] | undefined) => void
  aiResRefCreator: () => AgentMsgAIOverall
  isFirstQuestionRef: React.MutableRefObject<boolean>
}

/** 统一获取实体数据的函数 */

export const fetchAndUpdateEntities = async ({
  questionStatus,
  axiosChat,
  result,
  lines,
  onSuccess,
  aiResRefCreator,
  isFirstQuestionRef,
}: FetchAndUpdateEntitiesOptions) => {
  const traces = await fetchTrace(axiosChat, result?.rawSentenceID)

  const newEntities = await fetchEntities(axiosChat, result?.rawSentenceID)

  // 获取格式化后的答案
  const content = formatAIAnswerFull({
    answers: lines.content,
    traceContent: traces,
    dpuList: result?.content?.data,
    ragList: result?.suggest?.items,
    entity: newEntities,
    modelType: result?.modelType,
  })

  onSuccess(
    {
      ...aiResRefCreator(),
      content,
      entity: newEntities,
      gelData: result?.gelData,
      status: 'finish',
    },
    newEntities
  )
  await saveChatItem({
    axiosChat,
    result,
    isFirstQuestion: isFirstQuestionRef.current,
    questionStatus: questionStatus,
  })
  return content
}
