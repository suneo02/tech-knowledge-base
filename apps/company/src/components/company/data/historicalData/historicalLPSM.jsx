/**
 * 历史法人和高管 - Historical Legal Persons And Senior Managers - 208386
 * Created by Calvin
 *
 * @format
 */

import { intlNoIndex } from '../../../../utils/intl'
import { notVipTips } from '../../context'

const title = intlNoIndex('208386')
const menuTitle = intlNoIndex('138370', '法人和高管')

export const historicalLPSM = {
  cmd: 'detail/company/gethismanager',
  title,
  menuTitle,
  notVipTitle: title,
  notVipTips: notVipTips(title),
  moreLink: 'historylegalperson',
  modelNum: 'his_manager_num',
  downDocType: 'hismanager',
  thWidthRadio: ['4%', '24%', '24%', '24%', '24%'],
  thName: [
    intlNoIndex('138741', '序号'),
    intlNoIndex('34979', '姓名'),
    intlNoIndex('138728', '职务'),
    intlNoIndex('261229', '上任日期'),
    intlNoIndex('259985', '离任日期'),
  ],
  align: [1, 0, 0, 0, 0],
  fields: ['NO.', 'person_name', 'person_position', 'employment_date|formatTime', 'departure_date|formatTime'],
}
