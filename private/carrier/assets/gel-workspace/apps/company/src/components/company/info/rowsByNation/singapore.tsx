import { industry_oversea_render } from '@/components/company/info/comp/industry.tsx'
import { corpInfoAnotherNameRow } from '@/components/company/info/rowsCommon/names.tsx'
import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable.ts'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import { ICorpBasicInfoFront } from '../handle'

export const singaporeRows: HorizontalTableColumns<ICorpBasicInfoFront> = [
  [{ title: intl('138677', '企业名称'), dataIndex: 'corp_name', colSpan: 5 }],
  [corpInfoAnotherNameRow],
  [
    { title: intl('259470', '实体类型'), dataIndex: 'corp_type', colSpan: 2 },
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
      render: (txt, backData) => {
        return wftCommon.formatTime(backData.reg_date)
      },
    },
  ],
  [
    { title: 'UEN编号', dataIndex: 'biz_reg_no', colSpan: 2 },
    {
      title: intl('206130', 'UEN登记机构'),
      dataIndex: 'reg_authority',
      colSpan: 2,
    },
  ],
  [{ title: 'SSIC行业', dataIndex: 'business_scope', colSpan: 5, render: industry_oversea_render }],
  [{ title: intl('438015', '公司地址'), dataIndex: 'reg_address', colSpan: 5 }],
  [{ title: '公司介绍', dataIndex: 'brief', colSpan: 5 }],
]
