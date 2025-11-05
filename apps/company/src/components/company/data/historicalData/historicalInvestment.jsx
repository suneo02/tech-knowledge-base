/**
 * 历史对外投资 - Historical Investment - 142472
 * Created by Calvin
 *
 * @format
 */

import { intlNoIndex } from '../../../../utils/intl'
import { wftCommon } from '../../../../utils/utils'
import { CompanyLinks, notVipTips } from '../../context'

const title = intlNoIndex('142472')
const menuTitle = intlNoIndex('259651', '对外投资')

export const historicalInvestment = {
  cmd: 'detail/company/gethisinvest',
  title,
  menuTitle,
  extraParams: (param) => {
    param.__primaryKey = param.companycode
    return param
  },
  downDocType: 'hisinvest',
  moreLink: 'historyinvest',
  modelNum: 'his_invest_num',
  thWidthRadio: ['4%', '20%', '15%', '16%', '10%', '10%', '10%'],
  notVipTitle: title,
  notVipTips: notVipTips(title),
  thName: [
    intlNoIndex('138741', '序号'),
    intlNoIndex('265558', '被投企业'),
    intlNoIndex('261159', '被投企业法人'),
    intlNoIndex('138768', '注册资本'),
    intlNoIndex('356653', '退出前持股比例'),
    intlNoIndex('101026', '投资日期'),
    intlNoIndex('63486', '退出日期'),
  ],
  align: [1, 0, 0, 2, 2, 0, 0],
  fields: [
    'NO.',
    'investcompany_name',
    'legal_name',
    'registeredCapital',
    'invest_radio|formatPercent',
    'start_date|formatTime',
    'exit_date|formatTime',
  ],
  columns: [
    null,
    {
      render: (txt, row) => <CompanyLinks name={txt} id={row.investcompany_id} />,
    },
    { render: (txt, row) => <CompanyLinks name={txt} id={row.legal_id} /> },
    {
      render: (txt, row) => {
        return txt && txt !== '0' ? `${wftCommon.formatMoney(txt)} ${row.regCurrency || '--'}` : '--'
      },
    },
    ,
    null,
  ],
}
