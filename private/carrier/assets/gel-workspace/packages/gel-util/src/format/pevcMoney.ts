import { CorpEvent } from 'gel-types'
import { formatMoneyFromWftCommon } from './money'

export const formatPevcMoney = (abstract: CorpEvent['event_abstract'], describe: CorpEvent['event_describe']) => {
  const data = abstract.amount
  if (data) {
    const unitStr = abstract.unit ? abstract.unit : ''
    if (!describe?.confidence || describe?.confidence == '精确值') {
      if (abstract.unit) {
        return formatMoneyFromWftCommon(data, [4, '万']) + unitStr
      } else {
        return formatMoneyFromWftCommon(data, [4, '万'])
      }
    } else if (describe?.confidence == '数百万') {
      return describe?.confidence + unitStr
    } else if (describe?.confidence == '数') {
      const numStr = (data + '').split('.')[0] //去掉可能存在的小数后面的数字
      switch (numStr.length) {
        case 7:
          return '数百亿' + unitStr
        case 6:
          return '数十亿' + unitStr
        case 5:
          return '数亿' + unitStr
        case 4:
          return '数千万' + unitStr
        case 3:
          return '数百万' + unitStr
        case 2:
          return '数十万' + unitStr
        case 1:
          return '数万' + unitStr
        default:
          return formatMoneyFromWftCommon(data, [4, '万']) + unitStr
      }
    } else {
      return describe?.confidence + formatMoneyFromWftCommon(data, [4, '万']) + unitStr
    }
  } else {
    return '--'
  }
}
