import CompanyLink from '@/components/company/CompanyLink.tsx'
import { LinkByRowCompatibleCorpPerson } from '@/components/company/link/CorpOrPersonLink.tsx'
import { ICorpSubModuleCfg } from '@/components/company/type'
import { formatCurrency } from '@/utils/common.ts'
import { TooltipMap } from '@/utils/TooltipUtil.ts'
import React from 'react'
import { intlNoNO as intl } from 'src/utils/intl'

export const corpDetailDirectInvest: ICorpSubModuleCfg = {
  cmd: '/detail/company/getinvestsearch',
  extraParams: (param) => {
    param.__primaryKey = param.companycode
    return param
  },
  downDocType: 'download/createtempfile/getinvestsearch',
  title: intl('138724', '对外投资'),
  hint: `<i><div><span>${intl(TooltipMap.CompanyDetailOutboundInvest.intlId, TooltipMap.CompanyDetailOutboundInvest.default)}</span></div></i>`,
  moreLink: 'showDirectInvestment',
  modelNum: 'foreign_invest_num',
  selName: ['investStatusVal', 'investRatioVal'],
  aggName: ['aggs_invest_reg_status', 'invest_rate_breakdown'],
  thWidthRadio: ['5.2%', '30%', '30%', '14%', '11%', '11%'],
  thName: [
    intl('28846', '序号'),
    intl('138677', '企业名称'),
    intl('451206', '法定代表人'),
    intl('451220', '注册资本（万）'),
    intl('138416', '经营状态'),
    intl('451217', '持股比例'),
  ],
  align: [1, 0, 0, 2, 0, 2],
  fields: [
    'NO.',
    'invest_name',
    'invest_legal_person',
    'invest_reg_capital|formatMoneyComma',
    'invest_reg_status',
    'invest_rate|formatPercent',
  ],
  dataCallback: (res) => {
    return res.list && res.list.length ? res.list : []
  },
  columns: [
    null,
    {
      render: (txt, row) => {
        return <CompanyLink name={txt} id={row.invest_id} />
      },
    },
    {
      render: (_txt, row) => (
        <LinkByRowCompatibleCorpPerson nameKey="invest_legal_person" idKey="invest_legal_person_id" row={row} />
      ),
    },
    {
      render: (_txt, row) => {
        return formatCurrency(row.invest_reg_capital, row.invest_reg_unit)
      },
    },
  ],
  rightFilters: [
    {
      key4sel: 'aggs_invest_reg_status',
      key4ajax: 'status',
      name: intl('258419', '全部登记状态'),
      key: '',
    },
    {
      key4sel: 'invest_rate_breakdown',
      key4ajax: 'rate',
      name: intl('222624', '全部持股比例'),
      key: '',
      keyRender: function (data) {
        if (window.en_access_config) {
          if (data == '50.0-100.1') {
            return '》50%'
          } else if (data == '5.0-50.0') {
            return '》5%'
          } else if (data == '0.0-5.0') {
            return '<5%'
          }
        } else {
          if (data == '50.0-100.1') {
            return '持股50%以上(含)'
          } else if (data == '5.0-50.0') {
            return '持股5%以上(含)'
          } else if (data == '0.0-5.0') {
            return '持股不到5%'
          }
        }
        return data
      },
    },
  ],
  rightFilterCallback: (param) => {
    return param
  },
}
