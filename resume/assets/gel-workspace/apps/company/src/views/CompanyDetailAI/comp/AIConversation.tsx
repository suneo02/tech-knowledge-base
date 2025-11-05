import React from 'react'
import ChatUI from './ChatUI'
import useChatLogic from '../hooks/useChatLogic'
import { useSelector } from 'react-redux'
import { IState } from '../../../reducers/type'
/**
 * AIConversation Props接口
 */
interface AIConversationProps {
  entityName?: string
  entityType?: string
}

/**
 * AI对话业务逻辑组件
 * 负责集成聊天逻辑和UI，并向上提供一个简单接口
 */
const AIConversation: React.FC<AIConversationProps> = () => {
  // 从 Redux 获取公司基本信息
  const companyState = useSelector((state: IState) => state.company)
  const { corp_name } = companyState?.baseInfo || {}
  const entityName = corp_name || ''
  const entityType = 'company'
  // 使用自定义Hook管理聊天逻辑
  const { messages, inputValue, isLoading, setInputValue, sendMessage } = useChatLogic(entityName, entityType)

  // 处理输入改变
  const handleInputChange = (value: string) => {
    setInputValue(value)
  }

  return (
    <ChatUI
      messages={messages}
      inputValue={inputValue}
      isLoading={isLoading}
      onInputChange={handleInputChange}
      onSend={sendMessage}
    />
  )
}

export default AIConversation
