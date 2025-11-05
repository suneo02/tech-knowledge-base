import { Meta, StoryObj } from '@storybook/html'

import { createTag } from './index'

// Create a container to mount our component
const createContainer = (): HTMLDivElement => {
  const container = document.createElement('div')
  container.className = 'tag-story-container'
  container.style.padding = '20px'
  return container
}

// Story metadata
const meta: Meta = {
  title: 'Components/Tag',
  tags: ['autodocs'],
  render: (args) => {
    const container = createContainer()

    // Wait for next tick to ensure DOM is ready
    setTimeout(() => {
      const $container = $(container)
      const $tag = createTag({
        ...args,
        text: args.text || 'Tag',
      })
      $container.append($tag)
    }, 0)

    return container
  },
  argTypes: {
    text: { control: 'text' },
    color: {
      control: { type: 'select' },
      options: [
        'color-1',
        'color-2',
        'color-3',
        'color-4',
        'color-5',
        'color-6',
        'color-7',
        'color-8',
        'color-9',
        'color-10',
      ],
    },
    size: {
      control: { type: 'select' },
      options: ['mini', 'small', 'default', 'large'],
    },
    type: {
      control: { type: 'select' },
      options: ['primary', 'secondary'],
    },
  },
  args: {
    text: 'Tag',
    color: 'color-1',
    size: 'default',
    type: 'primary',
  },
  parameters: {
    docs: {
      description: {
        component: 'A Tag component for categorization or markup. Available in different colors, sizes, and types.',
      },
    },
  },
}

export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => {
    const container = createContainer()

    // Wait for next tick to ensure DOM is ready
    setTimeout(() => {
      const $container = $(container)

      // Create primary and secondary variants
      const types: Array<'primary' | 'secondary'> = ['primary', 'secondary']

      types.forEach((type) => {
        const $tag = createTag({
          text: `${type.charAt(0).toUpperCase() + type.slice(1)} Type`,
          type,
          color: 'color-1',
        })
        $container.append($tag)
        $container.append($('<span>').css('margin-right', '10px'))
      })
    }, 0)

    return container
  },
}

export const ColorVariants: Story = {
  render: () => {
    const container = createContainer()

    // Wait for next tick to ensure DOM is ready
    setTimeout(() => {
      const $container = $(container)

      // Create all color variants
      for (let i = 1; i <= 10; i++) {
        const $tag = createTag({
          text: `Color ${i}`,
          color: `color-${i}` as any,
        })
        $container.append($tag)
      }
    }, 0)

    return container
  },
}

export const SizeVariants: Story = {
  render: () => {
    const container = createContainer()

    // Wait for next tick to ensure DOM is ready
    setTimeout(() => {
      const $container = $(container)

      // Create all size variants
      const sizes: Array<'mini' | 'small' | 'default' | 'large'> = ['mini', 'small', 'default', 'large']

      sizes.forEach((size) => {
        const $tag = createTag({
          text: `${size.charAt(0).toUpperCase() + size.slice(1)} Size`,
          size,
          color: 'color-1',
        })
        $container.append($tag)
        $container.append($('<div>').css('margin-bottom', '10px'))
      })
    }, 0)

    return container
  },
}

export const TypeVariants: Story = {
  render: () => {
    const container = createContainer()

    // Wait for next tick to ensure DOM is ready
    setTimeout(() => {
      const $container = $(container)

      // Create primary and secondary variants
      const types: Array<'primary' | 'secondary'> = ['primary', 'secondary']

      types.forEach((type) => {
        const $tag = createTag({
          text: `${type.charAt(0).toUpperCase() + type.slice(1)} Type`,
          type,
          color: 'color-3',
        })
        $container.append($tag)
        $container.append($('<div>').css('margin-bottom', '10px'))
      })
    }, 0)

    return container
  },
}

export const AllVariants: Story = {
  render: () => {
    const container = createContainer()

    // Wait for next tick to ensure DOM is ready
    setTimeout(() => {
      const $container = $(container)

      // All available options
      const colors = [
        'color-1',
        'color-2',
        'color-3',
        'color-4',
        'color-5',
        'color-6',
        'color-7',
        'color-8',
        'color-9',
        'color-10',
      ]
      const sizes: Array<'mini' | 'small' | 'default' | 'large'> = ['mini', 'small', 'default', 'large']
      const types: Array<'primary' | 'secondary'> = ['primary', 'secondary']

      // Create section for each type and size combination
      types.forEach((type) => {
        sizes.forEach((size) => {
          // Add section title
          $container.append(
            $('<h3>')
              .text(`${type.charAt(0).toUpperCase() + type.slice(1)} - ${size.charAt(0).toUpperCase() + size.slice(1)}`)
              .css('margin-top', '20px')
              .css('margin-bottom', '10px')
          )

          // Create a row for all colors in this type/size
          const $row = $('<div>').css('display', 'flex').css('flex-wrap', 'wrap').css('gap', '10px')

          // Add all colors for this type/size combination
          colors.forEach((color) => {
            const $tag = createTag({
              text: color,
              color: color as any,
              size,
              type,
            })
            $row.append($tag)
          })

          $container.append($row)
          $container.append($('<hr>').css('margin-top', '20px'))
        })
      })
    }, 0)

    return container
  },
}
