/**
 * 历史实际控制人 - History Possible Controller - 370005
 *
 * @format
 */

import { intlNoIndex } from '../../../../utils/intl'

const title = intlNoIndex('439454', '历史实际控制人')

export const historyPossibleController = {
  title,
  cmd: 'detail/company/gethistoricalcontroller/1182667970',
  modelNum: 'historicalcontrollerCount',
  thName: [
    intlNoIndex('138741', '序号'),
    intlNoIndex('439435', '实控人名称'),
    intlNoIndex('138412', '实际持股比例'),
    intlNoIndex('451201', '变更日期'),
  ],
  fields: ['NO.', 'controllerName', 'ratio', 'endDate'],
  align: [0, 0, 2, 0],
  thWidthRadio: ['4%', '70%', '16%', '20%'],
}
