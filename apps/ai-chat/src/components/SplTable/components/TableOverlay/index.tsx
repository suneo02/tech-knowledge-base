import { CoinsIcon } from '@/assets/icon'
import { Divider } from '@wind/wind-ui'
import { t } from 'gel-util/intl'
import { FC } from 'react'
import { InsertTableButton } from '../InsertTableButton'
import styles from './index.module.less'

const PREFIX = 'spl-table-overlay'
const STRINGS = {
  SHOW_ROWS: (total: number) => t('464111', '展示10条数据，查看全量数据（共{{total}}条）请插入到表格', { total })
}

export const TableOverlay: FC<{
  totalRows: number
  tableIndex: number
  onInsert: () => void
  loading: boolean
  enableInsert: boolean
}> = ({ totalRows, tableIndex, onInsert, loading, enableInsert }) => {
  return (
    <div className={styles[`${PREFIX}-container`]}>
      <div className={styles[`${PREFIX}-content`]}>
        <div className={styles[`${PREFIX}-info`]}>{STRINGS.SHOW_ROWS(totalRows)}</div>
        <div className={styles[`${PREFIX}-actions`]}>
          <div className={styles[`${PREFIX}-points`]}>
            <CoinsIcon style={{ width: 20, height: 20, marginInlineEnd: 8 }} />
            <span style={{ fontSize: 16, fontWeight: 500 }}>{totalRows}</span>
          </div>
          <Divider type="vertical" className={styles[`${PREFIX}-divider`]} />
          <InsertTableButton
            id={`InsertTableButton-overlay-${tableIndex}`}
            onClick={onInsert}
            loading={loading}
            disabled={!enableInsert}
          />
        </div>
      </div>
    </div>
  )
}
