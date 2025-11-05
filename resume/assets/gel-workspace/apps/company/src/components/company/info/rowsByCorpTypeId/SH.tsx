import Links from '@/components/common/links/Links.tsx'
import { getLegalPersonField } from '@/components/company/handle'
import { AddrComp } from '@/components/company/info/comp/AddrComp.tsx'
import { LinksModule } from '@/handle/link'
import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable.ts'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import React from 'react'
import { ICorpBasicInfoFront } from '../handle'

export const getSHrows = (baseInfo: ICorpBasicInfoFront): HorizontalTableColumns<ICorpBasicInfoFront> => {
  const legalPersonFieldKey = getLegalPersonField(baseInfo?.corp_type, baseInfo?.corp_type_id)
  return [
    [
      {
        title: intl('35779', '注册资本'),
        dataIndex: 'reg_capital',
        render: (txt, backData) => {
          const unit = backData.reg_unit ? backData.reg_unit : ''
          return backData.reg_capital ? wftCommon.formatMoney(backData.reg_capital) + unit : '--' //注册资金
        },
      },
      {
        title: intl('138772', '登记状态'),
        dataIndex: 'state',
      },
      {
        title: intl('207784', '成立登记日期'),
        dataIndex: 'reg_date',
        render: (txt, backData) => {
          return wftCommon.formatTime(backData.reg_date)
        },
      },
    ],
    [
      {
        title: legalPersonFieldKey,
        dataIndex: 'legal_person_name',
        render: (res, record) => {
          let module
          if (record?.legal_person_type === 'person') module = LinksModule.CHARACTER
          if (record?.legal_person_type === 'company') module = LinksModule.COMPANY
          return module ? <Links module={module} title={res} id={record.legal_person_id} /> : res || '--'
        },
      },
      { title: intl('207787', '社会组织类型'), dataIndex: 'corp_type' },
      { title: intl('208889', '登记管理机关'), dataIndex: 'reg_authority' },
    ],
    [
      {
        title: intl('138808', '统一社会信用代码'),
        dataIndex: 'credit_code',
        titleWidth: '15%',
        contentWidth: '15%',
      },
      {
        title: intl('207788', '登记证号'),
        dataIndex: 'biz_reg_no',
        titleWidth: '15%',
        contentWidth: '15%',
      },
      {
        title: intl('207789', '证书有效期'),
        dataIndex: 'oper_period_begin',
        titleWidth: '15%',
        contentWidth: '15%',
        render: (txt, backData) => {
          if (backData.oper_period_begin) {
            return (
              wftCommon.formatTime(backData.oper_period_begin) +
              ' ' +
              intl('271245', '至') +
              ' ' +
              wftCommon.formatTime(backData.oper_period_end)
            )
          }
          return '--'
        },
      },
    ],
    [
      {
        title: intl('207785', '住所'),
        dataIndex: 'reg_address',
        colSpan: 5,
        render: AddrComp,
      },
    ],
    [
      {
        title: intl('145358', '业务范围'),
        dataIndex: 'business_scope',
        colSpan: 5,
      },
    ],
  ]
}
