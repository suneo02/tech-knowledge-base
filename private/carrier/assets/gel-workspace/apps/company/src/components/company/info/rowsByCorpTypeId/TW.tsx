import { ParkBox } from '@/components/company/info/rowsCommon/Park'
import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable.ts'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import React from 'react'
import { ICorpBasicInfoFront } from '../handle'

export const TWrows: HorizontalTableColumns<ICorpBasicInfoFront> = [
  [
    {
      title: intl('6228', '公司编号'),
      dataIndex: 'biz_reg_no',
      titleWidth: '15%',
      contentWidth: '15%',
    },
    {
      title: intl('', '代表人'),
      dataIndex: 'legal_person_name',
      titleWidth: '15%',
      contentWidth: '15%',
    },
    {
      title: intl('138674', '公司类别'),
      dataIndex: 'corp_type',
      titleWidth: '15%',
      contentWidth: '15%',
    },
  ],
  [
    {
      title: intl('138473', '注册资金'),
      dataIndex: 'biz_reg_no',
      render: (txt, backData) => {
        const unit = backData.reg_unit ? backData.reg_unit : ''
        return backData.reg_capital ? wftCommon.formatMoney(backData.reg_capital) + unit : '--' //注册资金
      },
    },
    {
      title: intl('145876', '实缴资本'),
      dataIndex: 'legal_person_name',
      render: (txt, backData) => {
        const paid_in_capital_currency = backData.paid_in_capital_currency ? backData.paid_in_capital_currency : '' //实收资本币种
        const paid_in_capital = backData.paid_in_capital
          ? wftCommon.formatMoney(backData.paid_in_capital) + paid_in_capital_currency
          : '--' //实收资本
        return paid_in_capital
      },
    },
    { title: intl('138217', '公司现状'), dataIndex: 'state' },
  ],
  [
    {
      title: intl('222904', '核准设立日期'),
      dataIndex: 'reg_date',
      render: (txt, backData) => {
        return wftCommon.formatTime(backData.reg_date)
      },
    },
    {
      title: intl('222901', '最后核准变更日期'),
      dataIndex: 'issue_date',
      render: (txt, backData) => {
        return wftCommon.formatTime(backData.issue_date)
      },
    },
    { title: intl('222903', '股权状态'), dataIndex: 'entity_type' },
  ],
  [
    {
      title: intl('138477', '登记机关'),
      dataIndex: 'reg_authority',
      colSpan: 5,
    },
  ],
  [
    {
      title: intl('222902', '简体中文名称'),
      dataIndex: 'simplified_chinese',
      colSpan: 5,
    },
  ],
  [
    {
      title: intl('448329', '公司英文名'),
      dataIndex: 'eng_name',
      colSpan: 5,
    },
  ],
  [
    {
      title: intl('1588', '办公地址'),
      dataIndex: 'reg_address',
      colSpan: 5,
      render: (title, row) => (
        <ParkBox title={title} parkTitle={row?.officePark} row={row} parkId={row?.officeParkId} isBusAddress={false} />
      ),
    },
  ],
  [
    {
      title: intl('9177', '经营范围'),
      dataIndex: 'business_scope',
      colSpan: 5,
    },
  ],
]
