import { Meta, StoryObj } from '@storybook/html'
import { renderHKUsedNames } from './index'

// Create a container to mount our component
const createContainer = (): HTMLDivElement => {
  const container = document.createElement('div')
  container.className = 'hk-used-names-story-container'
  container.style.padding = '20px'
  return container
}

// Sample data for stories
const sampleData = [
  {
    used_name: '张三',
    usedEnName: 'Zhang San',
    useFrom: '2020-01-01',
    useTo: '2021-12-31',
  },
  {
    used_name: '小张',
    usedEnName: 'Xiao Zhang',
    useFrom: '2022-01-01',
    useTo: '2023-12-31',
  },
]

// Story metadata
const meta: Meta = {
  title: 'Table/Cells/HKUsedNames',
  tags: ['autodocs'],
  render: (args) => {
    const container = createContainer()

    // Wait for next tick to ensure DOM is ready
    setTimeout(() => {
      const $container = $(container)
      const html = renderHKUsedNames(args.data)
      $container.html(html)
    }, 0)

    return container
  },
  argTypes: {
    data: {
      control: 'object',
      description: 'Array of used names with their date ranges',
    },
  },
  args: {
    data: sampleData,
  },
  parameters: {
    docs: {
      description: {
        component: 'A cell renderer for displaying Hong Kong used names with their date ranges.',
      },
    },
  },
}

export default meta

type Story = StoryObj

// Default story with sample data
export const Default: Story = {
  args: {
    data: sampleData,
  },
}

// Story with single name
export const SingleName: Story = {
  args: {
    data: [
      {
        used_name: '李四',
        usedEnName: 'Li Si',
        useFrom: '2020-01-01',
        useTo: '2023-12-31',
      },
      {
        used_name: '李四',
        usedEnName: 'Li Si',
        useFrom: '2020-01-01',
        useTo: '2023-12-31',
      },
    ],
  },
}

// Story with name only (no dates)
export const NameOnly: Story = {
  args: {
    data: [
      {
        used_name: '王五',
        usedEnName: 'Wang Wu',
      },
    ],
  },
}

// Story with Chinese name only
export const ChineseNameOnly: Story = {
  args: {
    data: [
      {
        used_name: '赵六',
      },
    ],
  },
}

// Story with English name only
export const EnglishNameOnly: Story = {
  args: {
    data: [
      {
        usedEnName: 'Zhao Liu',
      },
    ],
  },
}

// Story with empty data
export const EmptyData: Story = {
  args: {
    data: [],
  },
}

// Story with null data
export const NullData: Story = {
  args: {
    data: null,
  },
}
