import { corpInfoAnotherNameRow } from '@/components/company/info/rowsCommon/names.tsx'
import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable.ts'
import intl from '@/utils/intl'
import { ICorpBasicInfoFront } from '../handle'

export const malaysiaRows: HorizontalTableColumns<ICorpBasicInfoFront> = [
  [
    {
      title: intl('138677', '企业名称'),
      dataIndex: 'corp_name',
      colSpan: 5,
    },
  ],
  [corpInfoAnotherNameRow],
  [
    { title: intl('', '新式注册号'), dataIndex: 'biz_reg_no', colSpan: 2 },
    { title: intl('', '旧式注册号'), dataIndex: 'credit_code', colSpan: 2 },
  ],
  [
    {
      title: intl('', '公司类型'),
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
      title: window.en_access_config ? intl('32674', '地区') : '国家/地区',
      dataIndex: 'province',
      colSpan: 5,
    },
  ],
]
