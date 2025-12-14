import { industry_oversea_render } from '@/components/company/info/comp/industry.tsx'
import { corpInfoAnotherNameRow } from '@/components/company/info/rowsCommon/names.tsx'
import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable.ts'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import { ICorpBasicInfoFront } from '../handle.tsx'
import { corpInfoRegAddressRow } from '../rowsCommon/index.ts'

export const englandRows: HorizontalTableColumns<ICorpBasicInfoFront> = [
  [{ title: intl('138677', '企业名称'), dataIndex: 'corp_name', colSpan: 5 }],
  [corpInfoAnotherNameRow],
  [
    { title: intl('138681', '公司类型'), dataIndex: 'corp_type', colSpan: 2 },
    { title: intl('32098', '状态'), dataIndex: 'state', colSpan: 2 },
  ],
  [
    {
      title: window.en_access_config ? intl('32674', '地区') : '国家/地区',
      dataIndex: 'province',
      colSpan: 2,
    },
    { title: intl('6228', '公司编号'), dataIndex: 'biz_reg_no', colSpan: 2 },
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
      title: intl('206125', '关闭/解散日期'),
      dataIndex: 'cancel_date',
      colSpan: 2,
      render: (txt) => {
        return wftCommon.formatTime(txt)
      },
    },
  ],
  [
    {
      title: intl('', '经营范围（SIC）'),
      dataIndex: 'business_scope',
      colSpan: 5,
      render: industry_oversea_render,
    },
  ],
  [corpInfoRegAddressRow],
  [{ title: '公司介绍', dataIndex: 'brief', colSpan: 5 }],
]
