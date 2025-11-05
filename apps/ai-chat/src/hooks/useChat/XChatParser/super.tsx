import { AIFooterSuper } from '@/components/ChatRoles/RolesSuperChat/AI'
import { XChatConfig } from '@ant-design/x/es/use-x-chat'
import {
  createAIContentMessage,
  createAIHeaderMessage,
  createChartMessage,
  createSubQuestionMessage,
  createSuggestionMessage,
  createUserMessage,
  MessageParsedSuper,
  MessageRaw,
  MessageRawSuper,
} from 'ai-ui'

export const useXChatParserSuper = (
  sendMessage?: (message: string, agentId?: MessageRaw['agentId'], think?: MessageRaw['think']) => void
) => {
  return useCallback<NonNullable<XChatConfig<MessageRawSuper, MessageParsedSuper>['parser']>>((agentMessage) => {
    if (agentMessage.role === 'user') {
      return createUserMessage(agentMessage) as MessageParsedSuper
    }

    const messageList: MessageParsedSuper[] = [createAIHeaderMessage(agentMessage)]

    // 处理子问题
    const subQuestionMessage = createSubQuestionMessage(agentMessage)
    if (subQuestionMessage) {
      messageList.push(subQuestionMessage)
    }

    // 处理AI内容
    const aiContentMessage = createAIContentMessage(agentMessage, (props) => (
      <AIFooterSuper {...props} sendMessage={sendMessage} />
    ))
    if (aiContentMessage) {
      messageList.push(aiContentMessage)
    }

    // 处理建议
    const suggestionMessage = createSuggestionMessage(agentMessage)
    if (suggestionMessage) {
      messageList.push(suggestionMessage)
    }

    // 处理图表
    const chartMessage = createChartMessage(agentMessage)
    if (chartMessage) {
      messageList.push(chartMessage)
    }

    return messageList
  }, [])
}
