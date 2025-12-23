/**
 * 企业详情页AI对话核心组件
 *
 * 提供AI智能对话功能，支持企业上下文感知、虚拟滚动、预设问题等
 * 集成Ant Design X聊天组件，支持消息渲染、历史记录和实时对话
 *
 * @see ../../../../../docs/CorpDetail/layout-right.md - 右侧AI面板设计文档
 */

// ============================================================================
// 导入依赖
// ============================================================================

// Ant Design X 聊天组件
import { MessageInfo } from '@ant-design/x/es/use-x-chat' // 消息信息类型

// AI UI 组件库
import {
  ChatActions, // 聊天操作区（输入框、发送按钮等）
  createBubbleItemsByParsedMessages, // 将解析后的消息转换为气泡项
  createDefaultMessages, // 创建默认消息（欢迎语等）
  PlaceholderPromptsComp, // 角色类型定义
  ScrollToBottomButton, // 滚动到底部按钮
  useBubbleItems, // 气泡项处理 hook
  UseChatRestoreResult, // 聊天恢复结果类型
  useEmbedMode,
} from 'ai-ui'

// 工具和组件
import { isDeveloper } from '@/utils/common' // 判断是否为开发者
import { ApiO, UpO } from '@wind/icons' // 图标组件
import { Spin } from '@wind/wind-ui' // 加载动画组件
import cn from 'classnames' // 类名拼接工具

// 类型定义和工具
import { AgentIdentifiers, ChatThinkSignal, EModelType } from 'gel-api' // 聊天相关类型
import { getChatPlaceholder, MsgParsedDepre, RolesTypeCore, useScrollToBottom } from 'gel-ui' // 聊天 UI 工具
import { t } from 'gel-util/intl' // 国际化工具
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom' // 路由 location hook

// 本地依赖
import styles from './ChatMessageCore.module.less' // 组件样式
import { VirtualBubbleList } from './components/VirtualBubbleList'
import { usePresetQuestionsVisible, useVirtualChat } from './hooks' // 虚拟滚动 hook
import { SelectOption, SelectWithIcon } from './SelectWithIcon' // 带图标的选择器组件

// ============================================================================
// 国际化文本
// ============================================================================

/**
 * 国际化文本映射
 * 集中管理组件中使用的所有文本，便于维护和翻译
 */
const intlMap = {
  footer: t('453642', '内容由AI生成，请核查重要信息'), // 页脚免责声明
  roleName: t('451214', 'AI问企业'), // AI 角色名称

  modelType: t('', '点此切换模型'), // 模型切换提示

  // 各模型的描述文本
  claude4Desc: t('', '专注长文本'), // Claude 4 模型描述
  aliceDesc: t('', '商业数据专家'), // Alice 模型描述
  aliceQProDesc: t('', '商业数据专家'), // Alice Q Pro 模型描述
  gpt4ODesc: t('', '全能多模态'), // GPT-4O 模型描述
}

// ============================================================================
// 模型选择配置
// ============================================================================

/**
 * 模型选择选项
 *
 * 根据用户角色（开发者/普通用户）提供不同的模型选项：
 * - 开发者：可选择多个模型（ALICE、ALICE_Q_PRO、GPT_4O）
 * - 普通用户：仅可使用 ALICE 模型
 *
 * @see {@link EModelType} - 模型类型枚举
 */
const modeOptions: SelectOption[] = isDeveloper
  ? [
      {
        value: EModelType.ALICE,
        label: EModelType.ALICE,
        desc: intlMap.aliceDesc,
        icon: <ApiO onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} />,
        tooltip: intlMap.modelType,
      },
      {
        value: EModelType.ALICE_Q_PRO,
        label: EModelType.ALICE_Q_PRO,
        desc: intlMap.aliceQProDesc,
        icon: <ApiO onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} />,
        tooltip: intlMap.modelType,
      },
      {
        value: EModelType.GPT_4O,
        label: EModelType.GPT_4O,
        desc: intlMap.gpt4ODesc,
        icon: <ApiO onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} />,
        tooltip: intlMap.modelType,
      },
      // {
      //   value: EModelType.CLAUDE_4,
      //   label: EModelType.CLAUDE_4,
      //   desc: intlMap.claude4Desc,
      //   icon: <ApiO onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} />,
      //  tooltip: intlMap.modelType,
      // },
    ]
  : [
      {
        value: EModelType.ALICE,
        label: EModelType.ALICE,
        desc: intlMap.aliceDesc,
        icon: <ApiO onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} />,
        tooltip: intlMap.modelType,
      },
    ]

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 气泡列表属性类型
 * 用于定义消息气泡列表的基础属性
 */
interface BubbleListProps {
  items: any[] // 气泡项列表
  roles: any // 角色配置
  className?: string // 自定义类名
  [key: string]: any // 其他扩展属性
}

/**
 * ChatMessageCore 组件属性
 *
 * 这是一个展示组件，负责渲染聊天界面的所有 UI 元素：
 * 1. 消息列表（支持虚拟滚动）
 * 2. 输入框和发送按钮
 * 3. 模型选择器（开发者模式）
 * 4. 滚动到底部按钮
 * 5. 历史消息加载
 *
 * @see {@link file:./index.tsx} - 容器组件
 * @see {@link file:./README.md} - 组件文档
 * @see {@link file:../../../../../../docs/rule/react-rule.md} - React 开发规范
 */
interface ChatMessageCoreProps<T extends BubbleListProps['roles'] = BubbleListProps['roles']> {
  /** 自定义角色配置，用于覆盖默认的角色样式和行为 */
  roles: T
  // 会话 id
  chatId: string
  // 会话房间 id 前端自己使用
  roomId: string
  // 实体类型
  entityType?: string
  // 实体名称
  entityName?: string
  /** 初始消息，通常用于从其他页面跳转时带入的消息 */
  initialMessage?: string | null
  initialDeepthink?: ChatThinkSignal['think'] | null
  /** 是否正在聊天 */
  isChating: boolean
  /** 占位组件类型 */
  PlaceholderNode: PlaceholderPromptsComp
  /** 当有会话ID但无消息时是否显示占位内容 */
  showPlaceholderWhenEmpty?: boolean
  /** 内容 */
  content: string
  /** 解析后的消息 */
  parsedMessages: MessageInfo<MsgParsedDepre>[]
  /** 处理内容变化 */
  handleContentChange: (content: string) => void
  /** 发送消息 */
  sendMessage: (
    message: string,
    agentId?: AgentIdentifiers['agentId'],
    think?: ChatThinkSignal['think'],
    options?: { entityType?: string; entityName?: string; modelType?: string }
  ) => void
  /** 取消请求 */
  cancelRequest: () => void
  /** 气泡加载状态 */
  bubbleLoading?: boolean
  /** 分页相关参数 */
  hasMore?: boolean
  onLoadMore?: () => void
}

// ============================================================================
// 组件实现
// ============================================================================

/**
 * ChatMessageCore - 聊天消息核心展示组件
 *
 * 职责：
 * 1. 渲染聊天消息列表（使用虚拟滚动优化性能）
 * 2. 处理用户输入和消息发送
 * 3. 管理滚动行为（自动滚动、加载更多）
 * 4. 处理初始消息和深度思考模式
 * 5. 提供模型选择功能（开发者模式）
 *
 * 性能优化：
 * - 使用 React.memo 避免不必要的重渲染
 * - 使用虚拟滚动处理大量消息
 * - 使用 useMemo 缓存计算结果
 * - 使用 useCallback 稳定函数引用
 *
 * @see {@link file:./index.tsx} - 容器组件
 * @see {@link file:./hooks/useVirtualChat.ts} - 虚拟滚动实现
 * @see {@link file:./README.md} - 组件文档
 */
const ChatMessageCore = memo(
  <T extends BubbleListProps['roles'] = BubbleListProps['roles']>({
    roles,
    chatId,
    entityType,
    entityName,
    initialMessage,
    initialDeepthink,
    isChating,
    PlaceholderNode,
    showPlaceholderWhenEmpty = false,
    content,
    parsedMessages,
    handleContentChange,
    sendMessage,
    cancelRequest,
    bubbleLoading,
    hasMore,
    onLoadMore,
  }: ChatMessageCoreProps<T> & Pick<UseChatRestoreResult, 'bubbleLoading'>) => {
    // ============================================================================
    // 状态管理
    // ============================================================================

    const location = useLocation()

    /**
     * 深度思考模式状态
     * - 1: 启用深度思考（AI 会进行更深入的分析）
     * - undefined: 普通模式
     */
    const [deepthink, setDeepthink] = useState<ChatThinkSignal['think']>(initialDeepthink ?? undefined)

    /**
     * 当前选择的模型类型
     * 默认使用 ALICE 模型
     */
    const [modelType, setModelType] = useState<EModelType>(EModelType.ALICE)

    /**
     * 是否为嵌入模式
     * 嵌入模式下可能有不同的 UI 展示
     */
    const { isEmbedMode = false } = useEmbedMode()

    /**
     * 初始消息发送标记
     * 使用 ref 确保初始消息只发送一次，避免重复发送
     */
    const initialMessageSentRef = useRef(false)

    /**
     * 用户是否已发送过消息
     * - 初始值：false
     * - 更新时机：用户点击预设问句或手动输入发送消息后，设置为 true
     * - 重置时机：页面刷新或重新进入企业详情页时重置为 false
     * - 作用：控制预设问句的展示与隐藏
     */
    const [isSentMsg, setIsSentMsg] = useState(false)

    /**
     * 预设问句展示判定 Hook
     * 负责判断预设问句是否展示及展示位置
     */
    const { shouldShow: shouldShowPresetQuestions, position: presetQuestionsPosition } = usePresetQuestionsVisible(
      parsedMessages,
      isSentMsg
    )

    // ============================================================================
    // 滚动控制
    // ============================================================================

    /**
     * 滚动控制 hook
     *
     * 提供：
     * - chatContainerRef: 聊天容器的 ref
     * - showScrollBottom: 是否显示"滚动到底部"按钮
     * - scrollToBottom: 滚动到底部的方法
     *
     * 自动处理：
     * - 新消息到达时自动滚动
     * - 用户手动滚动时隐藏/显示按钮
     * - 滚动到顶部时触发加载更多
     */
    const { chatContainerRef, showScrollBottom, scrollToBottom } = useScrollToBottom({
      parsedMessages,
      isChating,
      hasMore,
      bubbleLoading,
      onLoadMore,
      loadMoreThreshold: 100, // 距离顶部 100px 时触发加载更多
    } as any)

    // ============================================================================
    // 消息发送处理
    // ============================================================================

    /**
     * 包装发送消息函数，添加自动滚动到底部功能
     *
     * 流程：
     * 1. 设置 isSentMsg 为 true（标记用户已发送消息）
     * 2. 调用 sendMessage 发送消息
     * 3. 根据用户角色决定是否传递 modelType
     * 4. 延迟 50ms 后滚动到底部（等待 DOM 更新）
     */
    const handleSendMessage = useCallback(
      (message: string, agentId?: AgentIdentifiers['agentId']) => {
        // 标记用户已发送消息，隐藏预设问句
        setIsSentMsg(true)

        sendMessage(
          message,
          agentId,
          deepthink,
          isDeveloper
            ? {
                entityType,
                entityName,
                modelType,
              }
            : {
                entityType,
                entityName,
              }
        )
        // 发送消息后立即滚动到底部
        setTimeout(() => {
          scrollToBottom()
        }, 50)
      },
      [sendMessage, scrollToBottom, modelType, deepthink, entityType, entityName]
    )

    /**
     * 处理预设问句点击
     * 点击后直接发送消息，并标记用户已发送消息
     */
    const handlePresetQuestionClick = useCallback(
      (question: string) => {
        handleSendMessage(question)
      },
      [handleSendMessage]
    )

    /**
     * 稳定的 sendMessage 函数
     *
     * 传递给 useBubbleItems 使用，用于消息重发等场景
     * 使用 useCallback 确保引用稳定，避免触发不必要的重渲染
     */
    const stableSendMessage = useCallback(
      (message: string) =>
        sendMessage(message, undefined, deepthink, {
          entityType,
          entityName,
          modelType,
        }),
      [sendMessage, deepthink, entityType, entityName, modelType]
    )

    /**
     * 稳定的 PlaceholderNode 引用
     *
     * 使用 useMemo 确保引用稳定，避免触发 useBubbleItems 的重新计算
     */
    const stablePlaceholderNode = useMemo(() => PlaceholderNode, [PlaceholderNode])

    // ============================================================================
    // 副作用：初始化和 URL 参数处理
    // ============================================================================

    /**
     * 处理初始深度思考模式
     * 当从 URL 参数传入 initialDeepthink 时，更新本地状态
     */
    useEffect(() => {
      if (initialDeepthink) {
        setDeepthink(initialDeepthink)
      }
    }, [initialDeepthink])

    /**
     * 处理初始消息发送
     *
     * 当从其他页面跳转并携带 initialMessage 时：
     * 1. 检查是否已发送（通过 ref 标记）
     * 2. 如果未发送，则自动发送消息
     * 3. 标记为已发送，避免重复
     */
    useEffect(() => {
      if (initialMessage && !initialMessageSentRef.current) {
        initialMessageSentRef.current = true
        sendMessage(initialMessage, undefined, deepthink, {
          entityType,
          entityName,
          modelType,
        })
      }
    }, [initialMessage, sendMessage, deepthink, entityType, entityName, modelType])

    /**
     * 清除 URL 参数
     *
     * 发送初始消息后，立即清除 URL 中的 initialMsg 和 initialDeepthink 参数
     * 避免页面刷新时重复发送消息
     */
    useEffect(() => {
      if (initialMessage) {
        const searchParams = new URLSearchParams(location.search)
        if (searchParams.has('initialMsg') || searchParams.has('initialDeepthink')) {
          searchParams.delete('initialMsg')
          searchParams.delete('initialDeepthink')
          window.history.replaceState(
            {},
            '',
            `${location.pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
          )
        }
      }
    }, [initialMessage, location])

    // ============================================================================
    // 消息列表处理
    // ============================================================================

    /**
     * 气泡项处理
     *
     * useBubbleItems 将 parsedMessages 转换为可渲染的气泡项
     * 包含消息内容、样式、操作按钮等
     */
    const { bubbleItems } = useBubbleItems(
      parsedMessages,
      chatId,
      showPlaceholderWhenEmpty,
      stablePlaceholderNode,
      stableSendMessage,
      isEmbedMode
    )

    /**
     * 历史消息分组缓存
     *
     * 使用 ref 缓存已加载的历史消息分组，避免重新计算
     * 每次加载更多历史消息时，新消息会被添加到缓存的开头
     */
    const historyGroupedItems = useRef<(typeof bubbleItems)[]>([])

    /**
     * 首次加载标记
     * 用于区分首次加载和后续更新
     */
    const isFirstLoad = useRef(true)

    /**
     * 默认气泡项（欢迎消息等）
     * 在没有历史消息时显示
     */
    const defaultBubbleItems = useMemo(() => {
      return createBubbleItemsByParsedMessages(createDefaultMessages())
    }, [])

    // ============================================================================
    // 消息分组逻辑
    // ============================================================================

    /**
     * 对消息进行分组
     *
     * 分组策略：
     * 1. 以用户消息为分组界限
     * 2. 每个分组包含：用户消息 + 对应的 AI 回复
     * 3. 缓存历史消息分组，避免重复计算
     * 4. 新消息动态分组，不影响历史缓存
     *
     * 为什么要分组？
     * - 虚拟滚动需要稳定的列表项
     * - 分组可以减少虚拟滚动的计算量
     * - 便于管理消息的展示和动画
     */
    const groupedBubbleItems = useMemo(() => {
      let groups: (typeof bubbleItems)[] = []

      if (!hasMore) {
        // 没有历史消息分页时，默认欢迎消息独立成组用于和预设问句拼接。
        groups = [defaultBubbleItems]
      }

      if (bubbleItems.length === 0) {
        return groups
      }

      if (isFirstLoad.current) {
        // 更新第一组缓存
        historyGroupedItems.current = [bubbleItems]
        // 首次加载，直接将整个 bubbleItems 作为一个组
        groups = [...groups, ...historyGroupedItems.current]
        isFirstLoad.current = false

        return groups
      }

      // 没有历史记录，用户发送第一条消息时的处理，更新第一组缓存
      const isFirst = bubbleItems.filter((i) => i.role === 'user').length === 1 // 判断是否是第一次发送消息
      if (isFirst) {
        historyGroupedItems.current[0] = bubbleItems
        groups = [...groups, ...historyGroupedItems.current]
        return groups
      }

      // 处理已有历史缓存的情况
      let lastIndex: number = -1
      if (historyGroupedItems.current.length > 0) {
        const latestHistoryGroup = historyGroupedItems.current[0] // 最早的历史组（时间最早）
        const nextHistoryGroup = historyGroupedItems.current[historyGroupedItems.current.length - 1] // 最新的历史组（时间最近）

        const firstKey = latestHistoryGroup[0]?.key // 最早历史组的第一条消息 key
        const lastKey = nextHistoryGroup[nextHistoryGroup.length - 1]?.key // 最新历史组的最后一条消息 key

        const firstIndex = bubbleItems.findIndex((i) => i.key === firstKey) // 最早历史组在当前列表中的位置
        lastIndex = bubbleItems.findIndex((i) => i.key === lastKey) // 最新历史组在当前列表中的位置

        // 检查是否有新加载的历史消息（在最早历史组之前）
        const newHistoryGroup = firstIndex > 0 ? bubbleItems.slice(0, firstIndex) : []

        // 有新的分页数据，更新历史缓存组（添加到开头）
        if (newHistoryGroup.length > 0) {
          historyGroupedItems.current = [newHistoryGroup, ...historyGroupedItems.current]
        }
        groups = [...groups, ...historyGroupedItems.current]
      }

      // 对历史缓存之后的新消息进行分组
      // 以用户消息为分组界限，每个分组包含：用户消息 + AI 回复
      let tempGroup: typeof bubbleItems = []
      for (let i = lastIndex + 1; i < bubbleItems.length; i++) {
        const item = bubbleItems[i]
        if (item.role === 'user') {
          // 遇到用户消息，将之前的临时分组保存
          if (tempGroup.length > 0) {
            const newGroup = [...tempGroup]
            groups.push(newGroup)
          }
          // 开始新的分组
          tempGroup = [item]
        } else {
          // AI 消息添加到当前分组
          tempGroup.push(item)
        }
      }
      // 保存最后一个分组
      if (tempGroup.length > 0) {
        const newGroup = [...tempGroup]
        groups.push(newGroup)
      }

      return groups
    }, [bubbleItems, hasMore])

    /**
     * 为每个分组生成稳定的唯一标识符
     *
     * 使用分组中第一条消息的 key 作为分组的唯一标识
     * 这样可以确保虚拟滚动时分组的稳定性
     */
    const groupedBubbleItemsWithKeys = useMemo(() => {
      return groupedBubbleItems.map((group, index) => {
        // 使用分组中第一条消息的key作为该分组的唯一标识符
        const groupKey = String(group[0]?.key || `group-${index}`)

        // VirtualBubbleList 依赖稳定 key 将分组映射到虚拟行，确保滚动测量正确。
        return {
          key: groupKey,
          items: group,
        }
      })
    }, [groupedBubbleItems])

    // ============================================================================
    // 滚动事件处理
    // ============================================================================

    /**
     * 处理滚动到顶部时触发加载更多
     *
     * 当用户滚动到顶部时，自动加载更多历史消息
     * 条件：
     * 1. 还有更多历史消息（hasMore）
     * 2. 当前没有正在加载（!bubbleLoading）
     * 3. 滚动位置在顶部（scrollTop === 0）
     */
    const handleScroll = useCallback(() => {
      if (chatContainerRef.current && hasMore && !bubbleLoading) {
        const { scrollTop } = chatContainerRef.current

        // 当滚动到顶部时触发加载更多
        if (scrollTop === 0) {
          onLoadMore?.()
        }
      }
    }, [hasMore, bubbleLoading, onLoadMore, chatContainerRef])

    // ============================================================================
    // 虚拟滚动
    // ============================================================================

    /**
     * 虚拟滚动配置
     *
     * 使用 @tanstack/react-virtual 实现虚拟滚动
     * 优点：
     * 1. 只渲染可见区域的消息，提升性能
     * 2. 支持动态高度计算
     * 3. 自动处理滚动位置保持
     *
     * @see {@link file:./hooks/useVirtualChat.ts} - 虚拟滚动实现
     */
    const { rowVirtualizer } = useVirtualChat(groupedBubbleItemsWithKeys, chatContainerRef)

    // ============================================================================
    // 渲染：虚拟滚动消息列表
    // ============================================================================
    // 已抽象为独立组件 VirtualBubbleList

    // ============================================================================
    // 渲染：主组件
    // ============================================================================

    return (
      <div className={styles.chat}>
        {/* 加载动画容器 */}
        {/* @ts-expect-error Spin 组件类型定义问题 */}
        <Spin spinning={bubbleLoading} wrapperClassName={styles.spinContainer}>
          {/* 滚动到底部按钮 */}
          <ScrollToBottomButton
            style={{ bottom: '100px', right: '20px' }}
            visible={showScrollBottom}
            onClick={scrollToBottom}
            data-uc-id="JYP1Z6l8fe"
            data-uc-ct="scrolltobottombutton"
          />

          {/* 虚拟滚动消息列表 */}
          <VirtualBubbleList
            chatContainerRef={chatContainerRef}
            rowVirtualizer={rowVirtualizer}
            groupedBubbleItemsWithKeys={groupedBubbleItemsWithKeys}
            roles={roles as RolesTypeCore}
            shouldShowPresetQuestions={shouldShowPresetQuestions}
            presetQuestionsPosition={presetQuestionsPosition}
            handlePresetQuestionClick={handlePresetQuestionClick}
            handleScroll={handleScroll}
          />

          {/* 聊天操作区域（输入框、发送按钮等） */}
          <div className={cn(styles.chatActionsContainer, styles.chatContainerTop)}>
            {isDeveloper ? (
              // 开发者模式：显示模型选择器
              <ChatActions
                placeholder={getChatPlaceholder(parsedMessages, isChating)}
                isLoading={isChating}
                content={content}
                onCancel={cancelRequest}
                handleContentChange={handleContentChange}
                sendMessage={handleSendMessage}
                renderLeftActions={() => {
                  return (
                    <SelectWithIcon
                      value={modelType}
                      suffixIcon={<UpO onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} />}
                      onChange={(value) => {
                        setModelType(value as EModelType)
                      }}
                      dropdownMatchSelectWidth={false}
                      style={{ width: 120 }}
                      options={modeOptions}
                      disabled={isChating}
                    />
                  )
                }}
                data-uc-id="mfcF4yavP-"
                data-uc-ct="chatactions"
              />
            ) : (
              // 普通用户模式：不显示模型选择器
              <ChatActions
                placeholder={getChatPlaceholder(parsedMessages, isChating)}
                isLoading={isChating}
                content={content}
                onCancel={cancelRequest}
                handleContentChange={handleContentChange}
                sendMessage={handleSendMessage}
                data-uc-id="mfcF4yavP-"
                data-uc-ct="chatactions"
              />
            )}
          </div>

          {/* 页脚免责声明 */}
          <div className={styles.footer}>{intlMap.footer}</div>
        </Spin>
      </div>
    )
  }
)

ChatMessageCore.displayName = 'ChatMessageCore'

export default ChatMessageCore
