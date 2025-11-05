import { HorizontalTableCol } from '@/types/WindUI/horizontalTable.ts'
import intl from '@/utils/intl'
import React from 'react'
import { ICorpBasicInfoFront } from '../handle'
import { IndustryRowDisplay } from '@/handle/corpModuleCfg/base/baseIndustry/components/IndustryRowDisplay'

export const corpInfoIndustryRow = (): HorizontalTableCol<ICorpBasicInfoFront> => ({
  title: intl(138722, '国民经济行业分类'),
  dataIndex: 'industryGbFold',
  colSpan: 5,
  render: (_, record) => {
    const list = record.gbIndustryList
    if (!list) return null
    return (
      <div id="industry-gb-row">
        <IndustryRowDisplay
          key={'industryGbFold'}
          rowData={{
            list: list?.map((res, index) => ({
              id: res.industryCode,
              name: `${res.industryName}${index === list.length - 1 ? `(${res.industryCode})` : ''}`,
            })),
          }}
          baseKey={'industryGbFold'}
        />
      </div>
    )
  },
})
