import { AIFooterSuper } from '@/components/ChatRoles/RolesSuperChat/AI'
import { XChatConfig } from '@ant-design/x/es/use-x-chat'
import { AgentIdentifiers, ChatThinkSignal } from 'gel-api'
import {
  createAIContentMessage,
  createAIFooterMessage,
  createAIHeaderMessage,
  createSplTableMessage,
  createChartMessage,
  createSubQuestionMessage,
  createSuggestionMessage,
  createUserMessage,
  SPAgentMsg,
  SPMsgParsed,
} from 'gel-ui'

export const useXChatParserSuper = (
  sendMessage?: (
    message: string,
    agentId?: AgentIdentifiers['agentId'],
    think?: ChatThinkSignal['think'],
    chatId?: string,
    deepSearch?: 1
  ) => void
) => {
  return useCallback<NonNullable<XChatConfig<SPAgentMsg, SPMsgParsed>['parser']>>((agentMessage) => {
    console.log('🚀 ~ useXChatParserSuper ~ agentMessage:', agentMessage)
    if (agentMessage.role === 'user') {
      return createUserMessage(agentMessage) as SPMsgParsed
    }

    const messageList: SPMsgParsed[] = [createAIHeaderMessage(agentMessage)]

    // 处理子问题
    const subQuestionMessage = createSubQuestionMessage(agentMessage)
    if (subQuestionMessage) {
      messageList.push(subQuestionMessage)
    }

    // 处理AI内容
    const aiContentMessage = createAIContentMessage(agentMessage)
    if (aiContentMessage) {
      messageList.push(aiContentMessage)
    }

    // 处理SplTable
    const splTableMessage = createSplTableMessage(agentMessage)
    if (splTableMessage) {
      messageList.push(splTableMessage as SPMsgParsed)
    }

    // 处理AI底部
    const aiFooterMessage = createAIFooterMessage(agentMessage, (props) => (
      <AIFooterSuper {...props} sendMessage={sendMessage} />
    ))
    if (aiFooterMessage) {
      messageList.push(aiFooterMessage as SPMsgParsed)
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
