/**
 * 历史股东信息 - Historical shareholder information - 348171
 * Created by Calvin
 *
 * @format
 */

import { intlNoIndex } from '../../../../utils/intl'
import { CompanyLinks, notVipTips } from '../../context'

const title = intlNoIndex('348171')
const menuTitle = intlNoIndex('138506', '股东信息')
const vipTitle = intlNoIndex('138326')

export const historicalShareholderInformation = {
  cmd: '/detail/company/gethisshareholder',
  title,
  menuTitle,
  notVipTitle: vipTitle,
  notVipTips: notVipTips(vipTitle),
  downDocType: 'hisshareholder',
  moreLink: 'historyshareholder',
  modelNum: 'his_shareholder_num',
  thWidthRadio: ['4%', '30%', '15%', '10%', '16%', '15%', '10%'],
  thName: [
    intlNoIndex('138741', '序号'),
    intlNoIndex('32959', '股东'),
    intlNoIndex('348185', '退出时持股比例'),
    intlNoIndex('63486', '退出日期'),
    intlNoIndex('232858', '认缴出资金额（万元）'),
    intlNoIndex('2045', '币种'),
    intlNoIndex('348172', '出资日期'),
  ],
  align: [1, 0, 2, 0, 2, 0, 0],
  fields: [
    'NO.',
    'sharehold_name',
    'shareholding_radio|formatPercent',
    'exit_date|formatTime',
    'subscribe_money|formatMoneyComma',
    'currency_type',
    'start_date|formatTime',
  ],
  columns: [
    null,
    {
      render: (txt, row) => {
        if (row.sharehold_type == 2) {
          return <CompanyLinks name={txt} id={row.sharehold_id} />
        }
        return txt || '--'
      },
    },
  ],
  extraParams: (param) => {
    param.__primaryKey = param.companycode
    return param
  },
}
