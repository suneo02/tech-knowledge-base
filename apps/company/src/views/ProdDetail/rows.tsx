import CompanyLink from '@/components/company/CompanyLink'
import { HorizontalTableProps } from '@wind/wind-ui-table/lib/HorizontalTable'
import { intl } from 'gel-util/intl'
import React from 'react'

// 基本信息 横向表格column
export const getProdDetailRows = (windId: string): HorizontalTableProps['rows'] => [
  [
    {
      title: intl('301088', '产品简称'),
      dataIndex: 'appAbbr',
      key: 'appAbbr',
      titleAlign: 'left',
      render: (data) => data || '--',
    },
    {
      title: intl('112710', '所属企业'),
      dataIndex: 'corpName',
      titleAlign: 'left',
      render: (data) => <CompanyLink divCss="companyLink" name={data} id={windId}></CompanyLink>,
    },
  ],
  [
    {
      title: intl('451260', '产品类别'),
      dataIndex: 'appCat',
      titleAlign: 'left',
      render: (data) => data || '--',
    },
    {
      title: intl('470278', '下载总数量'),
      dataIndex: 'downNum',
      titleAlign: 'left',
      render: (data) => data || '--',
    },
  ],
  [
    {
      title: intl('470295', '评分'),
      dataIndex: 'score',
      titleAlign: 'left',
      render: (data) => (data && (+data).toFixed(1)) || '--', // 小数点保留一位
    },
    {
      title: intl('301063', '评论总数量'),
      dataIndex: 'noteNum',
      titleAlign: 'left',
      render: (data) => data || '--',
    },
  ],
  [
    {
      title: intl('451261', '产品简述'),
      dataIndex: 'appBrief',
      colSpan: 3,
      titleAlign: 'left',
      render: (data) => data || '--',
    },
  ],
  [
    {
      title: intl('470279', '产品介绍'),
      dataIndex: 'appDesc',
      colSpan: 3,
      titleAlign: 'left',
      render: (data) => data || '--',
    },
  ],
]
