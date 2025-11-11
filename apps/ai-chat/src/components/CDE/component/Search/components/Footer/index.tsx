// author Calvin
import { LoadingO } from '@wind/icons'
import { Button, InputNumber } from '@wind/wind-ui'
import type { CDEFormBizValues } from 'cde'
import type { TRequestToWFCSpacfic } from 'gel-api'
import { formatNumber } from 'gel-util/format'
import { t } from 'gel-util/intl'
import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.less'
import { CoinsIcon } from '@/assets/icon'
import { postPointBuried } from '@/utils/common/bury'

const PREFIX = 'cde-footer'

export interface FooterProps {
  loading: boolean
  total: number
  onReset: () => void
  onSubmit: (pageSize: number, currentTable?: boolean) => void
  tableId?: string // 表格id 如果是添加到当前表格必传字段
  sheetId?: string // 表格sheetId 如果是添加到当前表格必传字段
  filters: CDEFormBizValues[]
  saveSubFunc: TRequestToWFCSpacfic<'operation/insert/addsubcorpcriterion'>
  onSave?: () => void
  onFinish?: () => void
}

const Footer: React.FC<FooterProps> = ({ loading, total, onReset, onSubmit, tableId, sheetId }) => {
  // const t = useIntl()
  const [count, setCount] = useState(0) // 添加到当前表格的条数
  const mySavesButtonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (count > 0 && count < total) {
      setCount(count)
    } else if (count > total) {
      setCount(total)
    } else {
      setCount(Math.min(20, total))
    }
  }, [total])

  const STRINGS = {
    RESET: t('138490', '重置条件'),
    SUBMIT: t('464142', '提取数据'),
    LOADING: t('428450', '加载中...'),
    SUBMIT_TO_NEW_TABLE: t('464189', '添加至表格'),
    REMARK: t('464153', '有 {{total}} 家企业符合条件，添加前 {{finalCount}} 家至表格', {
      total: loading ? (
        <LoadingO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
      ) : (
        <strong>{formatNumber(total)}</strong>
      ),
      max: loading ? (
        <LoadingO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
      ) : (
        <strong>{formatNumber(Math.min(2000, total))}</strong>
      ),
      finalCount: (
        <InputNumber
          style={{ width: 70, fontSize: 14, marginLeft: 4, marginRight: 4 }}
          size="small"
          min={0}
          max={Math.min(2000, total)}
          value={count}
          onChange={(value) => {
            postPointBuried('922604570300')
            setCount(value as number)
          }}
          precision={0}
        />
      ),
    }),
  }

  return (
    <div className={styles[`${PREFIX}-container`]}>
      <div ref={mySavesButtonRef}>
        <Button
          disabled={loading}
          onClick={() => {
            postPointBuried('922604570296')
            onReset()
          }}
        >
          {STRINGS.RESET}
        </Button>
      </div>
      <div className={styles[`${PREFIX}-button-group`]}>
        <div className={styles[`${PREFIX}-button-group-remark`]}>
          {STRINGS.REMARK}
          <div className={styles[`${PREFIX}-button-group-remark-count`]}>
            <CoinsIcon style={{ marginInlineEnd: 4 }} />
            {count}
          </div>
        </div>
        <div>
          <Button
            type="primary"
            onClick={() => {
              postPointBuried('922604570294')
              return tableId && sheetId ? onSubmit(count, true) : onSubmit(count)
            }}
            loading={loading}
            disabled={!count}
          >
            {STRINGS.SUBMIT_TO_NEW_TABLE}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Footer
