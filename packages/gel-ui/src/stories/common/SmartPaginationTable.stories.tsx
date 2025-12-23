import { SmartPaginationTable } from '@/common'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'common/SmartPaginationTable',
  component: SmartPaginationTable,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '智能分页表格组件，根据数据总量自动处理分页显示。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    total: {
      control: { type: 'number' },
      description: '数据总条数',
      table: {
        type: { summary: 'number' },
      },
    },
    showTotal: {
      control: { type: 'boolean' },
      description: '是否显示总条数',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    paginationLabel: {
      control: { type: 'text' },
      description: '分页标签自定义内容',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
    dataSource: {
      description: '表格数据源',
      table: {
        type: { summary: 'array' },
      },
    },
    columns: {
      description: '表格列配置',
      table: {
        type: { summary: 'array' },
      },
    },
    pagination: {
      description: '分页配置，当total<10时，不显示分页',
      table: {
        type: { summary: 'object | false' },
      },
    },
  },
} satisfies Meta<typeof SmartPaginationTable>

export default meta
type Story = StoryObj<typeof SmartPaginationTable>

// 模拟数据
const dataSource = Array.from({ length: 20 }).map((_, index) => ({
  key: index,
  name: `用户${index}`,
  age: 20 + Math.floor(Math.random() * 20),
  address: `城市${index}, 街道${index}`,
}))

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
  },
]

// 基础用法
export const Basic: Story = {
  args: {
    dataSource,
    columns,
    total: dataSource.length,
    pagination: {
      pageSize: 10,
      current: 1,
    },
  },
}

// 显示总条数
export const WithTotal: Story = {
  args: {
    dataSource,
    columns,
    total: dataSource.length,
    showTotal: true,
    pagination: {
      pageSize: 10,
      current: 1,
    },
  },
}

// 自定义分页标签
export const CustomPaginationLabel: Story = {
  args: {
    dataSource,
    columns,
    total: dataSource.length,
    paginationLabel: (
      <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => alert('点击了')}>
        自定义分页标签
      </span>
    ),
    pagination: {
      pageSize: 10,
      current: 1,
    },
  },
}

// 少量数据不显示分页
export const WithoutPagination: Story = {
  args: {
    dataSource: dataSource.slice(0, 5),
    columns,
    total: 5,
  },
}
