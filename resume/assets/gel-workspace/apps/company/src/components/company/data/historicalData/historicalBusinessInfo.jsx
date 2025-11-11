/**
 * 历史工商信息 - Historical Business Information - 138603
 * Created by Calvin
 *
 * @format
 */

import { intlNoIndex } from '../../../../utils/intl'
import { notVipTips } from '../../context'

const title = intlNoIndex('138603')
const menuTitle = intlNoIndex('257705', '工商信息')

export const historicalBusinessInfo = {
  cmd: 'historyinfo',
  title,
  menuTitle,
  notVipTitle: title,
  notVipTips: notVipTips(title),
  moreLink: 'historyinfo',
  modelNum: 'his_business_info_num',
  thWidthRadio: ['4%', '26%', '26%', '44%'],
  thName: [intlNoIndex('203850', '类别'), intlNoIndex('19528', '时间'), intlNoIndex('31887', '信息')],
  align: [0, 0, 0],
  fields: ['type', 'date', 'info'],
}
