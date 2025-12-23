import type { ComponentProps, ReactNode } from 'react'

import { SuggestionItem } from '@ant-design/x/es/suggestion'
import { AgentIdentifiers, DeepSearchSignal, ChatThinkSignal } from 'gel-api'
import { ChatSenderFooter } from 'gel-ui'
type ChatSenderFooterPropsFromLib = ComponentProps<typeof ChatSenderFooter>

// type SuggestionItems = GetProp<typeof Suggestion, 'items'>
// 聊天功能共享的 Props 接口
export interface ChatActionSharedProps {
  className?: string
  isLoading: boolean
  content: string
  placeholder: string
  onCancel: () => void
  handleContentChange: (value: string) => void
  sendMessage: (
    message: string,
    agentId?: AgentIdentifiers['agentId'],
    think?: ChatThinkSignal['think'],
    deepSearch?: DeepSearchSignal['deepSearch']
  ) => void
}

// ChatSender 组件的 Props 接口
export interface ChatSenderProps
  extends ChatActionSharedProps,
    // 使用更通用的方案来处理自定义操作
    Partial<Pick<ChatSenderFooterPropsFromLib, 'renderLeftActions' | 'renderRightActions'>> {
  headerNode?: ReactNode // 添加可选的 headerNode prop
  suggestions?: SuggestionItem[]
  deepSearch?: 1 // 深度检索功能
  focus?: boolean
  maxLength?: number
}

// ChatActions 组件的 Props 接口
export interface ChatActionsProps
  extends ChatActionSharedProps,
    Partial<Pick<ChatSenderFooterPropsFromLib, 'renderLeftActions' | 'renderRightActions'>> {
  senderClassName?: string
  suggestions?: SuggestionItem[]
  focus?: boolean
  maxLength?: number
  // deepSearch?: 1 // 深度检索功能
}
