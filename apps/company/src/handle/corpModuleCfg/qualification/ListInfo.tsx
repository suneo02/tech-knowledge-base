import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import React from 'react'

export const corpDetailListInfoDetailCfg = {
  rowIdx: 5,
  cmd: 'detail/company/getrankedcompanydetailv2',
  bury: { id: 922602100327 },
  extraParams: (record, data) => {
    return {
      option: 'detail',
      companycode: data.companycode,
      rankCode: record.rankCode,
      companyid: data.companyid,
    }
  },
  itemKey: [
    {
      title: intl('12634', '上榜日期'),
      key: 0,
      dataIndex: 'rankTime',
      render: function (data) {
        return wftCommon.formatTime(data) || '--'
      },
    },
    {
      title: intl('437409', '上榜名次'),
      key: 1,
      dataIndex: 'rankLevel',
    },
  ],
  rowKey: ['rankTime', 'rankLevel'],
  iconNode: () => {
    return (
      <span className="wi-btn-color expand-icon-listInformation">
        {' '}
        <i></i>{' '}
      </span>
    )
  },
  notHorizontal: true,
}
