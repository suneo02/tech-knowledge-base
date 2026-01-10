import { corpInfoAnotherNameRow } from '@/components/company/info/rowsCommon/names.tsx'
import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable.ts'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import { CorpBasicInfoFront } from '../handle'

export const koreaRows: HorizontalTableColumns<CorpBasicInfoFront> = [
  [{ title: intl('138677', '企业名称'), dataIndex: 'corp_name', colSpan: 5 }],
  [corpInfoAnotherNameRow],
  [
    { title: intl('138681', '公司类型'), dataIndex: 'corp_type', colSpan: 2 },
    {
      title: window.en_access_config ? intl('32674', '地区') : '国家/地区',
      dataIndex: 'province',
      colSpan: 2,
    },
  ],
  [
    { title: intl('138476', '注册号'), dataIndex: 'biz_reg_no', colSpan: 2 },
    {
      title: intl('138477', '登记机关'),
      dataIndex: 'reg_authority',
      colSpan: 2,
    },
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
      title: intl('138157', '核准日期'),
      dataIndex: 'issue_date',
      colSpan: 2,
      render: (txt) => {
        return wftCommon.formatTime(txt)
      },
    },
  ],
  [{ title: intl('438015', '公司地址'), dataIndex: 'reg_address', colSpan: 5 }],
]
