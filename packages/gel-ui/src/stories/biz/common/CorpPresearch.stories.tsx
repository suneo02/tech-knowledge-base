import { CorpPresearch } from '@/biz/common/CorpPresearch'
import { CorpPresearchModule } from '@/biz/common/CorpPresearch/historyEnum'
import { Meta, StoryFn } from '@storybook/react'
import { TRequestToWFC } from 'gel-api'
import { useState } from 'react'

type CorpPreSearch = TRequestToWFC<'search/company/getGlobalCompanyPreSearch'>

// 模拟 API 请求
const mockRequestAction = async ({ queryText }: { queryText: string }): ReturnType<CorpPreSearch> => {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 300))

  const mockData = [
    {
      corpId: '001',
      corpName: '腾讯科技有限公司',
      corpNameEng: 'Tencent Technology Co., Ltd.',
      aiTransFlag: false,
      highlight: [{ label: '公司名称', value: queryText }],
      logo: '',
    },
    {
      corpId: '002',
      corpName: '阿里巴巴集团控股有限公司',
      corpNameEng: 'Alibaba Group Holding Limited',
      aiTransFlag: true,
      highlight: [{ label: '公司名称', value: queryText }],
      logo: '',
    },
    {
      corpId: '003',
      corpName: '百度在线网络技术（北京）有限公司',
      corpNameEng: 'Baidu Online Network Technology (Beijing) Co., Ltd.',
      aiTransFlag: false,
      highlight: [{ label: '公司名称', value: queryText }],
      logo: '',
    },
    {
      corpId: '004',
      corpName: '字节跳动科技有限公司',
      corpNameEng: 'ByteDance Technology Co., Ltd.',
      aiTransFlag: true,
      highlight: [{ label: '公司名称', value: queryText }],
      logo: '',
    },
  ]

  return {
    Data: {
      // @ts-expect-error ttt
      search: mockData.filter(
        (item) =>
          item.corpName.toLowerCase().includes(queryText.toLowerCase()) ||
          item.corpNameEng.toLowerCase().includes(queryText.toLowerCase())
      ),
    },
  }
}

// 模拟历史搜索相关函数
const mockAddSearchHistory = async (key: string, val: string) => {
  console.log('添加搜索历史:', key, val)
  return Promise.resolve()
}

const mockGetSearchHistoryAndSlice = async (key: string) => {
  console.log('获取搜索历史:', key)
  return Promise.resolve([
    { entityId: '001', searchKey: '腾讯科技有限公司' },
    { entityId: '002', searchKey: '阿里巴巴集团控股有限公司' },
    { entityId: '003', searchKey: '百度在线网络技术（北京）有限公司' },
  ])
}

const mockDeleteSearchHistoryAll = async (params: any) => {
  console.log('删除搜索历史:', params)
  return Promise.resolve()
}

export default {
  title: 'Biz/Common/CorpPresearch',
  component: CorpPresearch,
  parameters: {
    docs: {
      description: {
        component: '公司预搜索组件，支持自动完成、历史搜索、多选模式等功能',
      },
    },
  },
  argTypes: {
    initialValue: {
      control: 'text',
      description: '初始展示值',
    },
    placeholder: {
      control: 'text',
      description: '输入框提示文字',
    },
    debounceTime: {
      control: { type: 'number', min: 100, max: 1000, step: 100 },
      description: '防抖时间（毫秒）',
    },
    withSearch: {
      control: 'boolean',
      description: '是否显示搜索图标',
    },
    withClear: {
      control: 'boolean',
      description: '是否显示清除按钮',
    },
    widthAuto: {
      control: 'boolean',
      description: '是否自动宽度',
    },
    needHistory: {
      control: 'boolean',
      description: '是否需要历史搜索',
    },
    searchMode: {
      control: { type: 'select', options: ['auto', 'select'] },
      description: '搜索模式：auto-单选，select-多选',
    },
    module: {
      control: { type: 'select', options: Object.values(CorpPresearchModule) },
      description: '模块类型',
    },
    minWidth: {
      control: { type: 'number', min: 200, max: 800, step: 50 },
      description: '最小宽度',
    },
  },
} as Meta<typeof CorpPresearch>

const Template: StoryFn<typeof CorpPresearch> = (args) => {
  const [selectedValue, setSelectedValue] = useState('')

  return (
    <div style={{ padding: '20px' }}>
      <CorpPresearch
        {...args}
        requestAction={mockRequestAction}
        addSearchHistory={mockAddSearchHistory}
        getSearchHistoryAndSlice={mockGetSearchHistoryAndSlice}
        deleteSearchHistoryAll={mockDeleteSearchHistoryAll}
        onChange={(corpId, corpName, data) => {
          console.log('选中公司:', { corpId, corpName, data })
          setSelectedValue(corpName)
        }}
        onClickItem={(item) => {
          console.log('点击选项:', item)
        }}
        onClickHistory={(item) => {
          console.log('点击历史:', item)
        }}
      />
      {selectedValue && <div style={{ marginTop: '10px', color: '#666' }}>已选择: {selectedValue}</div>}
    </div>
  )
}

// 基础用法
export const Default = Template.bind({})
Default.args = {
  placeholder: '请输入企业名称',
  debounceTime: 300,
  withSearch: true,
  withClear: true,
  needHistory: true,
  searchMode: 'auto',
  module: CorpPresearchModule.DEFAULT,
  minWidth: 400,
}

// 多选模式
export const MultiSelect = Template.bind({})
MultiSelect.args = {
  placeholder: '请选择企业（可多选）',
  debounceTime: 300,
  withSearch: true,
  withClear: true,
  needHistory: true,
  searchMode: 'select',
  module: CorpPresearchModule.JOB,
  minWidth: 500,
}

// 招聘模块
export const JobModule = Template.bind({})
JobModule.args = {
  placeholder: '搜索招聘企业',
  debounceTime: 300,
  withSearch: true,
  withClear: true,
  needHistory: true,
  searchMode: 'auto',
  module: CorpPresearchModule.JOB,
  minWidth: 400,
}

// 招投标模块 - 参与单位
export const BidParticipatingUnit = Template.bind({})
BidParticipatingUnit.args = {
  placeholder: '搜索参与单位',
  debounceTime: 300,
  withSearch: true,
  withClear: true,
  needHistory: true,
  searchMode: 'auto',
  module: CorpPresearchModule.BID_SEARCH_PARTICIPATING_UNIT,
  minWidth: 400,
}

// 招投标模块 - 采购单位
export const BidPurchasingUnit = Template.bind({})
BidPurchasingUnit.args = {
  placeholder: '搜索采购单位',
  debounceTime: 300,
  withSearch: true,
  withClear: true,
  needHistory: true,
  searchMode: 'auto',
  module: CorpPresearchModule.BID_SEARCH_PURCHASING_UNIT,
  minWidth: 400,
}

// 招投标模块 - 中标单位
export const BidWinner = Template.bind({})
BidWinner.args = {
  placeholder: '搜索中标单位',
  debounceTime: 300,
  withSearch: true,
  withClear: true,
  needHistory: true,
  searchMode: 'auto',
  module: CorpPresearchModule.BID_SEARCH_BID_WINNER,
  minWidth: 400,
}

// 无历史搜索
export const WithoutHistory = Template.bind({})
WithoutHistory.args = {
  placeholder: '请输入企业名称（无历史）',
  debounceTime: 300,
  withSearch: true,
  withClear: true,
  needHistory: false,
  searchMode: 'auto',
  module: CorpPresearchModule.DEFAULT,
  minWidth: 400,
}

// 无搜索图标
export const WithoutSearchIcon = Template.bind({})
WithoutSearchIcon.args = {
  placeholder: '请输入企业名称（无搜索图标）',
  debounceTime: 300,
  withSearch: false,
  withClear: true,
  needHistory: true,
  searchMode: 'auto',
  module: CorpPresearchModule.DEFAULT,
  minWidth: 400,
}

// 无清除按钮
export const WithoutClearButton = Template.bind({})
WithoutClearButton.args = {
  placeholder: '请输入企业名称（无清除按钮）',
  debounceTime: 300,
  withSearch: true,
  withClear: false,
  needHistory: true,
  searchMode: 'auto',
  module: CorpPresearchModule.DEFAULT,
  minWidth: 400,
}

// 自动宽度
export const AutoWidth = Template.bind({})
AutoWidth.args = {
  placeholder: '请输入企业名称（自动宽度）',
  debounceTime: 300,
  withSearch: true,
  withClear: true,
  widthAuto: true,
  needHistory: true,
  searchMode: 'auto',
  module: CorpPresearchModule.DEFAULT,
  minWidth: 300,
}

// 有初始值
export const WithInitialValue = Template.bind({})
WithInitialValue.args = {
  initialValue: '腾讯科技有限公司',
  placeholder: '请输入企业名称',
  debounceTime: 300,
  withSearch: true,
  withClear: true,
  needHistory: true,
  searchMode: 'auto',
  module: CorpPresearchModule.DEFAULT,
  minWidth: 400,
}

// 快速防抖
export const FastDebounce = Template.bind({})
FastDebounce.args = {
  placeholder: '请输入企业名称（快速防抖）',
  debounceTime: 100,
  withSearch: true,
  withClear: true,
  needHistory: true,
  searchMode: 'auto',
  module: CorpPresearchModule.DEFAULT,
  minWidth: 400,
}

// 慢速防抖
export const SlowDebounce = Template.bind({})
SlowDebounce.args = {
  placeholder: '请输入企业名称（慢速防抖）',
  debounceTime: 800,
  withSearch: true,
  withClear: true,
  needHistory: true,
  searchMode: 'auto',
  module: CorpPresearchModule.DEFAULT,
  minWidth: 400,
}
