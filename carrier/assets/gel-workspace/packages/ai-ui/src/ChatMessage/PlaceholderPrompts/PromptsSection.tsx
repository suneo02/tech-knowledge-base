import { BasePromptItem } from '@ant-design/x/es/prompts'
import { Space } from 'antd'
import { AgentIdentifiers } from 'gel-api'
import { t } from 'gel-util/intl'
import React, { useMemo, useState } from 'react'
import styles from './style/promptsSection.module.less'

const renderTitle = (icon: React.ReactElement, title: string) => (
  <Space align="start">
    {icon}
    <span style={{ fontSize: 14, color: '#999' }}>{title}</span>
  </Space>
)

type BasePlaceholderPromptItem = BasePromptItem & AgentIdentifiers

type PlaceholderPromptItems = BasePlaceholderPromptItem & {
  children: BasePlaceholderPromptItem[]
}

export interface PromptsSectionProps<T> {
  /** 点击问题时的回调 */
  onItemClick: (data: { data: T }) => void
  /** 问题列表 */
  questions: T[]
  /** 自定义处理描述文本的方法 */
  getDescriptionText: (question: T) => string
  /** 自定义处理图标的方法 */
  getIcon?: (question: T, isHovering: boolean) => React.ReactNode
  /** 自定义处理添加其他参数的方法 */
  getOtherParams?: (question: T) => Record<string, unknown>
  /** 是否为大屏幕 */
  isLargeScreen: boolean
}

export const PromptsSection = <T,>({
  onItemClick,
  questions,
  getDescriptionText,
  getIcon,
  getOtherParams,
}: PromptsSectionProps<T>) => {
  const placeholderPromptsItems = useMemo<PlaceholderPromptItems[]>(() => {
    if (questions.length === 0) return []
    return [
      {
        key: '1',
        label: renderTitle(<></>, t('424257', '您可以试试这样问')),
        children: questions.map((question, index) => ({
          key: `1-${index + 1}`,
          description: getDescriptionText(question),
          ...getOtherParams?.(question),
        })),
      },
    ]
  }, [questions, getDescriptionText, getIcon, getOtherParams])

  const PromptItem = ({ child }) => {
    const [isHovering, setIsHovering] = useState(false)
    return (
      <div
        key={child.key}
        className={styles['placeholder-prompts-item-subItem']}
        onClick={() =>
          onItemClick?.({
            data: child as T,
          })
        }
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className={styles['placeholder-prompts-item-subItem-icon']}>{getIcon?.(child as T, isHovering)}</div>
        <div className={styles['placeholder-prompts-item-subItem-description']}>{child.description}</div>
      </div>
    )
  }

  return (
    <>
      <div className={styles['placeholder-prompts-section']}>
        {placeholderPromptsItems.map((item) => (
          <div key={item.key} className={styles['placeholder-prompts-item']}>
            <div className={styles['placeholder-prompts-item-label']}>{item.label}</div>
            <div className={styles['placeholder-prompts']}>
              {item.children.map((child) => (
                <PromptItem key={child.key} child={child} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
