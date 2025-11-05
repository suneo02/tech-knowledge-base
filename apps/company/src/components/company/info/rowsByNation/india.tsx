import { corpInfoAnotherNameRow } from '@/components/company/info/rowsCommon/names.tsx'
import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable.ts'
import { formatCurrency } from '@/utils/common.ts'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import { ICorpBasicInfoFront } from '../handle'

export const indiaRows: HorizontalTableColumns<ICorpBasicInfoFront> = [
  [
    {
      title: intl('138677', '企业名称'),
      dataIndex: 'corp_name',
      colSpan: 5,
    },
  ],
  [corpInfoAnotherNameRow],
  [
    { title: window.en_access_config ? 'Company Code' : '企业编号', dataIndex: 'biz_reg_no', colSpan: 2 },
    { title: intl('32098', '状态'), dataIndex: 'state', colSpan: 2 },
  ],
  [
    {
      title: window.en_access_config ? intl('32674', '地区') : '国家/地区',
      dataIndex: 'province',
      colSpan: 2,
    },
    {
      title: intl('138860', '成立日期'),
      dataIndex: 'reg_date',
      colSpan: 2,
      render: (txt) => {
        return wftCommon.formatTime(txt)
      },
    },
  ],
  [
    {
      title: intl('', '企业分类'),
      dataIndex: 'corp_type',
      colSpan: 2,
    },
    {
      title: intl('138477', '登记机关'),
      dataIndex: 'reg_authority',
      colSpan: 2,
    },
  ],
  [
    {
      title: intl('451220', '注册资本（万）'),
      dataIndex: 'reg_capital',
      colSpan: 2,
      render: (_, record) => formatCurrency(record.reg_capital, record.reg_unit),
    },
    {
      title: intl('', '实缴资本（万）'),
      dataIndex: 'paid_in_capital',
      colSpan: 2,
      render: (_, record) => formatCurrency(record.paid_in_capital, record.paid_in_capital_currency),
    },
  ],
  [
    {
      title: intl('9177', '经营范围'),
      dataIndex: 'business_scope',
      colSpan: 5,
    },
  ],
  [
    {
      title: intl('35776', '注册地址'),
      dataIndex: 'reg_address',
      colSpan: 5,
    },
  ],
  [
    {
      title: intl('1588', '办公地址'),
      dataIndex: 'bus_address',
      colSpan: 5,
    },
  ],
]
