// ============================================================================
// 导入依赖
// ============================================================================
import { axiosInstance } from '@/api/axios' // 通用 axios 实例，用于聊天 API 请求
import { entWebAxiosInstance } from '@/api/entWeb' // 企业 Web axios 实例，用于企业相关 API

import { md } from '@/components/markdown/index.tsx' // Markdown 渲染器，用于格式化 AI 回复内容
import { useUrlParams } from '@/hooks/useUrlParams' // URL 参数解析 hook
import { getApiPrefix, getWsid, isDev } from '@/utils/env' // 环境工具：获取工作空间 ID 和判断开发环境
import intl from '@/utils/intl' // 国际化工具
import { hashParams } from '@/utils/links' // URL hash 参数解析工具
import { createRolesBase, PlaceholderBase, useChatBase, useChatRestore, useChatRoomContext } from 'ai-ui' // AI UI 组件库提供的聊天基础能力
import { ChatThinkSignal } from 'gel-api/*' // 聊天深度思考信号类型定义
import React, { useEffect, useMemo } from 'react'
import ChatMessageCore from './ChatMessageCore' // 核心聊天 UI 组件

// ============================================================================
// 类型定义
// ============================================================================

/**
 * ChatMessageBase 组件属性
 *
 * 这是一个容器组件，负责整合聊天相关的业务逻辑和数据管理，
 * 然后将处理好的数据传递给 ChatMessageCore 展示组件。
 *
 * @see {@link ChatMessageCore} - 核心展示组件
 * @see {@link file:./README.md} - 组件文档
 */
interface ChatMessageBaseProps {
  /** 初始消息，通常用于从其他页面跳转时带入的消息，发送后会自动清除 URL 参数 */
  initialMessage?: string | null

  /** 初始深度思考模式，1 表示启用深度思考，undefined 表示普通模式 */
  initialDeepthink?: ChatThinkSignal['think'] | null

  /** 实体类型，用于标识当前聊天的业务实体（如 'company'） */
  entityType?: string

  /** 实体名称，用于显示当前聊天的业务实体名称（如公司名称） */
  entityName?: string
}

// ============================================================================
// 组件实现
// ============================================================================

/**
 * ChatMessageBase - 聊天消息容器组件
 *
 * 职责：
 * 1. 整合聊天基础能力（useChatBase）和历史消息恢复（useChatRestore）
 * 2. 管理聊天状态（chatId、roomId、isChating）
 * 3. 处理 URL 参数（groupId、entityCode）
 * 4. 配置角色和占位符
 * 5. 将处理好的数据传递给 ChatMessageCore 展示组件
 *
 * @see {@link file:./ChatMessageCore.tsx} - 核心展示组件实现
 * @see {@link file:./README.md} - 组件文档
 * @see {@link file:../../../../../../docs/rule/react-rule.md} - React 开发规范
 */
export const ChatMessageBase: React.FC<ChatMessageBaseProps> = ({
  entityName,
  entityType,
  initialMessage,
  initialDeepthink,
}: ChatMessageBaseProps) => {
  // ============================================================================
  // 状态和上下文
  // ============================================================================

  // 从聊天室上下文获取会话相关状态
  // chatId: 后端会话 ID，用于历史消息恢复
  // roomId: 前端房间 ID，用于区分不同的聊天会话
  // isChating: 是否正在聊天中（流式响应进行中）
  // updateRoomId: 更新房间 ID 的方法
  const { chatId, roomId, isChating, updateRoomId } = useChatRoomContext()

  // 从 URL 获取群组 ID，用于恢复特定会话
  const groupId = useUrlParams('groupId')

  // 从 URL hash 参数获取企业代码，用于标识当前企业
  const entityCode = hashParams().getParamValue('CompanyCode')

  // ============================================================================
  // 角色配置
  // ============================================================================

  /**
   * 创建角色配置
   *
   * 角色配置定义了 AI 和用户的头像、名称、样式等展示信息
   * 使用 useMemo 缓存，避免每次渲染都重新创建
   */
  const rolesBase = useMemo(
    () =>
      createRolesBase({
        isDev, // 是否开发环境，影响调试信息显示
        md, // Markdown 渲染器
        wsid: getWsid(), // 工作空间 ID
        entWebAxiosInstance, // 企业 Web axios 实例
        showAiHeader: false, // 不显示 AI 头部信息
      }),
    [] // 空依赖数组，仅在组件挂载时创建一次
  )

  // ============================================================================
  // 副作用：同步 groupId 到 roomId
  // ============================================================================

  /**
   * 当 URL 中存在 groupId 时，更新 roomId
   * 这样可以恢复到特定的聊天会话
   */
  useEffect(() => {
    if (groupId) {
      updateRoomId(groupId)
    }
  }, [updateRoomId, groupId])

  // ============================================================================
  // 聊天基础能力
  // ============================================================================

  /**
   * useChatBase - 提供聊天的核心能力
   *
   * 返回值：
   * - content: 当前输入框内容
   * - parsedMessages: 解析后的消息列表（包含用户消息和 AI 回复）
   * - handleContentChange: 处理输入框内容变化
   * - sendMessage: 发送消息方法
   * - cancelRequest: 取消当前请求方法
   * - setMessages: 设置消息列表方法（用于恢复历史消息）
   */
  const { content, parsedMessages, handleContentChange, sendMessage, cancelRequest, setMessages } = useChatBase(
    axiosInstance, // 通用 axios 实例
    entWebAxiosInstance, // 企业 Web axios 实例
    isDev, // 是否开发环境
    getWsid(), // 工作空间 ID
    getApiPrefix(),
    undefined, // agent ID（未指定）
    intl('451214', 'AI问企业'), // 聊天标题
    entityCode // 企业代码
  )

  // ============================================================================
  // 历史消息恢复
  // ============================================================================

  /**
   * useChatRestore - 提供历史消息恢复能力
   *
   * 返回值：
   * - messagesByChatRestore: 恢复的历史消息列表
   * - bubbleLoading: 是否正在加载历史消息
   * - restoreMessages: 恢复历史消息方法
   * - loadMoreMessages: 加载更多历史消息方法
   * - hasMore: 是否还有更多历史消息
   */
  const { messagesByChatRestore, bubbleLoading, restoreMessages, loadMoreMessages, hasMore } = useChatRestore({
    axiosChat: axiosInstance, // axios 实例
    chatId, // 会话 ID
    entityCode, // 企业代码
    shouldRestore: false, // 不自动恢复，手动调用 restoreMessages
    pageSize: 10, // 每页加载 10 条消息
  })

  // ============================================================================
  // 副作用：初始化时恢复历史消息
  // ============================================================================

  /**
   * 组件挂载时调用 restoreMessages 恢复历史消息
   * 注意：这里依赖数组为空，但 ESLint 会警告缺少 restoreMessages 依赖
   * 实际上 restoreMessages 是稳定的函数引用，不需要添加到依赖中
   */
  useEffect(() => {
    restoreMessages()
  }, [])

  // ============================================================================
  // 副作用：将恢复的历史消息设置到聊天状态
  // ============================================================================

  /**
   * 当历史消息恢复完成后，将消息设置到 useChatBase 的状态中
   * 这样可以在 UI 上显示历史消息
   */
  useEffect(() => {
    if (messagesByChatRestore) {
      setMessages(messagesByChatRestore)
    }
  }, [messagesByChatRestore, setMessages])

  // ============================================================================
  // 性能优化：缓存传递给子组件的 props
  // ============================================================================

  /**
   * 使用 useMemo 缓存传递给 ChatMessageCore 的 props
   *
   * 优点：
   * 1. 避免每次渲染都创建新对象，减少子组件不必要的重渲染
   * 2. 明确列出所有依赖，便于追踪数据流
   *
   * 注意：sendMessage 未包含在依赖中，因为它在 useChatBase 中已经用 useCallback 稳定化
   */
  const chatMessageProps = useMemo(
    () => ({
      entityName, // 实体名称
      entityType, // 实体类型
      initialMessage, // 初始消息
      initialDeepthink, // 初始深度思考模式
      roles: rolesBase, // 角色配置
      PlaceholderNode: PlaceholderBase, // 占位符组件
      isChating, // 是否正在聊天
      chatId, // 会话 ID
      roomId, // 房间 ID
      content, // 输入框内容
      parsedMessages, // 解析后的消息列表
      handleContentChange, // 处理输入框内容变化
      sendMessage, // 发送消息方法
      cancelRequest, // 取消请求方法
      bubbleLoading, // 历史消息加载状态
      hasMore, // 是否还有更多历史消息
      onLoadMore: loadMoreMessages, // 加载更多历史消息方法
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
      sendMessage, // 虽然 sendMessage 是稳定的，但为了明确依赖关系，还是包含在内
      cancelRequest,
      bubbleLoading,
      hasMore,
      loadMoreMessages,
    ]
  )

  // ============================================================================
  // 渲染
  // ============================================================================

  return <ChatMessageCore {...chatMessageProps} />
}
