import { CompanyCountStats } from '@/BulkImport/CorpMatchConfirm/handle'
import { CompanyMatchTable } from '@/BulkImport/CorpMatchTable'
import { Meta, StoryObj } from '@storybook/react'

import { IndicatorCorpMatchItem } from 'gel-api'

import { corpSearchMock } from './mock/searchMock'

const meta: Meta<typeof CompanyMatchTable> = {
  title: 'BulkImport/CompanyMatchTable',
  component: CompanyMatchTable,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CompanyMatchTable>

export default meta
type Story = StoryObj<typeof CompanyMatchTable>

// 模拟数据
const mockData: IndicatorCorpMatchItem[] = [
  {
    queryText: '小米科技有限责任公司',
    corpId: '1047934153',
    corpName: '小米科技有限责任公司',
    engName: 'XIAOMI INC.',
    creditCode: '91110108551385082Q',
    artificialPerson: '雷军',
    formerName: '北京小米科技有限责任公司',
    source: 1,
    matched: 1,
  },
  {
    queryText: '华为',
    corpId: null,
    corpName: null,
    engName: null,
    creditCode: null,
    artificialPerson: null,
    formerName: null,
    source: null,
    matched: 0,
  },
]

// 基础示例
export const Basic: Story = {
  args: {
    dataSource: mockData,
    loading: false,
    setCountStats: (updater: (prev: CompanyCountStats) => CompanyCountStats) => {
      console.log('setCountStats called with:', updater)
    },
    editItem: (oldData: IndicatorCorpMatchItem, newData: IndicatorCorpMatchItem) => {
      console.log('editItem called with:', { oldData, newData })
    },
    deleteItem: (record: IndicatorCorpMatchItem) => {
      console.log('deleteItem called with:', record)
    },
    searchCompanies: corpSearchMock,
  },
}

// 加载状态
export const Loading: Story = {
  args: {
    ...Basic.args,
    loading: true,
    searchCompanies: corpSearchMock,
  },
}

// 空数据状态
export const Empty: Story = {
  args: {
    ...Basic.args,
    dataSource: [],
    searchCompanies: corpSearchMock,
  },
}

// 全部匹配失败状态
export const AllUnmatched: Story = {
  args: {
    ...Basic.args,
    dataSource: mockData.map((item) => ({
      ...item,
      matched: 0,
      corpId: '',
      corpName: '',
    })),
    searchCompanies: corpSearchMock,
  },
}

// 全部匹配成功状态
export const AllMatched: Story = {
  args: {
    ...Basic.args,
    dataSource: mockData.map((item) => ({
      ...item,
      matched: 2,
      corpId: item.corpId || '999',
      corpName: item.corpName || '匹配后的公司名',
    })),
    searchCompanies: corpSearchMock,
  },
}

// 混合状态（包含香港和台湾企业）
export const MixedSources: Story = {
  args: {
    ...Basic.args,
    dataSource: [...mockData],
    searchCompanies: corpSearchMock,
  },
}
