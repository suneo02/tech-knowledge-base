import { useChatRoomSuperContext } from '@/contexts/ChatRoom/super'
import { useAddConversation } from '@/hooks/useAddConversation'
import { PromptsProps } from '@ant-design/x'
import { useResponsive } from 'ahooks'
import { PlaceholderPromptsComp, PromptsSection, usePresetQuestionSuperContext } from 'ai-ui'
import { message } from 'antd'
import { ApiCodeForWfc, SuperListPresetQuestion } from 'gel-api'
// import { WelcomeSectionSuper } from 'gel-ui'
import { useNavigateWithLangSource } from '@/hooks/useLangSource'
import styles from './style/super.module.less'

/**
 * 增强版提示占位组件
 * 使用增强版上下文，提供更丰富的问题展示和处理
 */
export const PlaceholderSuper: PlaceholderPromptsComp = ({ handleSendPresetMsg }) => {
  const navigate = useNavigateWithLangSource()
  const responsive = useResponsive()
  const { chatId } = useChatRoomSuperContext()
  const { chatQuestions } = usePresetQuestionSuperContext()

  // Use the custom hook for adding conversations
  const { addConversation } = useAddConversation({
    isManual: true,
    // Provide custom onSuccess for navigation
    onSuccess: (data) => {
      if (data?.ErrorCode === ApiCodeForWfc.SUCCESS && data?.Data?.data?.conversationId) {
        message.success('创建会话成功') // Show success message here as default is overridden
        navigate(`/super/chat/${data.Data.data.conversationId}`)
      } else {
        message.error(data?.ErrorMessage || '创建会话失败') // Handle error message here as default is overridden
      }
    },
  })

  const handleItemClick: PromptsProps['onItemClick'] = ({ data }) => {
    const { rawSentenceId, rawSentence } = data as unknown as { rawSentenceId: string; rawSentence: string }
    // If chatId doesn't exist, add a new conversation based on the preset question
    if (!chatId) {
      addConversation({
        conversationType: 'PRESET_QUESTION',
        rawSentenceID: rawSentenceId,
      })
    } else {
      // Otherwise, send the preset message in the current chat
      // @ts-expect-error ttt
      handleSendPresetMsg(rawSentence)
    }
  }

  // 增强版使用更丰富的描述
  const getDescriptionText = (question: SuperListPresetQuestion): string => {
    // 优先使用详细描述，其次使用问题文本
    return question.rawSentence || ''
  }

  const getOtherParams = (question: SuperListPresetQuestion) => {
    return {
      rawSentenceId: question.rawSentenceID,
      rawSentence: question.rawSentence,
    }
  }

  return (
    <Space className={styles['super-placeholder']} direction="vertical" size={16}>
      {/* <WelcomeSectionSuper isLargeScreen={responsive.lg} /> */}
      <PromptsSection
        // @ts-expect-error 类型错误
        onItemClick={handleItemClick}
        questions={chatQuestions}
        getDescriptionText={getDescriptionText}
        getOtherParams={getOtherParams}
        isLargeScreen={responsive.lg}
      />
    </Space>
  )
}
