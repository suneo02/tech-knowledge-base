import React from 'react'
import intl from '../../../../utils/intl'
import { wftCommon } from '../../../../utils/utils'

export const TableColumnDateRange = ({ startDate, endDate }) => {
  if (endDate == '9999/12/31' || endDate == '99991231') {
    return intl('40768', '长期')
  }
  if (startDate || endDate) {
    return wftCommon.formatTime(startDate) + intl('271245', ' 至 ') + wftCommon.formatTime(endDate)
  }
  return '--'
}
export const handleTableColumnDateType = (col) => {
  try {
    const dateInfo = col.date
    if (dateInfo && dateInfo.type === 1) {
      // date range
      col.render = (res, record) => <TableColumnDateRange startDate={res} endDate={record[dateInfo.dateRangeKey]} />
    } else {
      col.render = (res) => wftCommon.formatTime(res)
    }
  } catch (e) {
    console.error(e)
  }
}
