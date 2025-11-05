import classNames from 'classnames'
import styles from './RefTag.module.less'
import { Tag } from '@wind/wind-ui'
import { QueryReferenceSuggestType } from 'gel-api'

interface RefTagProps {
  tagType: QueryReferenceSuggestType
  tagText: string
  [key: string]: unknown
}

export const RefTag = ({ tagType, tagText, className, ...props }: RefTagProps) => {
  const isEn = (window as any).en_access_config
  return (
    <>
      {/* @ts-expect-error Tag组件类型声明与实际使用方式不一致，但功能正常 */}
      <Tag className={classNames(styles.tag, styles[`color${tagType}`], className, isEn && styles.en)} {...props}>
        {tagText}
      </Tag>
    </>
  )
}
