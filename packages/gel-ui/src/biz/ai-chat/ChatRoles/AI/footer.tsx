import { AICopyButton, AIDislikeButton, AILikeButton, AIRetryButton } from '@/common'
import { AgentMsgAIDepre } from '@/types/ai-chat/message/agent'
import { AxiosInstance } from 'axios'
import { ChatQuestionStatus } from 'gel-api'
import { FC } from 'react'

/**
 * AI消息底部组件，包含复制、点赞、踩一下和重试按钮
 */
export const AiFooterBase: FC<{
  axiosChat: AxiosInstance
  axiosEntWeb: AxiosInstance
  content: string
  agentMessage: AgentMsgAIDepre
  sendMessage?: (
    message: string,
    agentId?: AgentMsgAIDepre['agentId'],
    think?: AgentMsgAIDepre['think'],
    options?: { chatId?: string; modelType?: string }
  ) => void
}> = ({ axiosChat, axiosEntWeb, content, agentMessage, sendMessage }) => {
  console.log('🚀 ~ content, agentMessage:', content, agentMessage)

  // 意图审计不通过  不展示重试按钮
  if (agentMessage.questionStatus === ChatQuestionStatus.AUDIT_FAILED) {
    return null
  }
  // 如果问答状态不是成功，则展示重试按钮
  if (agentMessage.questionStatus && agentMessage.questionStatus !== ChatQuestionStatus.SUCCESS) {
    return (
      <div style={{ display: 'flex', gap: '0' }}>
        <AIRetryButton
          content={content}
          isBury
          rawSentence={agentMessage.rawSentence}
          rawSentenceID={agentMessage.rawSentenceID}
          onRetry={() => {
            // 调用sendMessage重新发送原始问题
            if (sendMessage && agentMessage.rawSentence) {
              sendMessage(agentMessage.rawSentence, agentMessage.agentId, agentMessage.think, {
                chatId: agentMessage.chatId,
                modelType: agentMessage.modelType,
              })
            }
          }}
        />
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', gap: '0' }}>
      <AICopyButton axiosEntWeb={axiosEntWeb} content={content} isBury />
      <AILikeButton axiosEntWeb={axiosEntWeb} content={content} question={agentMessage.rawSentence || ''} isBury />
      <AIDislikeButton
        axiosChat={axiosChat}
        axiosEntWeb={axiosEntWeb}
        content={content}
        question={agentMessage.rawSentence || ''}
        questionID={agentMessage.rawSentenceID}
        isBury
      />
    </div>
  )
}
