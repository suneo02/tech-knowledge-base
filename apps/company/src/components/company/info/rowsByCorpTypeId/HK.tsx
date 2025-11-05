import { corpInfoHKUsedNames } from '@/components/company/info/rowsCommon'
import { ParkBox } from '@/components/company/info/rowsCommon/Park'
import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable.ts'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import React from 'react'
import { ICorpBasicInfoFront } from '../handle'

export const HKrows: HorizontalTableColumns<ICorpBasicInfoFront> = [
  [
    {
      title: intl('138677', '企业名称'),
      dataIndex: 'corp_name',

      colSpan: 3,
      render: (_, record) => [<div>{record.corp_name}</div>, <div>{record.eng_name}</div>],
    },
  ],
  [corpInfoHKUsedNames],
  [
    {
      title: intl('', '商业登记号码'),
      dataIndex: 'credit_code',
    },
    {
      title: intl('6228', '公司编号'),
      dataIndex: 'biz_reg_no',
    },
  ],
  [
    { title: intl('2823', '成立日期'), dataIndex: 'reg_date', render: (date) => wftCommon.formatTime(date) },
    {
      title: intl('138239', '已告解散日期/不再是独立实体日期'),
      dataIndex: 'revokeDate',
      render: (date) => wftCommon.formatTime(date),
    },
  ],
  [
    { title: intl('257673', '企业类型'), dataIndex: 'corp_type' },
    { title: intl('134794', '企业状态'), dataIndex: 'state' },
  ],
  [
    {
      title: intl('35776', '注册地址'),
      dataIndex: 'reg_address',
      colSpan: 3,
      render: (title, row) => (
        <ParkBox title={title} parkTitle={row?.registerPark} row={row} parkId={row?.registerParkId} />
      ),
    },
  ],
  [
    {
      title: intl('1588', '办公地址'),
      dataIndex: 'bus_address',
      colSpan: 3,
      render: (title, row) => (
        <ParkBox title={title} parkTitle={row?.officePark} row={row} parkId={row?.officeParkId} />
      ),
    },
  ],
  [
    {
      title: intl('1919', '备注'),
      dataIndex: 'remark',
      colSpan: 3,
    },
  ],
]
