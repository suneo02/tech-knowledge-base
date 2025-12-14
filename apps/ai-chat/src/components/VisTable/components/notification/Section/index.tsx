import styles from './index.module.less'
import { useState } from 'react'
import { UpO, DownO } from '@wind/icons'

const PREFIX = 'section'

interface SectionProps {
  title: React.ReactNode
  children: React.ReactNode
  defaultExpanded?: boolean
}
/**
 * 折叠组件
 */
const Section: React.FC<SectionProps> = ({ title, children, defaultExpanded = false }: SectionProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded)
  return (
    <div className={styles[`${PREFIX}-container`]}>
      <div className={styles[`${PREFIX}-header`]} onClick={() => setExpanded(!expanded)}>
        <div className={styles[`${PREFIX}-title`]}>{title}</div>
        {/* @ts-expect-error wind-icon */}
        <div className={styles[`${PREFIX}-icon`]}>{expanded ? <UpO /> : <DownO />}</div>
      </div>
      <div
        className={`${styles[`${PREFIX}-content`]} ${expanded ? 'expanded' : 'collapsed'}`}
        style={{ maxHeight: expanded ? 2400 : 0 }}
      >
        {children}
      </div>
    </div>
  )
}
export default Section
