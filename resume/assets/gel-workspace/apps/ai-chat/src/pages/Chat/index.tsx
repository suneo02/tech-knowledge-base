import { requestToChat } from '@/api'
import { useInitialMessage } from '@/hooks/useInitialMessage'
import Loading from '@/pages/Fallback/loading'
import { postPointBuried } from '@/utils/common/bury'
import { Resizer } from '@wind/wind-ui'
import { ResizerProps } from '@wind/wind-ui/lib/resizer'
import { Suspense, useEffect } from 'react'

import { axiosInstance } from '@/api/axios'
import { ChatMessageBase } from '@/components/ChatBase'
import { ChatConversationBase } from '@/components/Conversation/base'
import { FavoritesList } from '@/components/Favorites/FavoritesList'
import { HistoryList } from '@/components/History/HistoryList'
import { legacyLogicalPropertiesTransformer, StyleProvider } from '@ant-design/cssinjs'
import {
  ChatRoomProvider,
  ConversationsBaseProvider,
  FavoritesProvider,
  HistoryProvider,
  PresetQuestionBaseProvider,
  useChatRoomContext,
  useFavorites,
  useHistory,
  usePresetQuestionBaseContext,
} from 'ai-ui'
import { getGapCompatTransformer, needsBrowserCompat } from 'gel-ui'

const ChatContent: React.FC<{ resizable?: boolean }> = ({ resizable = true }) => {
  const { roomId } = useChatRoomContext()
  const { setChatQuestions } = usePresetQuestionBaseContext()
  const { initialMessage, initialDeepthink } = useInitialMessage()
  const { showFavorites } = useFavorites()
  const { showHistory } = useHistory()

  const handleResize: ResizerProps['onResize'] = (_evt, { folded }) => {
    if (folded) {
      postPointBuried('922610370018')
    } else {
      postPointBuried('922610370019')
    }
    return false
  }

  // 获取问题列表
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await requestToChat('getQuestion')
        if (Array.isArray(res.Data)) {
          setChatQuestions(res.Data)
        }
      } catch (error) {
        console.error('Failed to fetch questions:', error)
      }
    }
    fetchQuestions()
  }, [])

  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex' }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <ChatConversationBase />
      </div>
      {resizable && <Resizer unfoldedSize={200} onResize={handleResize} />}
      <div className="f-df" style={{ flex: 4 }}>
        <Suspense fallback={<Loading />}>
          {showFavorites ? (
            <FavoritesList />
          ) : showHistory ? (
            <HistoryList />
          ) : (
            <ChatMessageBase
              key={`chat-messages-${roomId}`}
              initialMessage={initialMessage}
              initialDeepthink={initialDeepthink}
            />
          )}
        </Suspense>
      </div>
    </div>
  )
}

const Chat: React.FC = () => {
  // 获取是否需要兼容性修复的标志
  const isLegacyBrowser = needsBrowserCompat()
  // console.log('🚀 ~ isLegacyBrowser:', isLegacyBrowser)

  /**
   * 自定义 CSS 转换器，解决 Chrome 83 兼容性问题
   * 将 gap 属性替换为 margin
   */
  const gapCompatTransformer = getGapCompatTransformer()

  return (
    <StyleProvider
      hashPriority={isLegacyBrowser ? 'high' : undefined}
      // @ts-expect-error 兼容83版本样式问题 :where 选择器 和 CSS 逻辑属性降级兼容方案
      transformers={isLegacyBrowser ? [gapCompatTransformer, legacyLogicalPropertiesTransformer] : []}
    >
      <ChatRoomProvider>
        <PresetQuestionBaseProvider>
          <ConversationsBaseProvider>
            <FavoritesProvider axiosInstance={axiosInstance}>
              <HistoryProvider>
                <ChatContent resizable={false} />
              </HistoryProvider>
            </FavoritesProvider>
          </ConversationsBaseProvider>
        </PresetQuestionBaseProvider>
      </ChatRoomProvider>
    </StyleProvider>
  )
}

export default Chat
