import { CDEProvider } from '@/ctx'
import { SearchableSelectFilter } from '@/FilterItem/conditionItems/SearchableSelectFilter'
import type { Meta, StoryObj } from '@storybook/react'

import { CDEMeasureItem } from 'gel-api'
// Mock measures
const mockMeasures: CDEMeasureItem[] = [
  { field: 'corp_id', title: '企业ID' },
  { field: 'corp_name', title: '企业名称' },
]

type ComponentMeta = Meta<typeof SearchableSelectFilter>

const meta: ComponentMeta = {
  title: 'filter_comp/SearchableSelectFilter',
  component: SearchableSelectFilter,
  decorators: [
    (Story) => (
      <CDEProvider measuresDefault={mockMeasures}>
        <div style={{ width: '800px' }}>
          <Story />
        </div>
      </CDEProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SearchableSelectFilter>

// Helper function to generate mock data based on item type
const getMockData = (itemType: string, value: string) => {
  switch (itemType) {
    case '1':
    case '3':
      return {
        resultCode: '200',
        resultData: [
          { code: '1', name: `Result 1 for ${value}` },
          { code: '2', name: `Result 2 for ${value}` },
        ],
      }
    case '2':
      return {
        resultCode: '200',
        resultData: {
          dataList: [
            { parkId: '1', parkName: `Park 1 matching ${value}` },
            { parkId: '2', parkName: `Park 2 matching ${value}` },
          ],
        },
      }
    default:
      return {
        resultCode: '200',
        resultData: [],
      }
  }
}

// Create individual stories for each input type
export const CompanyName: Story = {
  args: {
    item: {
      itemName: '企业名称',
      searchPlaceholder: '请输入关键词',
      itemType: '91',
      itemEn: '',
      selfDefine: 0,
      itemOption: [
        {
          certYear: 0,
          id: '2010202489|108020121',
          name: '中华老字号',
          validDate: 0,
        },
        {
          certYear: 1,
          id: '2010202476|108020109',
          name: '创新型企业',
          validDate: 0,
        },
        {
          certYear: 0,
          id: '2010202496|108020135',
          name: '创新型中小企业',
          validDate: 1,
        },
        {
          certYear: 1,
          id: '2010202477|108020110',
          name: '隐形冠军企业',
          validDate: 0,
        },
        {
          certYear: 1,
          id: '2010202566|108020097,108020098,108020099',
          name: '制造业单项冠军企业',
          validDate: 1,
        },
        {
          certYear: 1,
          id: '2010100369|108020097',
          name: '制造业单项冠军示范企业',
          validDate: 1,
        },
        {
          certYear: 1,
          id: '2010202513|108020098',
          name: '制造业单项冠军培育企业',
          validDate: 1,
        },
        {
          certYear: 1,
          id: '2010202514|108020099',
          name: '制造业单项冠军产品企业',
          validDate: 1,
        },
        {
          certYear: 0,
          id: '2010202472|108020103',
          name: '双软企业',
          validDate: 1,
        },
        {
          certYear: 0,
          id: '2010202506|108020142',
          name: '联合国责任投资原则组织全球企业',
          validDate: 1,
        },
        {
          certYear: 0,
          id: '2010202507|108020141',
          name: '联合国责任投资原则组织国内企业',
          validDate: 1,
        },
        {
          certYear: 0,
          id: '2010202510|108020146',
          name: '知识产权优势企业\r\n',
          validDate: 1,
        },
        {
          certYear: 0,
          id: '2010202509|108020147',
          name: '知识产权示范企业\r\n',
          validDate: 1,
        },
        {
          certYear: 0,
          id: '2010202511|108020148',
          name: '企业工业设计中心\r\n',
          validDate: 1,
        },
        {
          certYear: 0,
          id: '2010202512|108020149',
          name: '工业设计企业\r\n',
          validDate: 1,
        },
        {
          certYear: 1,
          id: '2010202515|108020194',
          name: '机电产品再制造试点单位',
          validDate: 0,
        },
        {
          certYear: 1,
          id: '2010202567|108020195',
          name: '农业产业化国家重点龙头企业',
          validDate: 0,
        },
      ],
      hasExtra: false,
      parentId: 0,
      isVip: 0,
      itemId: 139,
      itemField: 'corpListDetailQueryLogic',
      logicOption: 'any',
    },
    getBFSD: async (value: string) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return getMockData('1', value)
    },
  },
}

export const ParkSelection: Story = {
  args: {
    item: {
      itemName: '园区名称',
      searchPlaceholder: '请输入关键词',
      itemType: '91',
      itemEn: '',
      selfDefine: 0,
      itemOption: [
        {
          certYear: 0,
          id: '2010202489|108020121',
          name: '中华老字号',
          validDate: 0,
        },
        {
          certYear: 1,
          id: '2010202476|108020109',
          name: '创新型企业',
          validDate: 0,
        },
        {
          certYear: 0,
          id: '2010202496|108020135',
          name: '创新型中小企业',
          validDate: 1,
        },
        {
          certYear: 1,
          id: '2010202477|108020110',
          name: '隐形冠军企业',
          validDate: 0,
        },
        {
          certYear: 1,
          id: '2010202566|108020097,108020098,108020099',
          name: '制造业单项冠军企业',
          validDate: 1,
        },
        {
          certYear: 1,
          id: '2010100369|108020097',
          name: '制造业单项冠军示范企业',
          validDate: 1,
        },
        {
          certYear: 1,
          id: '2010202513|108020098',
          name: '制造业单项冠军培育企业',
          validDate: 1,
        },
        {
          certYear: 1,
          id: '2010202514|108020099',
          name: '制造业单项冠军产品企业',
          validDate: 1,
        },
        {
          certYear: 0,
          id: '2010202472|108020103',
          name: '双软企业',
          validDate: 1,
        },
        {
          certYear: 0,
          id: '2010202506|108020142',
          name: '联合国责任投资原则组织全球企业',
          validDate: 1,
        },
        {
          certYear: 0,
          id: '2010202507|108020141',
          name: '联合国责任投资原则组织国内企业',
          validDate: 1,
        },
        {
          certYear: 0,
          id: '2010202510|108020146',
          name: '知识产权优势企业\r\n',
          validDate: 1,
        },
        {
          certYear: 0,
          id: '2010202509|108020147',
          name: '知识产权示范企业\r\n',
          validDate: 1,
        },
        {
          certYear: 0,
          id: '2010202511|108020148',
          name: '企业工业设计中心\r\n',
          validDate: 1,
        },
        {
          certYear: 0,
          id: '2010202512|108020149',
          name: '工业设计企业\r\n',
          validDate: 1,
        },
        {
          certYear: 1,
          id: '2010202515|108020194',
          name: '机电产品再制造试点单位',
          validDate: 0,
        },
        {
          certYear: 1,
          id: '2010202567|108020195',
          name: '农业产业化国家重点龙头企业',
          validDate: 0,
        },
      ],
      hasExtra: false,
      parentId: 0,
      isVip: 0,
      itemId: 139,
      itemField: 'corpListDetailQueryLogic',
      logicOption: 'any',
    },
    getBFYQ: async (value: string) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return getMockData('2', value)
    },
  },
}
