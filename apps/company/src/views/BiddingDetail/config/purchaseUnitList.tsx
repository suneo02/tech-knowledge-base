import { formatText } from 'gel-util/format'
import { intl } from 'gel-util/intl'

export const biddingDetailPurchaseUnitList = {
  title: intl('456614', '行政区域'),
  dataIndex: 'purchaseUnitList',
  colSpan: 2,
  contentAlign: 'left',
  titleAlign: 'left',
  render: (text, row) => {
    // 兼容老数据，后端升级之后要去除 purchaseUnitList 字段，使用 adminArea 字段
    if ('adminArea' in row) {
      return formatText(row.adminArea)
    }
    return text && text.length && Array.isArray(text) && formatText(text[0]?.region)
  },
}
