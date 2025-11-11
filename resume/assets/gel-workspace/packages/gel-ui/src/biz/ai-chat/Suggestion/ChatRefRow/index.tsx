import { Typography } from 'antd'
import { default as classNames } from 'classnames'
import dayjs from 'dayjs'
import { RAGType } from 'gel-api'
import { RefTag } from '../RefTag'
import styles from './refItem.module.less'

const { Text } = Typography

export interface ChatRefRowProps {
  /** 标题文本 */
  text: string
  /** 标签文本 */
  tagText: string
  /** 标签类型，用于样式 */
  tagType: RAGType | 'Data'
  /** 站点名称 */
  sitename?: string
  /** 日期 */
  publishdate?: string
  /** 是否可以跳转 */
  canJump?: boolean
  /** 自定义类名 */
  className?: string
  /** 点击事件处理 */
  onClick?: () => void
  /** URL数据属性 */
  dataUrl?: string
}

export const ChatRefRow = ({
  text,
  tagText,
  tagType,
  sitename,
  publishdate,
  canJump,
  className,
  onClick,
  dataUrl,
}: ChatRefRowProps) => {
  let formattedDate = ''
  try {
    formattedDate = publishdate ? dayjs(publishdate).format('YYYY-MM-DD') : ''
  } catch (e) {
    formattedDate = ''
  }
  return (
    <div className={classNames(styles.itemBody, className)}>
      <RefTag tagType={tagType} tagText={tagText} size="small" className={styles['ref-tag']} type="secondary" />
      <div className={classNames(styles.titleWrapper)} data-url={dataUrl} onClick={onClick}>
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
