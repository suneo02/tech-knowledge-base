import { Typography } from 'antd'
import { default as classNames } from 'classnames'
import dayjs from 'dayjs'
import styles from './refItem.module.less'
import { RefTag } from './RefTag/RefTag'
import { QueryReferenceSuggestType } from 'gel-api'

const { Text } = Typography

export interface RefItemCommonProps {
  /** 标题文本 */
  text: string
  /** 标签文本 */
  tagText: string
  /** 标签类型，用于样式 */
  tagType: QueryReferenceSuggestType
  /** 站点名称 */
  sitename?: string
  /** 日期 */
  publishdate?: string
  /** 是否可以跳转 */
  canJump?: boolean
  /** 自定义类名 */
  className?: string
  /** 点击事件处理 */
  onItemClick?: () => void
  /** URL数据属性 */
  dataUrl?: string
}

export const RefItemCommon = ({
  text,
  tagText,
  tagType,
  sitename,
  publishdate,
  canJump,
  className,
  onItemClick,
  dataUrl,
}: RefItemCommonProps) => {
  let formattedDate = ''
  try {
    formattedDate = publishdate ? dayjs(publishdate).format('YYYY-MM-DD') : ''
  } catch (e) {
    formattedDate = ''
  }
  return (
    <div className={classNames(styles.itemBody, className)}>
      <RefTag tagType={tagType} tagText={tagText} size="small" className={styles['ref-tag']} type="secondary" />
      <div className={classNames(styles.titleWrapper)} data-url={dataUrl} onClick={onItemClick}>
        <Text
          ellipsis={{
            tooltip: text,
          }}
          className={classNames(styles.title, {
            [styles.titleCanJump]: canJump,
          })}
        >
          {text}
        </Text>
      </div>
      {sitename && (
        <div className={styles.sitename}>
          <Text>{sitename}</Text>
        </div>
      )}
      {formattedDate && (
        <div className={styles.time}>
          <Text>{formattedDate}</Text>
        </div>
      )}
    </div>
  )
}
