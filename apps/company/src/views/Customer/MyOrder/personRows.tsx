import { wftCommon } from '@/utils/utils'
import { HorizontalTableProps } from '@wind/wind-ui-table/lib/HorizontalTable'
import { intl } from 'gel-util/intl'

// 个人发票详情
export const personRows: HorizontalTableProps['rows'] = [
  [
    {
      title: intl('416976', '发票类型'),
      dataIndex: 'type',
      titleWidth: '130px',
      titleAlign: 'left',
      render: (data) => {
        return data || '增值税普通发票'
      },
    },
  ],
  [
    {
      title: intl('416977', '付款金额'),
      dataIndex: 'price',
      titleWidth: '130px',
      titleAlign: 'left',
      render: (data) => {
        return wftCommon.formatMoney(data, [2, '元']) || ' '
      },
    },
  ],
  [
    {
      title: intl('416961', '发票抬头'),
      dataIndex: 'invoiceType',
      titleWidth: '130px',
      titleAlign: 'left',
      render: (data) => {
        return data?.desc || '--'
      },
    },
  ],
  [
    {
      title: intl('416981', '个人名称'),
      dataIndex: 'taxpayerName',
      titleWidth: '130px',
      titleAlign: 'left',
      render: (data) => data || '--',
    },
  ],
  [
    {
      title: intl('10057', '联系电话'),
      dataIndex: 'companyTel',
      titleWidth: '130px',
      titleAlign: 'left',
      render: (data) => data || '--',
    },
  ],
  [
    {
      title: intl('140100', '联系邮箱'),
      dataIndex: 'receiverEmail',
      titleWidth: '130px',
      titleAlign: 'left',
      render: (data) => data || '--',
    },
  ],
  [
    {
      title: intl('416980', '开票备注'),
      dataIndex: 'remark',
      titleWidth: '130px',
      titleAlign: 'left',
      render: (data) => data || '--',
    },
  ],
]
