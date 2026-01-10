import cn from 'classnames'
import { FC } from 'react'
import styles from './index.module.less'

export interface ProvidedByAIProps {
  /** 是否显示标识 */
  visible?: boolean
  className?: string
  style?: React.CSSProperties
}

/**
 * AI 翻译标识组件
 *
 * @description 用于标识内容由 AI 翻译提供，符合无障碍规范
 */
export const ProvidedByAI: FC<ProvidedByAIProps> = ({ visible = true, className, style }) => {
  if (!visible) return null

  return (
    <small className={cn(styles['provided-by-ai'], className)} style={style} aria-label="Provided by AI">
      Provided by AI
    </small>
  )
}
