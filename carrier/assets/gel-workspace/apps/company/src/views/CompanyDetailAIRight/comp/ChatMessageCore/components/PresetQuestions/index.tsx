import { request, WIND_CHAT_URL } from '@/api/request'
import { useRequest } from 'ahooks'
import { ChatQuestion } from 'gel-api'
import { intl } from 'gel-util/intl'
import React, { memo, useState } from 'react'
import styles from './PresetQuestions.module.less'

// ============================================================================
// Types
// ============================================================================

interface PresetQuestionsProps {
  /** 展示位置：welcome-欢迎消息下方，after-history-历史消息后 */
  position: 'welcome' | 'after-history'
  /** 点击问句回调 */
  onSend: (message: string) => void
}

interface QuestionItemProps {
  question: ChatQuestion
  index: number
  onSend: (message: string) => void
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * usePresetQuestionsData - 加载预设问句数据
 *
 * 职责：
 * 1. 调用 getQuestion API 获取预设问句（pageSize=3）
 * 2. 返回前 3 条问句
 * 3. 处理加载和错误状态
 */
const usePresetQuestionsData = () => {
  const { data, loading } = useRequest(
    async () => {
      const res = await request('getQuestion', {
        serverUrl: WIND_CHAT_URL,
        noExtra: true,
        formType: 'payload',
        noHashParams: true,
        params: {
          pageSize: 3, // 获取 3 条问句
          questionsPlatform: 'windEntCorpDetail',
        },
      })
      return (res.Data || []) as ChatQuestion[]
    },
    {
      onError: (err) => {
        console.error('Failed to fetch preset questions:', err)
        // 错误降级：不阻塞主流程
      },
    }
  )

  return { displayQuestions: data || [], loading }
}

// ============================================================================
// Utils
// ============================================================================

/**
 * getQuestionIcon - 获取问句图标
 *
 * 参考 PlaceholderBase 的实现，支持普通图标和悬停图标
 *
 * @param question - 问句数据
 * @param isHovering - 是否处于悬停状态
 * @returns 图标 React 节点
 */
const getQuestionIcon = (question: ChatQuestion, isHovering: boolean): React.ReactNode => {
  if (!question || !question.questionsIcon) return null

  // 将SVG字符串转换为data URL
  const svgString = question.questionsIcon
  const encodedSvg = encodeURIComponent(svgString)
  const normalIconUrl = `data:image/svg+xml;charset=utf-8,${encodedSvg}`

  // 检查是否有悬停图标
  const extendedQuestion = question as ChatQuestion & { questionsIconHover?: string }
  const hoverIconUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(extendedQuestion.questionsIconHover || svgString)}`

  const style: React.CSSProperties = {
    width: '20px',
    height: '20px',
    backgroundImage: `url("${isHovering ? hoverIconUrl : normalIconUrl}")`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  }

  return <div className={styles.questionIcon} style={style} />
}

// ============================================================================
// Components
// ============================================================================

/**
 * QuestionItem - 问句项组件
 *
 * 职责：
 * 1. 渲染单个问句项
 * 2. 管理悬停状态以切换图标
 * 3. 处理点击事件
 */
const QuestionItem: React.FC<QuestionItemProps> = memo(({ question, index, onSend }) => {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div
      className={styles.questionItem}
      onClick={() => onSend(question.questions)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      data-uc-id="preset-question"
      data-uc-ct="div"
      data-uc-x={index}
    >
      {getQuestionIcon(question, isHovering)}
      <span className={styles.questionText}>{question.questions}</span>
    </div>
  )
})

QuestionItem.displayName = 'QuestionItem'

/**
 * PresetQuestions - 预设问句组件
 *
 * 职责：
 * 1. 组件挂载时调用 getQuestion API（questionsType=1, pageSize=3）
 * 2. 展示返回的 3 条问句
 * 3. 渲染问句列表，after-history 位置时添加分割线
 * 4. 点击问句时调用 onSend 回调
 * 5. 错误时降级为空状态，不阻塞主流程
 *
 * @see {@link file:../../hooks/usePresetQuestionsVisible.ts} - 展示判定 Hook
 * @see {@link file:../../../../../docs/specs/chat-message-core-preset-questions/spec-design-v1.md} - 设计文档
 */
export const PresetQuestions: React.FC<PresetQuestionsProps> = memo(({ position, onSend }) => {
  const { displayQuestions, loading } = usePresetQuestionsData()

  // 加载中或无数据时不渲染
  if (loading || displayQuestions.length === 0) {
    return null
  }

  const isAfterHistory = position === 'after-history'

  return (
    <div className={styles.presetQuestions}>
      {isAfterHistory && (
        <>
          <div className={styles.divider}>
            <span className={styles.dividerText}>{intl('472975', '继续对话')}</span>
          </div>
          <div className={styles.subtitle}>{intl('472976', '欢迎回来，您希望了解那些更多内容？')}</div>
        </>
      )}
      <div className={styles.title}>{intl('472974', '您可以试试这样问')}</div>
      <div className={styles.questionsContainer}>
        {displayQuestions.map((question, index) => (
          <QuestionItem key={`${question.questions}-${index}`} question={question} index={index} onSend={onSend} />
        ))}
      </div>
    </div>
  )
})

PresetQuestions.displayName = 'PresetQuestions'
