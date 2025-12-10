import classNames from 'classnames'
import { FC } from 'react'
import styles from './index.module.less'

export const TableComment: FC<{
  content: string
  className?: string
}> = ({ content, className }) => {
  return <div className={classNames(styles['table-comment'], className)}>{content}</div>
}
