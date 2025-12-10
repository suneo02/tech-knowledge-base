/** @format */

import { vipDescDefault } from '@/handle/corpModuleCfg/common/vipDesc.ts'
import React from 'react'
import { intlNoIndex } from '../../../../utils/intl'
import { wftCommon } from '../../../../utils/utils'
import LongTxtLabel from '../../../LongTxtLabel'
import { ICorpSubModuleVipCfg } from '../../type'

export const hzpscxk: ICorpSubModuleVipCfg = {
  cmd: '/detail/company/CosmeticsProductionLicenseList',
  extraParams: (param) => {
    return {
      ...param,
      // typee: 'trademark_theCompany',
      __primaryKey: param.companycode,
      companyCode: param.companycode,
    }
  },
  notVipTitle: intlNoIndex('368136', '化妆品生产许可'),
  notVipTips: vipDescDefault,
  title: intlNoIndex('368136', '化妆品生产许可'),
  moreLink: 'hzpscxk',
  modelNum: 'cosmeticslicenseNum',
  thWidthRadio: ['4%', '25%', '25%', '25%', '11%', '10%'],
  thName: [
    intlNoIndex('138741', '序号'),
    intlNoIndex('205398', '许可证号'),
    intlNoIndex('138378', '许可内容'),
    intlNoIndex('21235', '有效期'),
    intlNoIndex('138199', '证书状态'),
    intlNoIndex('265406', '操作'),
  ],
  align: [1, 0, 0, 0, 0, 1],
  fields: ['NO.', 'licenseNo', 'licenseContent', 'startDate', 'certificateStatus', 'action'],

  columns: [
    null,
    null,
    {
      render: (txt) => {
        if (!txt) return '--'
        if (txt.length < 50) return txt
        return <LongTxtLabel txt={txt} />
      },
    },
    {
      render: (_txt, row) => {
        if (row.endDate == '9999/12/31' || row.endDate == '99991231') {
          return intlNoIndex('40768', '长期')
        }
        const start = wftCommon.formatTime(row['startDate'])
        const end = wftCommon.formatTime(row['endDate'])
        return start + intlNoIndex('271245', ' 至 ') + end
      },
    },
    null,
  ],

  dataCallback: (res, _num, pageno) => {
    res.map((t, idx) => {
      t.key = t.key ? t.key : idx + pageno * 10
    })
    return res
  },
}
