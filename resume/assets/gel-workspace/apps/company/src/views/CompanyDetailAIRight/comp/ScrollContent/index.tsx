import React from 'react'
import styles from './index.module.less'

const PREFIX = 'scroll'

export const Content = ({
  children,
  className,
  onScroll,
}: {
  children: React.ReactNode
  className?: string
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void
}) => {
  return (
    <div className={`${styles[`${PREFIX}-container`]} ${className}`} onScroll={onScroll}>
      <div className={`${styles[`${PREFIX}-container-content`]}`}>{children}</div>
    </div>
  )
}
