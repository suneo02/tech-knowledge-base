import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { useIntl } from '../IntlEnsure'
import styles from './index.module.less'

export interface TextExpandableProps {
  /** 最大显示行数 */
  maxLines: number
  /** 要显示的文本内容 */
  content: string
}

/**
 * 可展开的文本组件
 * 当文本超过指定行数时，显示展开/收起按钮
 */
export const TextExpandable: React.FC<TextExpandableProps> = ({ maxLines, content }) => {
  const t = useIntl()
  const [expanded, setExpanded] = useState(false)
  const [scrollHeight, setScrollHeight] = useState<number | null>(null)
  const [clientHeight, setClientHeight] = useState<number | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // 初次渲染时测量一次
  useEffect(() => {
    if (!contentRef.current) return
    const el = contentRef.current
    setScrollHeight(el.scrollHeight)
    setClientHeight(el.clientHeight)
  }, [])

  const toggleExpand = () => {
    setExpanded(!expanded)
  }
  // 当内容或最大行数变化时，重新测量；仅在折叠态下更新 clientHeight，避免展开态误判
  useEffect(() => {
    if (!contentRef.current) return
    const el = contentRef.current
    setScrollHeight(el.scrollHeight)
    if (!expanded) {
      setClientHeight(el.clientHeight)
    }
  }, [content, maxLines, expanded])
  const enableExpand = scrollHeight !== null && scrollHeight > (clientHeight || 0)
  return (
    <div className={styles.containerSafari}>
      <div ref={contentRef} className={styles.content} style={{ WebkitLineClamp: expanded ? undefined : maxLines }}>
        {enableExpand && !expanded && (
          <span
            className={classNames(styles.btn, styles['btn--open'])}
            onClick={toggleExpand}
            data-uc-id="_B8qb43EExX"
            data-uc-ct="span"
          >
            {t('28912')}
          </span>
        )}
        {content}
        {enableExpand && expanded && (
          <span className={styles.btn} onClick={toggleExpand} data-uc-id="MZhtv11I7Lp" data-uc-ct="span">
            {t('119102')}
          </span>
        )}
      </div>
    </div>
  )
}
