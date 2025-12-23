import { BubbleListProps } from '@ant-design/x/es/bubble/BubbleList'
import { MessageInfo, MessageStatus } from '@ant-design/x/es/use-x-chat'
import { createAIContentMessage, createAIHeaderMessage } from 'gel-ui'
import { t } from 'gel-util/intl'
import { useCallback, useMemo, useRef } from 'react'
import { PlaceholderPromptsComp } from './PlaceholderPrompts/type'

/**
 * 创建含有消息的气泡项
 * 将解析后的消息转换为可展示的气泡列表项
 * 使用缓存机制避免不必要的重新创建
 */
export const createBubbleItemsByParsedMessages = <T extends object>(
  parsedMessages: MessageInfo<T>[],
  cacheRef?: React.MutableRefObject<Map<string, any>>
) => {
  // 如果没有消息，返回空数组
  if (parsedMessages.length === 0) {
    return []
  }

  const result: any[] = []
  const newCache = new Map<string, any>()

  parsedMessages.forEach((item: MessageInfo<T>) => {
    const { id, message, status } = item
    // @ts-expect-error ttt
    const cacheKey = `${id}-${message?.role}-${status}`

    // 检查缓存中是否存在相同的消息
    if (cacheRef?.current.has(cacheKey)) {
      result.push(cacheRef.current.get(cacheKey))
    } else {
      // 创建新的气泡项
      const bubbleItem = {
        key: id,
        ...message,
      }
      result.push(bubbleItem)
      newCache.set(cacheKey, bubbleItem)
    }
  })

  // 更新缓存
  if (cacheRef) {
    cacheRef.current = newCache
  }

  return result
}

export const createDefaultMessages = () => {
  let agentMessage = {
    agentId: undefined,
    chatId: '',
    content: t(
      '454597',
      `Hi，我是您的商业查询智能助手！全维度企业尽调、股权穿透和关联关系、经营信息动态监测...这些我都在行，欢迎向我提问！`
    ),
    role: 'ai',
    status: 'finish',
    think: undefined,
    questionStatus: '70001', // 设为意图审计不通过 为了不显示重试按钮
  }
  const parsedMessage = [createAIHeaderMessage(agentMessage as any), createAIContentMessage(agentMessage as any)]
  const defaultMessages: any[] =
    parsedMessage && Array.isArray(parsedMessage)
      ? parsedMessage.map((item, index) => ({
          id: `default-${index}`, // 为每个消息生成唯一的 key
          message: item,
          status: 'finish' as MessageStatus,
        }))
      : []
  return defaultMessages
}

/**
 * 气泡项逻辑自定义Hook
 * 处理聊天气泡的创建和渲染逻辑
 */
export const useBubbleItems = <T extends object>(
  parsedMessages: MessageInfo<T>[],
  chatId: string,
  showPlaceholderWhenEmpty: boolean,
  PlaceholderNode?: PlaceholderPromptsComp,
  sendMessage?: (message: string) => void,
  isEmbedMode?: boolean
) => {
  // 使用 useRef 来缓存气泡项，避免不必要的重新创建
  const bubbleCacheRef = useRef<Map<string, any>>(new Map())

  /**
   * 创建占位内容气泡项
   * 在新会话时显示预设问题或建议
   */

  const createPlaceholderBubble = useCallback(
    () => [
      {
        // 当没有消息时显示占位内容
        content: PlaceholderNode ? <PlaceholderNode handleSendPresetMsg={sendMessage} /> : null,
        variant: 'borderless' as const,
        styles: {
          content: {
            width: '100%',
          },
        },
      },
    ],
    [PlaceholderNode, sendMessage]
  )

  /**
   * 构建气泡列表项
   * 根据当前会话状态返回适当的气泡项：
   * 1. 有消息时显示消息内容
   * 2. 有会话ID但无消息时：
   *    - 如果showPlaceholderWhenEmpty为true，显示占位内容
   *    - 如果showPlaceholderWhenEmpty为false，显示空数组
   * 3. 无会话ID且无消息时显示占位内容
   */

  // 使用 useMemo 来创建 bubbleItems，返回新的数组对象但缓存内部 item
  const bubbleItems: BubbleListProps['items'] = useMemo(() => {
    let newBubbleItems: BubbleListProps['items'] = []

    // 嵌入模式下，显示默认消息
    if (isEmbedMode) {
      if (parsedMessages.length > 0) {
        newBubbleItems = [...createBubbleItemsByParsedMessages(parsedMessages, bubbleCacheRef)]
      }
    } else {
      // 非嵌入模式下，显示消息
      if (parsedMessages.length > 0) {
        newBubbleItems = createBubbleItemsByParsedMessages(parsedMessages, bubbleCacheRef)
      } else if (chatId && !showPlaceholderWhenEmpty) {
        // 有会话ID且无消息时显示空数组
        newBubbleItems = []
      } else {
        if (PlaceholderNode) {
          // 无会话ID且无消息时显示占位内容
          newBubbleItems = createPlaceholderBubble()
        }
      }
    }

    return newBubbleItems
  }, [isEmbedMode, parsedMessages, chatId, showPlaceholderWhenEmpty, createPlaceholderBubble])

  return { bubbleItems }
}
