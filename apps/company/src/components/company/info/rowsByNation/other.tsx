import { AddrComp } from '@/components/company/info/comp/AddrComp.tsx'
import { industry_gb_render, industry_name_wind_render } from '@/components/company/info/comp/industry.tsx'
import { TitleAttachmentRender } from '@/components/company/info/comp/misc.tsx'
import { corpInfoAnotherNameRow } from '@/components/company/info/rowsCommon/names.tsx'
import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable.ts'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import React from 'react'
import { ICorpBasicInfoFront } from '../handle'

export const otherRows: HorizontalTableColumns<ICorpBasicInfoFront> = [
  [{ title: intl('138677', '企业名称'), dataIndex: 'corp_name', colSpan: 5 }],
  [corpInfoAnotherNameRow],
  [
    { title: intl('138681', '公司类型'), dataIndex: 'corp_type', colSpan: 2 },
    { title: intl('134794', '企业状态'), dataIndex: 'state', colSpan: 2 },
  ],
  [
    {
      title: intl('2823', '成立日期'),
      dataIndex: 'reg_date',
      colSpan: 2,
      render: (txt) => {
        return wftCommon.formatTime(txt)
      },
    },
    {
      title: intl('259461', '经营期限终止日期'),
      dataIndex: 'issue_date',
      colSpan: 2,
      render: (_txt, backData) => {
        const BusinessTerm01 = backData.oper_period_begin ? wftCommon.formatTime(backData.oper_period_begin) : '--' //营业期限:
        const BusinessTerm02 = backData.oper_period_end
          ? wftCommon.formatTime(backData.oper_period_end)
          : intl('271247', '无固定期限') //营业期限:
        const BusinessTerm = BusinessTerm01 + ' ' + intl('271245', '至') + ' ' + BusinessTerm02
        if (BusinessTerm02 === '无固定期限') return '--'
        return BusinessTerm
      },
    },
  ],
  [
    {
      title: window.en_access_config ? intl('32674', '地区') : '国家/地区',
      dataIndex: 'province',
      colSpan: 2,
    },
    {
      title: intl('257664', '人员规模'),
      dataIndex: 'employee_num',
      colSpan: 2,
    },
  ],
  [
    { title: intl('138482', '登记号'), dataIndex: 'biz_reg_no', colSpan: 2 },
    {
      title: intl('138477', '登记机关'),
      dataIndex: 'reg_authority',
      colSpan: 2,
    },
  ],
  [
    {
      title: intl('138722', '国民经济行业分类'),
      dataIndex: 'industry_gb',
      colSpan: 5,
      render: industry_gb_render,
    },
    // {
    //   title: <TitleAttachmentRender />,
    //   dataIndex: 'industry_name',
    //   render: industry_name_wind_render,
    //   colSpan: 2,
    // },
  ],
  [{ title: intl('35776', '注册地址'), dataIndex: 'reg_address', colSpan: 5 }],
  [
    {
      title: intl('1588', '办公地址'),
      dataIndex: 'bus_address',
      colSpan: 5,
      render: (txt, row) => {
        return AddrComp(txt, row, 1)
      },
    },
  ],
]
