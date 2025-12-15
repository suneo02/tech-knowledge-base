import { Tag } from '@wind/wind-ui'
import classNames from 'classnames'
import { RAGType } from 'gel-api'
import { isEn } from 'gel-util/intl'
import styles from './RefTag.module.less'

interface RefTagProps {
  tagType: RAGType | 'Data' | 'file'
  tagText: string
  [key: string]: unknown
}

export const RefTag = ({ tagType, tagText, className, ...props }: RefTagProps) => {
  return (
    <Tag
      className={classNames([styles.tag, styles[`color${tagType}`], className, { [styles.en]: isEn() }])}
      {...props}
    >
      {tagText}
    </Tag>
  )
}
