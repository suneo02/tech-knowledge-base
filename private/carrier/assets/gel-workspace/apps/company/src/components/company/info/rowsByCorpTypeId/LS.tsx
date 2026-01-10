import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable.ts'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import React from 'react'
import { CorpBasicInfoFront } from '../handle'
import { ParkBox } from '../rowsCommon/Park'

/**
 * 事务所
 */
export const LSrows: HorizontalTableColumns<CorpBasicInfoFront> = [
  [
    {
      title: intl('35779', '注册资本'),
      dataIndex: 'issue_date',
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
      title: intl('448303', '成立登记日期'),
      dataIndex: 'reg_date',
      render: (txt, backData) => {
        return wftCommon.formatTime(backData.reg_date)
      },
    },
  ],
  [
    { title: intl('448323', '负责人'), dataIndex: 'legal_person_name' },
    {
      title: window.en_access_config ? 'Type' : '律所类型',
      dataIndex: 'corp_type',
    },
    { title: intl('448324', '登记管理机关'), dataIndex: 'reg_authority' },
  ],
  [
    {
      title: intl('138808', '统一社会信用代码'),
      dataIndex: 'credit_code',
      colSpan: 2,
    },
    {
      title: window.en_access_config ? 'Idendification Number' : '执行证号',
      dataIndex: 'biz_reg_no',
      colSpan: 2,
    },
  ],
  [
    {
      title: intl('35776', '注册地址'),
      dataIndex: 'reg_address',
      colSpan: 5,
      render: (title, row) => (
        <ParkBox
          title={title}
          parkTitle={row?.registerPark}
          row={row}
          parkId={row?.registerParkId}
          isBusAddress={false}
        />
      ),
    },
  ],
  [
    {
      title: window.en_access_config ? 'Brief' : '律所简介',
      dataIndex: 'business_scope',
      colSpan: 5,
      render: (txt) => {
        return txt || ''
      },
    },
  ],
]
