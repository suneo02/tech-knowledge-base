import classNames from 'classnames'
import { FC } from 'react'

import styles from './index.module.less'

export const SuperListGradientText: FC<{
  className?: string
  children: React.ReactNode
}> = ({ className, children }) => {
  return <span className={classNames(styles.gradientText, className)}>{children}</span>
}
