import { corpInfoAnotherNameRow } from '@/components/company/info/rowsCommon/names.tsx'
import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable.ts'
import intl from '@/utils/intl'
import { CorpBasicInfoFront } from '../handle'

export const italyRows: HorizontalTableColumns<CorpBasicInfoFront> = [
  [{ title: intl('138677', '企业名称'), dataIndex: 'corp_name', colSpan: 5 }],
  [corpInfoAnotherNameRow],
  [
    { title: intl('448334', '法律形式'), dataIndex: 'corp_type', colSpan: 2 },
    {
      title: window.en_access_config ? intl('32674', '地区') : '国家/地区',
      dataIndex: 'province',
      colSpan: 2,
    },
  ],

  [{ title: intl('438015', '公司地址'), dataIndex: 'reg_address', colSpan: 5 }],
  [{ title: intl('206088', '活动'), dataIndex: 'business_scope', colSpan: 5 }],
]
