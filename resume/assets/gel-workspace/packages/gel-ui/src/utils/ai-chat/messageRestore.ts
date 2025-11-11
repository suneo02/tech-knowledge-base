import { AgentMsgAIDepre, AgentMsgDepre, AgentMsgUserShare } from '@/types'
import { MessageInfo } from '@ant-design/x/es/use-x-chat'
import { ChatDetailTurn } from 'gel-api'
import { formatAIAnswerFull } from 'gel-util/common'
import { ERROR_TEXT } from 'gel-util/config'

export function transformChatRestoreItemToRawUserMessage(
  item: ChatDetailTurn
): MessageInfo<AgentMsgUserShare> | undefined {
  if (!item) {
    return undefined
  }
  const { questionsID, questions, think, groupId } = item

  if (questionsID) {
    return {
      id: questionsID,
      message: {
        role: 'user',
        content: questions || '',
        chatId: groupId,
        think: (think?.length ?? 0 > 0) ? 1 : undefined,
      },
      status: 'success',
    }
  }
  return undefined
}

export function transformChatRestoreItemToRawAIMessage(
  item: ChatDetailTurn | undefined
): MessageInfo<AgentMsgAIDepre> | undefined {
  try {
    if (!item) {
      return undefined
    }

    const {
      questionsID,
      questions,
      questionStatus,
      answers,
      data,
      think,
      entity,
      traceContent,
      groupId,
      modelType,
      reportData,
    } = item

    if (answers || questionStatus != null) {
      const content = formatAIAnswerFull({
        answers,
        traceContent: traceContent || [],
        dpuList: data?.result?.content?.data,
        ragList: data?.result?.suggest?.items,
        entity: entity || [],
        modelType,
      })

      return {
        id: `${questionsID}-${answers}`,
        message: {
          role: 'ai',
          rawSentence: questions,
          rawSentenceID: questionsID,
          content: content || ERROR_TEXT[questionStatus ?? 0],
          error: ERROR_TEXT[questionStatus ?? 0],
          reasonContent: think,
          questionStatus: questionStatus,
          entity: entity,
          gelData: data?.gelData,
          ragList: data?.result?.suggest?.items,
          dpuList: data?.result?.content?.data,
          chartType: data?.result?.content?.chart,
          think: (think?.length ?? 0 > 0) ? 1 : undefined,
          status: 'finish',
          chatId: groupId,
          splTable: data?.result?.splTable,
          modelType,
          reportData,
        },
        status: 'success',
      }
    }
  } catch (e) {
    console.error(e)
  }
  return undefined
}

export function transformChatRestoreItemToRawMessages(item: ChatDetailTurn): MessageInfo<AgentMsgDepre>[] {
  if (!item) {
    return []
  }
  const bubbleList: MessageInfo<AgentMsgDepre>[] = []

  const userMessage = transformChatRestoreItemToRawUserMessage(item)
  if (userMessage) {
    bubbleList.push(userMessage)
  }

  const aiMessage = transformChatRestoreItemToRawAIMessage(item)
  if (aiMessage) {
    bubbleList.push(aiMessage)
  }

  return bubbleList
}
/**
 * 将 selectChatAIRecord 数据转换为 bubble list
 * @param chatRestoreRes selectChatAIRecord 返回的数据
 * @returns 转换后的消息列表
 */
export const transformChatRestoreToRawMessages = (chatRestoreRes: ChatDetailTurn[]): MessageInfo<AgentMsgDepre>[] => {
  if (!chatRestoreRes) {
    return []
  }
  const bubbleList: MessageInfo<AgentMsgDepre>[] = []

  chatRestoreRes.forEach((item) => {
    bubbleList.push(...transformChatRestoreItemToRawMessages(item))
  })

  return bubbleList
}
