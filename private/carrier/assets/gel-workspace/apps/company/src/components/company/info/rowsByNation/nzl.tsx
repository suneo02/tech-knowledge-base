import { industry_oversea_render } from '@/components/company/info/comp/industry.tsx'
import { corpInfoAnotherNameRow } from '@/components/company/info/rowsCommon/names.tsx'
import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable.ts'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import { ICorpBasicInfoFront } from '../handle'

export const nzlRows: HorizontalTableColumns<ICorpBasicInfoFront> = [
  [
    {
      title: intl('138677', '企业名称'),
      dataIndex: 'corp_name',
      colSpan: 5,
    },
  ],
  [corpInfoAnotherNameRow],
  [
    { title: intl('32098', '状态'), dataIndex: 'state', colSpan: 2 },
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
    { title: window.en_access_config ? 'Company Code' : '企业编号', dataIndex: 'biz_reg_no', colSpan: 2 },
    {
      title: intl('259470', '实体类型'),
      dataIndex: 'corp_type',
      colSpan: 2,
    },
  ],
  [
    {
      title: intl('31801', '行业'),
      dataIndex: 'overseasCorpIndustryList',
      colSpan: 5,
      render: industry_oversea_render,
    },
  ],
  [{ title: intl('438015', '公司地址'), dataIndex: 'reg_address', colSpan: 5 }],
]
