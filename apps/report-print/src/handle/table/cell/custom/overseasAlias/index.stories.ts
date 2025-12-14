import { Meta, StoryObj } from '@storybook/html'
import { renderOverseasAlias } from './index'

// Create a container to mount our component
const createContainer = (): HTMLDivElement => {
  const container = document.createElement('div')
  container.className = 'overseas-alias-story-container'
  container.style.padding = '20px'
  return container
}

// Sample data for stories
const sampleData = {
  'United States': [{ formerName: 'Apple Inc.' }, { formerName: 'Apple Computer Company' }],
  'United Kingdom': [{ formerName: 'British Holdings Ltd.' }, { formerName: 'UK Operations Co.' }],
}

// Story metadata
const meta: Meta = {
  title: 'Table/Cells/OverseasAlias',
  tags: ['autodocs'],
  render: (args) => {
    const container = createContainer()

    // Wait for next tick to ensure DOM is ready
    setTimeout(() => {
      const $container = $(container)
      const element = renderOverseasAlias(args.data)
      $container.append(element)
    }, 0)

    return container
  },
  argTypes: {
    data: {
      control: 'object',
      description: 'Object containing overseas aliases grouped by country/region',
    },
  },
  args: {
    data: sampleData,
  },
  parameters: {
    docs: {
      description: {
        component: 'A cell renderer for displaying overseas company aliases grouped by country/region.',
      },
    },
  },
}

export default meta

type Story = StoryObj

// Default story with multiple countries and aliases
export const Default: Story = {
  args: {
    data: sampleData,
  },
}

// Story with single country
export const SingleCountry: Story = {
  args: {
    data: {
      'Hong Kong': [{ formerName: 'HK Enterprise Limited' }, { formerName: 'HK Trading Co.' }],
    },
  },
}

// Story with single alias per country
export const SingleAliasPerCountry: Story = {
  args: {
    data: {
      Singapore: [{ formerName: 'SG Trading Pte Ltd' }],
      Malaysia: [{ formerName: 'MY Holdings Bhd' }],
    },
  },
}

// Story with empty names (should show default empty text)
export const EmptyNames: Story = {
  args: {
    data: {
      Japan: [{ formerName: '' }],
      Korea: [{ formerName: null }],
    },
  },
}

// Story with empty data object
export const EmptyData: Story = {
  args: {
    data: {},
  },
}

// Story with null data
export const NullData: Story = {
  args: {
    data: null,
  },
}

// Story with mixed content
export const MixedContent: Story = {
  args: {
    data: {
      Australia: [
        { formerName: 'AU Trading Pty Ltd' },
        { formerName: '' }, // Empty name
        { formerName: 'AU Holdings' },
      ],
      'New Zealand': [{ formerName: 'NZ Corporation' }],
    },
  },
}
