import { XChatConfig } from '@ant-design/x/es/use-x-chat'
import { AxiosInstance } from 'axios'
import { AgentIdentifiers, ChatThinkSignal } from 'gel-api'
import {
  AgentMsgAIDepre,
  AgentMsgDepre,
  AiFooterBase,
  createAIContentMessage,
  createAIHeaderMessage,
  createChartMessage,
  createSimpleChartMessage,
  createSubQuestionMessage,
  createSuggestionMessage,
  createUserMessage,
  MsgParsedDepre,
} from 'gel-ui'
import { useCallback, useMemo } from 'react'

/**
 * 创建聊天消息解析器
 * @param sendMessage - 发送消息的回调函数，用于实现重试功能
 */
export const useXChatParser = (
  axiosChat: AxiosInstance,
  axiosEntWeb: AxiosInstance,
  sendMessage?: (message: string, agentId?: AgentIdentifiers['agentId'], think?: ChatThinkSignal['think']) => void,
  roleName?: string
) => {
  // 使用 useMemo 缓存 AiFooterBase 组件
  const FooterComponent = useMemo(
    () => (props: any) => (
      <AiFooterBase {...props} axiosChat={axiosChat} axiosEntWeb={axiosEntWeb} sendMessage={sendMessage} />
    ),
    [axiosChat, axiosEntWeb, sendMessage]
  )

  // 使用 useMemo 缓存消息创建函数
  const messageCreators = useMemo(
    () => ({
      createUserMessage,
      createAIHeaderMessage: (message: AgentMsgAIDepre) => createAIHeaderMessage(message, roleName),
      createSubQuestionMessage,
      createAIContentMessage: (message: AgentMsgAIDepre) => createAIContentMessage(message, FooterComponent),
      createSimpleChartMessage,
      createSuggestionMessage,
      createChartMessage,
    }),
    [roleName, FooterComponent]
  )

  return useCallback<NonNullable<XChatConfig<AgentMsgDepre, MsgParsedDepre>['parser']>>(
    (agentMessage) => {
      if (agentMessage.role === 'user') {
        return messageCreators.createUserMessage(agentMessage)
      }

      const messageList: MsgParsedDepre[] = [messageCreators.createAIHeaderMessage(agentMessage)]

      // 处理子问题
      const subQuestionMessage = messageCreators.createSubQuestionMessage(agentMessage)
      if (subQuestionMessage) {
        messageList.push(subQuestionMessage)
      }

      // 处理AI内容
      const aiContentMessage = messageCreators.createAIContentMessage(agentMessage)
      if (aiContentMessage) {
        messageList.push(aiContentMessage)
      }

      // 处理简单图表
      const simpleChartMessage = messageCreators.createSimpleChartMessage(agentMessage)
      if (simpleChartMessage) {
        messageList.push(simpleChartMessage)
      }

      // 处理建议
      const suggestionMessage = messageCreators.createSuggestionMessage(agentMessage)
      if (suggestionMessage) {
        messageList.push(suggestionMessage)
      }

      // 处理图表
      const chartMessage = messageCreators.createChartMessage(agentMessage)
      if (chartMessage) {
        messageList.push(chartMessage)
      }

      return messageList
    },
    [messageCreators]
  )
}
