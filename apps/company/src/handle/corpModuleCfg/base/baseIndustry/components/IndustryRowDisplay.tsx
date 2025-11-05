import React from 'react'
import { IndustryRow, RowItem } from '../type'
import styles from '../index.module.less'
import { CopyContainer } from '@/components/common/CopyContainer'
import { Tooltip } from '@wind/wind-ui'
import { pointBuriedByModule } from '@/api/pointBuried/bury'
import dayjs from 'dayjs'
import intl from '@/utils/intl'

const PREFIX = 'industry'
const STRINGS = {
  HIGH: intl('449775', '1：基于官方文件直接分类，具有高关联性'),
  MEDIUM: intl('449723', '2：结合企业主营特征等公开数据分类，具有较高关联性'),
  LOW: intl('449774', '3：结合企业主营特征等公开数据分类，具有较低关联性'),
}
export const IndustryRowDisplay: React.FC<{
  rowData: IndustryRow
  baseKey: string
  cellOnClick?: (cellData: RowItem) => void
}> = ({ rowData, baseKey, cellOnClick }) => {
  const copyText = rowData.list.map((cell) => cell.name).join(' > ')

  const renderConfidence = (confidence: number) => {
    const confidenceMap = {
      1: 'HIGH',
      2: 'MEDIUM',
      3: 'LOW',
    }
    return (
      <Tooltip title={STRINGS[confidenceMap[confidence]]}>
        <sup className={styles[`${PREFIX}-sup`]}>{confidence}</sup>
      </Tooltip>
    )
  }

  return (
    <CopyContainer
      copyText={copyText}
      buttonType="link"
      onCopySuccess={() => {
        pointBuriedByModule(922602101141, {
          click_time: dayjs().format('YYYY-MM-DD HH:mm'),
          more_industry_name: copyText,
        })
      }}
    >
      {rowData.list.map((cellData, cellIndex) => (
        <React.Fragment key={cellData.id || `${baseKey}-cell-${cellIndex}`}>
          {cellOnClick && cellData?.id ? (
            <a onClick={() => cellOnClick?.(cellData)}>{cellData.name}</a>
          ) : (
            <span>{cellData.name}</span>
          )}
          {rowData.confidence && cellIndex === rowData.list.length - 1 ? renderConfidence(rowData.confidence) : null}
          {cellIndex < rowData.list.length - 1 && (
            <span className={styles[`${PREFIX}-container-item-separator`]}>{' > '}</span>
          )}
        </React.Fragment>
      ))}
    </CopyContainer>
  )
}
