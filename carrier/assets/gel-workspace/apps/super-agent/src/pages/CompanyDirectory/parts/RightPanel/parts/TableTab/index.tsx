import { useSize } from 'ahooks'
import { t } from 'gel-util/locales'
import { useRef, useState } from 'react'
import { DataTable } from '../../../DataTable'
import type { BasicColumn, BasicRecord } from '../../../DataTable/types'
import { SearchToolbar } from '../../../SearchToolbar'
import styles from './index.module.less'

const STRINGS = {
  EXPAND_ALL: t('table.expandAll', '全部展开'),
  COLLAPSE_ALL: t('table.collapseAll', '全部收起'),
} as const

const PREFIX = 'company-directory-table-tab'

export interface TableTabProps {
  columns: BasicColumn[]
  columnsLoading: boolean
  selectedId?: number
  dataSource: BasicRecord[]
}

export const TableTab: React.FC<TableTabProps> = (props) => {
  const { columns, columnsLoading, dataSource } = props
  const wrapRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const wrapSize = useSize(wrapRef)
  const topSize = useSize(topRef)
  const height = Math.max(0, (wrapSize?.height ?? 0) - (topSize?.height ?? 0))
  const [expandAll, setExpandAll] = useState(false)
  const [search, setSearch] = useState('')

  return (
    <div ref={wrapRef} className={`${styles[`${PREFIX}-container`]}`}>
      <div ref={topRef} className={`${styles[`${PREFIX}-top`]}`}>
        <SearchToolbar
          value={search}
          onChange={setSearch}
          onExpandAll={() => setExpandAll((v) => !v)}
          expandButtonText={expandAll ? STRINGS.COLLAPSE_ALL : STRINGS.EXPAND_ALL}
        />
        <div className={`${styles[`${PREFIX}-top-divider`]}`} />
      </div>
      <div className={`${styles[`${PREFIX}-tableWrap`]}`}>
        <DataTable
          columns={columns}
          dataSource={dataSource}
          loading={columnsLoading}
          height={height - 100}
          expandAll={expandAll}
        />
      </div>
    </div>
  )
}

export default TableTab
