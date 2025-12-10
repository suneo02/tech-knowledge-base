import { EditableCorpCell } from '@/BulkImport/EditableCorpCell'
import { Meta, StoryObj } from '@storybook/react'

import { corpSearchMock } from './mock/searchMock'

const meta: Meta<typeof EditableCorpCell> = {
  title: 'BulkImport/EditableCorpCell',
  component: EditableCorpCell,
  parameters: {
    layout: 'centered',
  },

  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof EditableCorpCell>

// 基础用例
export const Default: Story = {
  args: {
    value: {
      corpId: '123',
      corpName: '示例公司',
      queryText: '示例公司',
      matched: 1,
      engName: '',
      creditCode: '',
      artificialPerson: '',
      formerName: '',
      source: 0,
    },
    onChange: (value) => console.log('Changed:', value),
    onDel: () => console.log('Delete clicked'),
    searchCompanies: corpSearchMock,
  },
}

// 编辑状态
export const Editing: Story = {
  args: {
    value: {
      corpId: '123',
      corpName: '示例公司',
      queryText: '示例公司',
      matched: 1,
      engName: '',
      creditCode: '',
      artificialPerson: '',
      formerName: '',
      source: 0,
    },
    isEditing: true,
    onChange: (value) => console.log('Changed:', value),
    onDel: () => console.log('Delete clicked'),
    searchCompanies: corpSearchMock,
  },
}

// 未匹配状态
export const Unmatched: Story = {
  args: {
    value: {
      corpId: '',
      corpName: '',
      queryText: '未匹配公司',
      matched: 0,
      engName: '',
      creditCode: '',
      artificialPerson: '',
      formerName: '',
      source: 0,
    },
    onChange: (value) => console.log('Changed:', value),
    onDel: () => console.log('Delete clicked'),
    searchCompanies: corpSearchMock,
  },
}

// 空状态
export const Empty: Story = {
  args: {
    value: {
      corpId: '',
      corpName: '',
      queryText: '',
      matched: 0,
      engName: '',
      creditCode: '',
      artificialPerson: '',
      formerName: '',
      source: 0,
    },
    onChange: (value) => console.log('Changed:', value),
    onDel: () => console.log('Delete clicked'),
    searchCompanies: corpSearchMock,
  },
}
