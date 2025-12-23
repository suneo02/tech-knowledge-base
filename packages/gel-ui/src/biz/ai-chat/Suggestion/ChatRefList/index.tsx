import { AxiosInstance } from 'axios'
import classNames from 'classnames'
import { WithDPUList, WithRAGList } from 'gel-api'
import { FC } from 'react'
import { ChatDPUItem } from '../ChatDPUItem'
import { ChatRAGItem } from '../ChatRAGItem'
import styles from './index.module.less'

export interface ChatRefListProps extends WithDPUList, WithRAGList {
  className?: string
  style?: React.CSSProperties
  isDev: boolean
  wsid: string
  entWebAxiosInstance: AxiosInstance
  onModalClose?: () => void
  onModalOpen?: () => void
}

export const ChatRefList: FC<ChatRefListProps> = ({
  className,
  style,
  dpuList,
  ragList,
  isDev,
  wsid,
  entWebAxiosInstance,
  onModalClose,
  onModalOpen,
}) => {
  return (
    <div className={classNames(styles.chatChatRefList, className)} style={style}>
      {!!dpuList?.length &&
        dpuList?.map((item, index) => (
          <ChatDPUItem
            key={`${item.id}-${index}`}
            className={styles.item}
            data={item}
            onModalClose={onModalClose}
            onModalOpen={onModalOpen}
          />
        ))}
      {!!ragList?.length &&
        ragList.map((item, index) => (
          <ChatRAGItem
            key={`${item.windcode}-${index}`}
            className={styles.item}
            data={item}
            isDev={isDev}
            wsid={wsid}
            entWebAxiosInstance={entWebAxiosInstance}
          />
        ))}
    </div>
  )
}
