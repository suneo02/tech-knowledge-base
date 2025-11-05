import { GetIntegratedCircuitLayoutDetailResponse } from '@/api/paths'
import SimpleHorizontalTable, { SimpleRowItem } from '@/components/table/horizontal/Simple'
import { t } from 'gel-util/intl'
import React from 'react'

// const PREFIX = 'ic-layout-category'
const STRINGS = {
  IC_LAYOUT_CATEGORY_FUNCTION: t('437893', '功能'),
  IC_LAYOUT_CATEGORY_STRUCTURE: t('452495', '结构'),
  IC_LAYOUT_CATEGORY_TECHNOLOGY: t('452478', '技术'),
}
const ROWS: SimpleRowItem[][] = [
  [
    { title: STRINGS.IC_LAYOUT_CATEGORY_STRUCTURE, dataIndex: 'structure' },
    { title: STRINGS.IC_LAYOUT_CATEGORY_TECHNOLOGY, dataIndex: 'technology' },
  ],
  [{ title: STRINGS.IC_LAYOUT_CATEGORY_FUNCTION, dataIndex: 'function' }],
]

const IcLayoutCategory: React.FC<{ data: GetIntegratedCircuitLayoutDetailResponse['category'] }> = ({ data }) => {
  return <SimpleHorizontalTable rows={ROWS} dataSource={data} />
}

export default IcLayoutCategory
