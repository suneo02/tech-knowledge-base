import { ReactNode } from 'react'

import { MessageRawCore } from '@/types'
import { SuggestionItem } from '@ant-design/x/es/suggestion'

// type SuggestionItems = GetProp<typeof Suggestion, 'items'>
// 聊天功能共享的 Props 接口
export interface ChatActionSharedProps {
  className?: string
  isLoading: boolean
  content: string
  placeholder: string
  onCancel: () => void
  handleContentChange: (value: string) => void
  sendMessage: (message: string, agentId?: MessageRawCore['agentId'], think?: MessageRawCore['think']) => void
}

// ChatSender 组件的 Props 接口
export interface ChatSenderProps extends ChatActionSharedProps {
  deepthink?: boolean
  headerNode?: ReactNode // 添加可选的 headerNode prop
  suggestions?: SuggestionItem[]
}

// ChatActions 组件的 Props 接口
export interface ChatActionsProps extends ChatActionSharedProps {
  deepthink: boolean // 注意这里必须有值，所以不是可选的
  setDeepthink: (deepthink: boolean) => void
  senderClassName?: string
}
