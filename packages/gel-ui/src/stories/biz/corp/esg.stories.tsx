import type { Meta, StoryObj } from '@storybook/react'
import type { CorpEsgScore } from 'gel-api'
import { EsgBrand } from '../../../biz/corp/Esg'

const meta: Meta<typeof EsgBrand> = {
  title: 'biz/corp/EsgBrand',
  component: EsgBrand,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Wind ESG 评级徽章组件，展示公司 ESG 评级。',
      },
    },
  },
  argTypes: {
    info: {
      description: 'ESG 评分信息',
      control: 'object',
    },
  },
}
export default meta

type Story = StoryObj<typeof EsgBrand>

const baseInfo: Omit<CorpEsgScore, 'Rating'> = {
  WindCode: '000001.SZ',
  RatingDate: '2024-01-01',
}

export const Rating_AAA: Story = {
  args: {
    info: { ...baseInfo, Rating: 'AAA' },
    style: {
      width: 155,
      height: 155,
    },
  },
}
export const Rating_AA: Story = {
  args: {
    info: { ...baseInfo, Rating: 'AA', RatingDate: '20240101' },
  },
}
export const Rating_A: Story = {
  args: {
    info: { ...baseInfo, Rating: 'A', RatingDate: '' },
  },
}
export const Rating_BBB: Story = {
  args: {
    info: { ...baseInfo, Rating: 'BBB' },
  },
}
export const Rating_BB: Story = {
  args: {
    info: { ...baseInfo, Rating: 'BB' },
  },
}
export const Rating_B: Story = {
  args: {
    info: { ...baseInfo, Rating: 'B' },
  },
}
export const Rating_CCC: Story = {
  args: {
    info: { ...baseInfo, Rating: 'CCC' },
  },
}

export const CustomWidthHeight: Story = {
  args: {
    info: { ...baseInfo, Rating: 'AAA' },
    style: {
      width: 300,
      height: 120,
      border: '1px dashed #aaa',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'style 属性设置宽高 300x120px，测试自适应样式。',
      },
    },
  },
}

export const Narrow: Story = {
  args: {
    info: { ...baseInfo, Rating: 'BBB' },
    style: { width: 180, border: '1px dashed #aaa', padding: 8 },
  },
  parameters: {
    docs: {
      description: {
        story: 'style 属性设置宽度 180px，测试窄容器下的表现。',
      },
    },
  },
}

export const Tall: Story = {
  args: {
    info: { ...baseInfo, Rating: 'BB' },
    style: { height: 200, border: '1px dashed #aaa', padding: 8 },
  },
  parameters: {
    docs: {
      description: {
        story: 'style 属性设置高度 200px，测试高容器下的表现。',
      },
    },
  },
}

export const Large: Story = {
  args: {
    info: { ...baseInfo, Rating: 'AAA' },
    style: { width: 500, height: 500, border: '1px dashed #aaa' },
  },
}

export const Small: Story = {
  args: {
    info: { ...baseInfo, Rating: 'AAA' },
    style: { width: 100, height: 100, border: '1px dashed #aaa' },
  },
}
