import { TagWithModule } from '@/biz/common'
import type { Meta, StoryObj } from '@storybook/react'
import { TagsModule } from 'gel-util/biz'

const meta = {
  title: 'biz/common/TagWithModule',
  component: TagWithModule,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '通用标签组件，根据不同的 `module` 显示不同的样式。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    module: {
      control: { type: 'select' },
      options: Object.values(TagsModule),
      description: '标签的模块类型',
    },
    children: {
      control: 'text',
      description: '标签内容',
    },
  },
} satisfies Meta<typeof TagWithModule>

export default meta
type Story = StoryObj<typeof TagWithModule>

export const Default: Story = {
  args: {
    module: TagsModule.COMPANY,
    children: '公司标签',
  },
}

export const TENDER_WINNER: Story = {
  args: {
    module: TagsModule.TENDER_WINNER,
  },
}

export const TENDER_LOSER: Story = {
  args: {
    module: TagsModule.TENDER_LOSER,
  },
}
