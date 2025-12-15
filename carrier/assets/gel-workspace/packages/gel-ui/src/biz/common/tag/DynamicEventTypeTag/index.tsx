import { getPublicSentimentTagColorAndType } from 'gel-util/biz'
import { FC, ReactNode } from 'react'
import './index.less'

/**
 * 动态和商机的tag
 * @param {*} param0
 * @returns
 */
export const CorpDetailDynamicEventTypeTag: FC<{
  content: ReactNode
}> = ({ content }) => {
  return <span className="dynamic-event-type-tag">{content}</span>
}

/**
 * 舆情的tag
 * @param {*} param0
 * @returns
 */
export const CorpDetailPublicSentimentTag: FC<{
  content: ReactNode
  emotion?: string
  level?: number
}> = ({ content, emotion, level }) => {
  const { color } = getPublicSentimentTagColorAndType(emotion, level)
  return <span className={`dynamic-event-type-tag tag-${color}`}>{content}</span>
}
