import { useEmbedMode, usePresetQuestionBaseContext } from '@/context'
import { useResponsive } from 'ahooks'
import { Space } from 'antd'
import { ChatQuestion } from 'gel-api'
import React from 'react'
import { WelcomeSection } from '../Welcome'
import { PromptsSection } from './PromptsSection'
import styles from './style/base.module.less'
import promptsSectionStyles from './style/promptsSection.module.less'
import { PlaceholderPromptsComp } from './type'

/**
 * 基础版提示占位组件
 * 使用基础版上下文，简单地显示问题和图标
 */
export const PlaceholderBase: PlaceholderPromptsComp = ({ handleSendPresetMsg }) => {
  const responsive = useResponsive()
  const { chatQuestions } = usePresetQuestionBaseContext()

  const { isEmbedMode = false } = useEmbedMode()
  // 基础版本简单地使用问题文本
  const getDescriptionText = (question: ChatQuestion): string => {
    return question.questions || ''
  }

  // 基础版本直接使用图标
  const getIcon = (question: ChatQuestion, isHovering: boolean): React.ReactNode => {
    if (!question || !question.questionsIcon) return null

    // 将SVG字符串转换为data URL
    const svgString = question.questionsIcon
    const encodedSvg = encodeURIComponent(svgString)
    const normalIconUrl = `data:image/svg+xml;charset=utf-8,${encodedSvg}`

    // 检查是否有悬停图标
    const extendedQuestion = question as ChatQuestion & { questionsIconHover?: string }

    const hoverIconUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(extendedQuestion.questionsIconHover || svgString)}`

    const style: React.CSSProperties = {
      width: '24px',
      height: '24px',
      backgroundImage: `url("${isHovering ? hoverIconUrl : normalIconUrl}")`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    }

    return <div className={promptsSectionStyles['prompt-icon']} style={style} />
  }

  const handleItemClick = ({ data }: { data: ChatQuestion }) => {
    handleSendPresetMsg(data.questions)
  }

  const getOtherParams = (question: ChatQuestion) => {
    return { ...question }
  }
  return (
    <Space
      className={styles['placeholder']}
      style={{ paddingTop: isEmbedMode ? '0' : '32px' }}
      direction="vertical"
      size={16}
    >
      <WelcomeSection isLargeScreen={responsive.lg} size={isEmbedMode ? 'small' : 'normal'} />
      <PromptsSection
        onItemClick={handleItemClick}
        questions={chatQuestions}
        getDescriptionText={getDescriptionText}
        getIcon={getIcon}
        getOtherParams={getOtherParams}
        isLargeScreen={responsive.lg}
      />
    </Space>
  )
}
