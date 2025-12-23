import { CorpTagInDetail, CorpTagInSearch } from '@/biz/common/tag/CorpTag'
import type { Meta, StoryObj } from '@storybook/react'
import { CorpTag, CorpTagType } from 'gel-api'

// All available tag types with their descriptions from comments
const TAG_TYPES_WITH_DESCRIPTIONS: Array<{ type: CorpTagType; description: string }> = [
  { type: 'STOCK', description: '股票' },
  { type: 'INVESTMENT_INSTITUTION', description: '投资机构' },
  { type: 'GROUP_SYSTEM', description: '集团系' },
  { type: 'COMPANY_SCALE', description: '企业规模' },
  { type: 'OWNERSHIP', description: '所有制' },
  { type: 'CONTROL_TYPE', description: '控股类型' },
  { type: 'FINANCING_PHASE', description: '融资阶段' },
  { type: 'LIFE_CYCLE', description: '生命周期' },
  { type: 'CITY_INVESTMENT_COMPANY', description: '城投公司' },
  { type: 'STATE_ENTERPRISE', description: '央企' },
  { type: 'IPO_PROGRESS', description: 'IPO进程' },
  { type: 'OTHER', description: '其他' },
  { type: 'SPECIAL_LIST', description: '特殊名录' },
  { type: 'FAKE_NATION_CORP', description: '假冒国企' },
  { type: 'LIST', description: '名录' },
  { type: 'PRODUCT_WORD', description: '产品词' },
  { type: 'OPERATOR', description: '运营实体' },
  { type: 'RISK', description: '风控' },
  { type: 'INDUSTRY', description: '产业' },
]

// Extract just the types for type checking

// Generate mock tags for all types
const generateMockTags = () => {
  const tags: Record<string, CorpTag> = {}

  TAG_TYPES_WITH_DESCRIPTIONS.forEach((item, index) => {
    tags[item.type.toLowerCase()] = {
      id: index + 1 + '',
      name: item.description,
      type: item.type,
      module: 'CORP',
    }
  })

  return tags
}

const mockCorpTags = generateMockTags()

// Base component meta
const baseCorpTagMeta = {
  title: 'biz/common/CorpTag',
  component: CorpTagInDetail,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '企业标签组件，根据不同的标签类型显示不同的样式。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    corpTag: {
      control: 'object',
      description: '企业标签数据',
    },
    className: {
      control: 'text',
      description: '自定义类名',
    },
    style: {
      control: 'object',
      description: '自定义样式',
    },
    onClick: {
      action: 'clicked',
      description: '点击事件',
    },
  },
} satisfies Meta<typeof CorpTagInDetail>

export default baseCorpTagMeta
type Story = StoryObj<typeof CorpTagInDetail>

// Specialized components
export const SpecializedComponents: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h3>专用标签组件</h3>
      <div>
        <h4>CorpTagInDetail (用于详情页，大号)</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {Object.values(mockCorpTags).map((tag) => (
            <CorpTagInDetail corpTag={tag} tagNameOriginal={tag.name} />
          ))}
        </div>
      </div>
      <div>
        <h4>CorpTagInSearch (用于搜索页，默认大小)</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {Object.values(mockCorpTags).map((tag) => (
            <CorpTagInSearch corpTag={tag} tagNameOriginal={tag.name} />
          ))}
        </div>
      </div>
    </div>
  ),
}
