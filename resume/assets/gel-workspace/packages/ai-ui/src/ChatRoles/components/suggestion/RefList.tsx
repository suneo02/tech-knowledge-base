import { ENTITY_TYPE_EXTEND } from '@/constants'
import { Collapse } from '@wind/wind-ui'
import { AxiosInstance } from 'axios'
import { QueryReferenceSuggest, RefTableData } from 'gel-api'
import { isEn, t } from 'gel-util/intl'
import { FC, useMemo } from 'react'
import { RefItemMisc } from './RefItemMisc'
import { RefItemTable } from './RefTable'
import styles from './style/refList.module.less'

interface ChatReferenceProps {
  suggest?: QueryReferenceSuggest[]
  table?: RefTableData[]
  transLang?: string
  isDev: boolean
  wsid: string
  entWebAxiosInstance: AxiosInstance
}

export const ChatRefList: FC<ChatReferenceProps> = ({ suggest = [], table, isDev, wsid, entWebAxiosInstance }) => {
  const filterSuggest = suggest.filter((item) => Object.values(ENTITY_TYPE_EXTEND).includes(item.type))
  const refLength = useMemo(() => {
    try {
      return (filterSuggest?.length ?? 0) + (table?.length ?? 0)
    } catch {
      return 0
    }
  }, [filterSuggest, table])
  return refLength ? (
    // @ts-expect-error wind-ui 组件类型定义问题
    <Collapse
      // ghost
      // expandIconPosition="right"
      className={styles.chatRefListCollapse}
    >
      {/* @ts-expect-error wind-ui 组件类型定义问题 */}
      <Collapse.Panel
        header={
          isEn() ? t('421471', '以上问答参考了如下资料') : t('', '参考了 % 篇资料').replace('%', refLength.toString())
        }
        key="1"
      >
        <div className={styles.chatReferenceList}>
          {!!table?.length &&
            table?.map((item, index) => (
              <RefItemTable key={`${item.id}-${index}`} className={styles.item} data={item} />
            ))}
          {!!filterSuggest?.length &&
            filterSuggest.map((item, index) => (
              <RefItemMisc
                key={`${item.windcode}-${index}`}
                className={styles.item}
                data={item}
                isDev={isDev}
                wsid={wsid}
                entWebAxiosInstance={entWebAxiosInstance}
              />
            ))}
        </div>
      </Collapse.Panel>
    </Collapse>
  ) : null
}
