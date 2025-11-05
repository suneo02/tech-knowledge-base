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
import { needsBrowserCompat } from '@/utils/common/navigator'
import { legacyLogicalPropertiesTransformer, StyleProvider } from '@ant-design/cssinjs'
import {
  ChatRoomProvider,
  ConversationsBaseProvider,
  FavoritesProvider,
  PresetQuestionBaseProvider,
  useChatRoomContext,
  useFavorites,
  usePresetQuestionBaseContext,
} from 'ai-ui'

const ChatContent: React.FC<{ resizable?: boolean }> = ({ resizable = true }) => {
  const { roomId } = useChatRoomContext()
  const { setChatQuestions } = usePresetQuestionBaseContext()
  const { initialMessage, initialDeepthink } = useInitialMessage()
  const { showFavorites } = useFavorites()

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
  console.log('🚀 ~ isLegacyBrowser:', isLegacyBrowser)

  /**
   * 自定义 CSS 转换器，解决 Chrome 83 兼容性问题
   * 将 gap 属性替换为 margin
   */
  const gapCompatTransformer: Transformer = {
    // @ts-expect-error 1111
    visit: (cssObj) => {
      // 如果不是旧版浏览器，直接返回原对象
      if (!isLegacyBrowser) {
        return cssObj
      }

      // 创建一个新对象，避免修改原对象
      const newCssObj = { ...cssObj }

      // 处理 gap 属性不兼容问题
      if (newCssObj.gap !== undefined || newCssObj.rowGap !== undefined || newCssObj.columnGap !== undefined) {
        const gapValue = newCssObj.gap || newCssObj.rowGap || newCssObj.columnGap
        delete newCssObj.gap
        delete newCssObj.rowGap
        delete newCssObj.columnGap

        // 根据 flex 方向添加替代样式
        if (newCssObj.flexDirection === 'column' || newCssObj.columnGap) {
          newCssObj['& > *:not(:last-child)'] = {
            marginBottom: gapValue,
          }
        } else {
          newCssObj['& > *:not(:last-child)'] = {
            marginRight: gapValue,
          }
        }
      }

      return newCssObj
    },
  }

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
              <ChatContent resizable={false} />
            </FavoritesProvider>
          </ConversationsBaseProvider>
        </PresetQuestionBaseProvider>
      </ChatRoomProvider>
    </StyleProvider>
  )
}

export default Chat
