import { Collapse } from '@wind/wind-ui'
import { AxiosInstance } from 'axios'
import classNames from 'classnames'
import { WithDPUList, WithRAGList } from 'gel-api'
import { COLLAPSE_EXPAND_EVENT, VALID_CHAT_SUGGEST_SOURCE_TYPES } from 'gel-util/common'
import { isEn, t } from 'gel-util/intl'
import { FC, useMemo, useRef } from 'react'
import { ChatRefList } from '../ChatRefList'
import styles from './index.module.less'

interface ChatReferenceProps extends WithDPUList, WithRAGList {
  className?: string
  style?: React.CSSProperties
  transLang?: string
  isDev: boolean
  wsid: string
  entWebAxiosInstance: AxiosInstance
  // 针对弹窗的通用解决方案
  onModalClose?: () => void
  onModalOpen?: () => void
}

export const ChatRefCollapse: FC<ChatReferenceProps> = ({
  className,
  style,
  dpuList = [],
  ragList = [],
  isDev,
  wsid,
  entWebAxiosInstance,
  onModalClose,
  onModalOpen,
}) => {
  const filterSuggest = ragList.filter((item) => VALID_CHAT_SUGGEST_SOURCE_TYPES.includes(item.type))
  const refLength = useMemo(() => {
    try {
      return (filterSuggest?.length ?? 0) + (dpuList?.length ?? 0)
    } catch {
      return 0
    }
  }, [filterSuggest, dpuList])

  // 生成唯一的 class 名称
  const collapseClassRef = useRef<string>(`collapse-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)

  // 处理 Collapse 展开/收起事件
  const handleCollapseChange = (expandedKeys: string | string[]) => {
    const keys = Array.isArray(expandedKeys) ? expandedKeys : [expandedKeys]

    // 检查是否有任何 Panel 被展开
    const hasExpandedPanel = keys.length > 0

    // 无论是展开还是收起，都触发全局事件，通知虚拟滚动重新测量

    window.dispatchEvent(
      new CustomEvent(COLLAPSE_EXPAND_EVENT, {
        detail: {
          expandedKeys: keys,
          hasExpandedPanel,
          panelCount: refLength,
          collapseClass: collapseClassRef.current, // 传递唯一的 class 名称
        },
      })
    )
  }

  return refLength ? (
    <Collapse
      className={classNames(styles.ChatRefCollapseCollapse, collapseClassRef.current, className)}
      style={style}
      onChange={handleCollapseChange}
    >
      <Collapse.Panel
        header={
          isEn() ? t('421471', '以上问答参考了如下资料') : t('', '参考了 % 篇资料').replace('%', refLength.toString())
        }
        key="1"
      >
        <ChatRefList
          dpuList={dpuList || []}
          ragList={filterSuggest}
          isDev={isDev}
          wsid={wsid}
          entWebAxiosInstance={entWebAxiosInstance}
          onModalClose={onModalClose}
          onModalOpen={onModalOpen}
        />
      </Collapse.Panel>
    </Collapse>
  ) : null
}
