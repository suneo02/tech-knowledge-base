import { TitleAttachmentRender } from '@/components/company/info/comp/misc.tsx'
import { corpInfoAnotherNameRow } from '@/components/company/info/rowsCommon/names.tsx'
import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable.ts'
import intl from '@/utils/intl'
import React from 'react'
import { industry_gb_render, industry_name_wind_render } from '../comp/industry'
import { ICorpBasicInfoFront } from '../handle'

export const italyRows: HorizontalTableColumns<ICorpBasicInfoFront> = [
  [{ title: intl('138677', '企业名称'), dataIndex: 'corp_name', colSpan: 5 }],
  [corpInfoAnotherNameRow],
  [
    { title: intl('259412', '法律形式'), dataIndex: 'corp_type', colSpan: 2 },
    {
      title: window.en_access_config ? intl('32674', '地区') : '国家/地区',
      dataIndex: 'province',
      colSpan: 2,
    },
  ],
  [
    {
      title: intl('138722', '国民经济行业分类'),
      dataIndex: 'industry_gb',
      colSpan: 5,
      render: industry_gb_render,
    },
    // {
    //   title: <TitleAttachmentRender />,
    //   dataIndex: 'industry_name',
    //   render: industry_name_wind_render,
    //   colSpan: 2,
    // },
  ],
  [{ title: intl('438015', '公司地址'), dataIndex: 'reg_address', colSpan: 5 }],
  [{ title: intl('206088', '活动'), dataIndex: 'business_scope', colSpan: 5 }],
]
