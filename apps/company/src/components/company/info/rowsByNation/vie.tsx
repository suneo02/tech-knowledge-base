import { CorpInfoHeaderComp } from '@/components/company/info/comp/misc.tsx'
import { corpInfoAnotherNameRow } from '@/components/company/info/rowsCommon/names.tsx'
import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable.ts'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import { CorpBasicInfoFront } from '../handle'

export const vieRows: HorizontalTableColumns<CorpBasicInfoFront> = [
  [
    {
      title: CorpInfoHeaderComp(intl('138677', '企业名称'), 'Tên doanh nghiệp'),
      dataIndex: 'corp_name',
      colSpan: 5,
    },
  ],
  [corpInfoAnotherNameRow],
  [
    {
      title: CorpInfoHeaderComp(window.en_access_config ? 'Representative' : intl('416873', '代表人'), 'Người đại diện'),
      dataIndex: 'legal_person_name',
      colSpan: 2,
    },
    {
      title: CorpInfoHeaderComp(intl('138416', '状态'), 'Tình trạng'),
      dataIndex: 'state',
      colSpan: 2,
    },
  ],
  [
    {
      title: window.en_access_config ? intl('32674', '地区') : '国家/地区',
      dataIndex: 'province',
      colSpan: 2,
    },
    {
      title: CorpInfoHeaderComp(intl('138860', '成立日期'), 'Ngày hoạt động'),
      dataIndex: 'reg_date',
      colSpan: 2,
      render: (txt) => {
        return wftCommon.formatTime(txt)
      },
    },
  ],
  [
    {
      title: CorpInfoHeaderComp(intl('6228', '公司编号'), 'Mã số thuế'),
      dataIndex: 'credit_code',
      colSpan: 2,
    },
    {
      title: CorpInfoHeaderComp(intl('448332', '实体类型'), 'Loại hình DN'),
      dataIndex: 'corp_type',
      colSpan: 2,
    },
  ],
  [
    {
      title: CorpInfoHeaderComp(intl('438015', '公司地址'), 'Địa chỉ'),
      dataIndex: 'reg_address',
      colSpan: 5,
    },
  ],
]
