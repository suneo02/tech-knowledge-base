import { axiosInstance } from '@/api/axios'
import { entWebAxiosInstance } from '@/api/entWeb'

import { md } from '@/components/markdown/index.tsx'
import { useUrlParams } from '@/hooks/useUrlParams'
import { getWsid, isDev } from '@/utils/env'
import intl from '@/utils/intl'
import { hashParams } from '@/utils/links'
import { createRolesBase, MessageRaw, PlaceholderBase, useChatBase, useChatRestore, useChatRoomContext } from 'ai-ui'
import { AgentId } from 'gel-api'
import React, { useCallback, useEffect, useMemo } from 'react'
import ChatMessageCore from './ChatMessageCore'

/**
 * 使用基础聊天hook的消息组件
 */
interface ChatMessageBaseProps {
  /** 初始消息，通常用于从其他页面跳转时带入的消息 */
  initialMessage?: string | null
  initialDeepthink?: MessageRaw['think'] | null

  // AI详情页 需要额外传入的参数
  // 实体类型
  entityType?: string
  // 实体名称
  entityName?: string
}

export const ChatMessageBase: React.FC<ChatMessageBaseProps> = ({
  entityName,
  entityType,
  initialMessage,
  initialDeepthink,
}: ChatMessageBaseProps) => {
  const { chatId, roomId, isChating, updateRoomId } = useChatRoomContext()

  const groupId = useUrlParams('groupId')
  const entityCode = hashParams().getParamValue('CompanyCode')

  // 创建角色配置
  const rolesBase = useMemo(
    () =>
      createRolesBase({
        isDev,
        md,
        wsid: getWsid(),
        entWebAxiosInstance,
        showAiHeader: false,
      }),
    []
  )

  useEffect(() => {
    if (groupId) {
      updateRoomId(groupId)
    }
  }, [updateRoomId, groupId])

  // 获取聊天相关的状态和方法
  const { content, parsedMessages, handleContentChange, sendMessage, cancelRequest, setMessages } = useChatBase(
    axiosInstance,
    entWebAxiosInstance,
    isDev,
    getWsid(),
    '',
    undefined,
    intl('451214', 'AI问企业'),
    entityCode
  )

  // 获取历史消息恢复状态
  const { messagesByChatRestore, bubbleLoading, restoreMessages, loadMoreMessages, hasMore } = useChatRestore({
    axiosChat: axiosInstance,
    chatId,
    entityCode,
    // 当有 chatId 时恢复历史消息
    shouldRestore: false,
    pageSize: 10,
  })

  useEffect(() => {
    restoreMessages()
  }, [])

  // 处理历史消息恢复
  useEffect(() => {
    if (messagesByChatRestore) {
      setMessages(messagesByChatRestore)
    }
  }, [messagesByChatRestore, setMessages])

  const handleSendMessage = useCallback(
    (message: string, agentId?: AgentId, think?: MessageRaw['think']) => {
      sendMessage(message, agentId, think, {
        entityType,
        entityName,
      })
    },
    [sendMessage, entityType, entityName]
  )

  // 使用 useMemo 缓存组件属性
  const chatMessageProps = useMemo(
    () => ({
      entityName,
      entityType,
      initialMessage,
      initialDeepthink,
      roles: rolesBase,
      PlaceholderNode: PlaceholderBase,
      isChating,
      chatId,
      roomId,
      content,
      parsedMessages,
      handleContentChange,
      sendMessage: handleSendMessage,
      cancelRequest,
      bubbleLoading,
      hasMore,
      onLoadMore: loadMoreMessages,
    }),
    [
      entityName,
      entityType,
      initialMessage,
      initialDeepthink,
      rolesBase,
      isChating,
      chatId,
      roomId,
      content,
      parsedMessages,
      handleContentChange,
      handleSendMessage,
      cancelRequest,
      bubbleLoading,
      hasMore,
      loadMoreMessages,
    ]
  )

  return <ChatMessageCore {...chatMessageProps} />
}
