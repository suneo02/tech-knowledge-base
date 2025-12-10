import { CorpSearchRow } from '@/biz/common/CorpPresearch/item'
import { Meta, StoryFn } from '@storybook/react'

// 模拟数据
const mockItems = [
  {
    corpId: '001',
    corpName: '腾讯科技有限公司',
    corpNameEng: 'Tencent Technology Co., Ltd.',
    aiTransFlag: false,
    highlight: [{ label: '公司名称', value: '腾讯' }],
    logo: '',
  },
  {
    corpId: '002',
    corpName: '阿里巴巴集团控股有限公司',
    corpNameEng: 'Alibaba Group Holding Limited',
    aiTransFlag: true,
    highlight: [{ label: '公司名称', value: '阿里巴巴' }],
    logo: '',
  },
  {
    corpId: '003',
    corpName: '百度在线网络技术（北京）有限公司',
    corpNameEng: 'Baidu Online Network Technology (Beijing) Co., Ltd.',
    aiTransFlag: false,
    highlight: [{ label: '公司名称', value: '百度' }],
    logo: '',
  },
  {
    corpId: '004',
    corpName: '字节跳动科技有限公司',
    corpNameEng: 'ByteDance Technology Co., Ltd.',
    aiTransFlag: true,
    highlight: [{ label: '公司名称', value: '字节跳动' }],
    logo: '',
  },
  {
    corpId: '005',
    corpName: '美团点评集团',
    corpNameEng: 'Meituan Dianping Group',
    aiTransFlag: false,
    highlight: [{ label: '公司名称', value: '美团' }],
    logo: '',
  },
  {
    corpId: '006',
    corpName: '滴滴出行科技有限公司',
    corpNameEng: 'Didi Chuxing Technology Co., Ltd.',
    aiTransFlag: true,
    highlight: [{ label: '公司名称', value: '滴滴' }],
    logo: '',
  },
]

export default {
  title: 'Biz/Common/CorpSearchRow',
  component: CorpSearchRow,
  parameters: {
    docs: {
      description: {
        component: '公司搜索结果项组件，支持高亮显示、AI翻译标识等功能',
      },
    },
  },
  argTypes: {
    item: {
      control: 'object',
      description: '公司数据项',
    },
    onClick: {
      action: 'clicked',
      description: '点击回调函数',
    },
    onlyLabel: {
      control: 'boolean',
      description: '是否只显示标签（不显示logo）',
    },
  },
} as Meta<typeof CorpSearchRow>

const Template: StoryFn<typeof CorpSearchRow> = (args) => (
  <div style={{ padding: '20px', maxWidth: '600px' }}>
    <CorpSearchRow {...args} />
  </div>
)

// 基础用法
export const Default = Template.bind({})
Default.args = {
  item: mockItems[0],
  onClick: (item) => console.log('点击公司:', item),
}

// 带AI翻译标识
export const WithAITranslation = Template.bind({})
WithAITranslation.args = {
  item: mockItems[1],
  onClick: (item) => console.log('点击公司:', item),
}

// 只显示标签
export const OnlyLabel = Template.bind({})
OnlyLabel.args = {
  item: mockItems[2],
  onlyLabel: true,
  onClick: (item) => console.log('点击公司:', item),
}

// 英文环境
export const EnglishEnvironment = Template.bind({})
EnglishEnvironment.args = {
  item: mockItems[3],
  onClick: (item) => console.log('点击公司:', item),
}

// 多个搜索结果展示
export const MultipleResults = () => (
  <div style={{ padding: '20px', maxWidth: '600px' }}>
    <h3 style={{ marginBottom: '16px', color: '#333' }}>搜索结果列表</h3>
    {mockItems.map((item, index) => (
      <CorpSearchRow key={item.corpId} item={item} onClick={(item) => console.log('点击公司:', item)} />
    ))}
  </div>
)

// 历史搜索项
export const HistoryItems = () => (
  <div style={{ padding: '20px', maxWidth: '600px' }}>
    <h3 style={{ marginBottom: '16px', color: '#333' }}>历史搜索</h3>
    {mockItems.slice(0, 3).map((item, index) => (
      <CorpSearchRow
        key={item.corpId}
        item={item}
        onlyLabel={true}
        onClick={(item) => console.log('点击历史:', item)}
      />
    ))}
  </div>
)

// 不同高亮匹配
export const DifferentHighlights = () => (
  <div style={{ padding: '20px', maxWidth: '600px' }}>
    <h3 style={{ marginBottom: '16px', color: '#333' }}>不同匹配类型</h3>
    <CorpSearchRow
      item={{
        ...mockItems[0],
        highlight: [{ label: '公司名称', value: '腾讯' }],
      }}
      onClick={(item) => console.log('点击公司:', item)}
    />
    <CorpSearchRow
      item={{
        ...mockItems[1],
        highlight: [{ label: '英文名称', value: 'Alibaba' }],
      }}
      onClick={(item) => console.log('点击公司:', item)}
    />
    <CorpSearchRow
      item={{
        ...mockItems[2],
        highlight: [{ label: '公司地址', value: '北京' }],
      }}
      onClick={(item) => console.log('点击公司:', item)}
    />
  </div>
)

// 无高亮匹配
export const NoHighlight = Template.bind({})
NoHighlight.args = {
  item: {
    ...mockItems[0],
    highlight: [],
  },
  onClick: (item) => console.log('点击公司:', item),
}

// 长公司名称
export const LongCompanyName = Template.bind({})
LongCompanyName.args = {
  item: {
    corpId: '007',
    corpName: '中国石油天然气集团有限公司',
    corpNameEng: 'China National Petroleum Corporation',
    aiTransFlag: false,
    highlight: [{ label: '公司名称', value: '中国石油' }],
    logo: '',
  },
  onClick: (item) => console.log('点击公司:', item),
}

// 英文公司名称
export const EnglishCompanyName = Template.bind({})
EnglishCompanyName.args = {
  item: {
    corpId: '008',
    corpName: 'Microsoft Corporation',
    corpNameEng: 'Microsoft Corporation',
    aiTransFlag: false,
    highlight: [{ label: '公司名称', value: 'Microsoft' }],
    logo: '',
  },
  onClick: (item) => console.log('点击公司:', item),
}
