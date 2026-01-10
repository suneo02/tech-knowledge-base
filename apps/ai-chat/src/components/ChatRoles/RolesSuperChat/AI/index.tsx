import { axiosInstance } from '@/api/axios'
import { entWebAxiosInstance } from '@/api/entWeb'
import { useSuperChatRoomContext } from '@/contexts/SuperChat'
import { postPointBuried } from '@/utils/common/bury'
import { AgentIdentifiers, ChatQuestionStatus, ChatThinkSignal } from 'gel-api'
import { AICopyButton, AIDislikeButton, AILikeButton, AIRetryButton, SPAgentMsgAI } from 'gel-ui'
import { FC } from 'react'
/**
 * AI消息底部组件
 */
export const AIFooterSuper: FC<{
  content: string
  agentMessage: SPAgentMsgAI
  sendMessage?: (
    message: string,
    agentId?: AgentIdentifiers['agentId'],
    think?: ChatThinkSignal['think'],
    newChatId?: string,
    deepSearch?: 1
  ) => void
}> = ({ content, agentMessage, sendMessage }) => {
  const { chatId } = useSuperChatRoomContext()
  // 如果问答状态不是成功，则展示重试按钮
  if (agentMessage.questionStatus && agentMessage.questionStatus !== ChatQuestionStatus.SUCCESS) {
    return (
      <>
        <div style={{ display: 'flex', gap: '0' }}>
          <AIRetryButton
            content={content}
            isBury
            rawSentence={agentMessage.rawSentence}
            rawSentenceID={agentMessage.rawSentenceID}
            onRetry={() => {
              postPointBuried('922604570286', { click: agentMessage.rawSentence })
              // 应后端要求，因为没有别的流程，只剩下deepthink流程，默认全部带上1
              // 调用sendMessage重新发送原始问题
              if (sendMessage && agentMessage.rawSentence) {
                console.log('🚀 ~ onRetry ~ agentMessage:', agentMessage, content)
                sendMessage(agentMessage.rawSentence, agentMessage.agentId, 1, chatId, 1)
              }
            }}
          />
        </div>
      </>
    )
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex' }}>
        <AICopyButton axiosEntWeb={entWebAxiosInstance} content={content} isBury />
        <AILikeButton axiosEntWeb={entWebAxiosInstance} content={content} question={agentMessage.rawSentence} isBury />
        <AIDislikeButton
          axiosChat={axiosInstance}
          axiosEntWeb={entWebAxiosInstance}
          content={content}
          question={agentMessage.rawSentence}
          questionID={agentMessage.rawSentenceID}
          isBury
          source="SuperChat"
        />
      </div>
    </div>
  )
}
