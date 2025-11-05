import intl from '../../../../utils/intl'
import { industryTdRender } from '../comp'

export const patentIndustryRows = [
  [
    {
      title: intl('360593', '战略性新兴行业'),
      dataIndex: 'strategicArr',
      colSpan: '3',
      titleAlign: 'left',
      render: industryTdRender,
    },
  ],
  [
    {
      title: intl('312254', '国民经济行业'),
      dataIndex: 'notionalArr',
      colSpan: '3',
      titleAlign: 'left',
      render: industryTdRender,
    },
  ],
  [
    {
      title: intl('441760', '数字经济及其核心产业'),
      dataIndex: 'digitalArr',
      colSpan: '3',
      titleAlign: 'left',
      render: industryTdRender,
    },
  ],
  [
    {
      title: intl('388434', '绿色低碳技术'),
      dataIndex: 'greenLowArr',
      colSpan: '3',
      titleAlign: 'left',
      render: industryTdRender,
    },
  ],
]
