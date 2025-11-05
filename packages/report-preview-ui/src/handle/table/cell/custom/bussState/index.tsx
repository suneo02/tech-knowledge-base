import { ConfigTableCellRenderConfig, CorpBasicInfo } from 'gel-types'
import { isEn } from 'gel-util/intl'
import React from 'react'
import { renderSimpleDate } from 'report-util/table'
import { tForRPPreview } from '../../../../../utils'
import { renderText } from '../../renderers'
import styles from './index.module.less'
/**
 * 工商信息的经营状态
 * @param _txt
 * @param record
 * @param config
 * @returns
 */
export const corpInfoBussStateRender = (txt: any, record: CorpBasicInfo, config: ConfigTableCellRenderConfig) => {
  const pre = renderText(txt, record, config)
  if (record.revokeOrCancelDate) {
    const date = renderSimpleDate(record.revokeOrCancelDate, record, config, {
      isEn: isEn(),
      t: tForRPPreview,
    })
    return (
      <div className={styles['buss-state-container']}>
        {typeof pre === 'string' ? <span>{pre}</span> : pre}
        <span>{date}</span>
      </div>
    )
  } else {
    return pre
  }
}
