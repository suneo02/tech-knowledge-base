import { TextExpandable } from '@/common'
import type { Meta, StoryObj } from '@storybook/react'
import { Button, Card, Space } from 'antd'
import { useState } from 'react'

const meta = {
  title: 'common/TextExpandable',
  component: TextExpandable,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '可展开的文本组件，当文本超过指定行数时显示展开/收起按钮。支持准确的高度检测，避免边界情况下的误判。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    maxLines: {
      control: { type: 'number', min: 1, max: 10, step: 1 },
      description: '最大显示行数',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '3' },
      },
    },
    content: {
      control: { type: 'text' },
      description: '要显示的文本内容',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
  },
} satisfies Meta<typeof TextExpandable>

export default meta
type Story = StoryObj<typeof TextExpandable>

// Mock 长文本数据
const shortText = '这是一段短文本，不需要展开功能。'

const mediumText =
  '这是一段中等长度的文本内容，用于测试组件在不同文本长度下的表现。这段文本可能会超过指定的行数限制，从而触发展开功能。当文本内容超过设定的最大行数时，组件会自动显示"展开"按钮。在实际应用中，用户提供的文本往往包含多个段落，每个段落之间用换行符分隔。 第三段：这段文本还包含了一些特殊字符和标点符号，如：中文标点、英文标点，以及数字12'

const longText = `这是一段很长的文本内容，专门用于测试 TextExpandable 组件的展开和收起功能。这段文本包含了多个段落和丰富的内容，可以很好地展示组件在处理大量文本时的表现。

当文本内容超过设定的最大行数时，组件会自动检测并显示"展开"按钮。用户点击展开按钮后，可以查看完整的文本内容。同时，组件还会显示"收起"按钮，方便用户将文本折叠回原始状态。

这个组件的一个重要特性是能够准确检测文本是否真正需要展开功能。它会创建临时元素来测量文本的实际高度，并与限制高度进行比较。只有当文本确实超出限制时，才会显示展开按钮，避免了边界情况下的误判。

组件还支持响应式设计，当容器大小发生变化时，会自动重新检测文本是否需要展开功能。这确保了在不同屏幕尺寸和窗口大小下都能正常工作。

总的来说，这是一个功能完善、用户体验良好的文本展开组件，适用于各种需要处理长文本内容的场景。`

const multiParagraphText = `第一段：这是一个包含多个段落的长文本示例。每个段落都有不同的内容和长度，用于测试组件在处理复杂文本结构时的表现。

第二段：组件需要能够正确处理包含换行符的文本内容。在实际应用中，用户提供的文本往往包含多个段落，每个段落之间用换行符分隔。

第三段：这段文本还包含了一些特殊字符和标点符号，如：中文标点、英文标点，以及数字123456789等。组件需要能够正确渲染这些内容。

第四段：最后一段文本用于确保组件能够处理足够长的内容，从而触发展开功能的显示。这样可以全面测试组件的各项功能特性。`

// 基础用法
export const Basic: Story = {
  args: {
    maxLines: 3,
    content: longText,
  },
}

// 短文本 - 不需要展开
export const ShortText: Story = {
  args: {
    maxLines: 3,
    content: shortText,
  },
  parameters: {
    docs: {
      description: {
        story: '当文本内容较短，不超过指定行数时，不会显示展开按钮。',
      },
    },
  },
}

// 中等长度文本
export const MediumText: Story = {
  args: {
    maxLines: 3,
    content: mediumText,
  },
  parameters: {
    docs: {
      description: {
        story: '中等长度的文本，刚好超过行数限制，会显示展开按钮。',
      },
    },
  },
}

// 多段落文本
export const MultiParagraph: Story = {
  args: {
    maxLines: 4,
    content: multiParagraphText,
  },
  parameters: {
    docs: {
      description: {
        story: '包含多个段落的文本内容，测试组件对换行符的处理。',
      },
    },
  },
}

// 不同行数限制
export const DifferentMaxLines: Story = {
  render: () => {
    return (
      <div style={{ width: 600 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Card title="1行限制" size="small">
            <TextExpandable maxLines={1} content={longText} />
          </Card>
          <Card title="2行限制" size="small">
            <TextExpandable maxLines={2} content={longText} />
          </Card>
          <Card title="3行限制" size="small">
            <TextExpandable maxLines={3} content={longText} />
          </Card>
          <Card title="5行限制" size="small">
            <TextExpandable maxLines={5} content={longText} />
          </Card>
        </Space>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '展示不同行数限制下的组件表现，从1行到5行的对比效果。',
      },
    },
  },
}

// 边界情况 - 刚好3行的文本
export const EdgeCaseBoundaryText: Story = {
  args: {
    maxLines: 3,
    content:
      '这是第一行文本内容，长度刚好能够填满一行的宽度。\n这是第二行文本内容，同样具有合适的长度。\n这是第三行文本，测试边界情况。',
  },
  parameters: {
    docs: {
      description: {
        story: '边界情况测试：文本刚好占满指定行数，但不超出，应该不显示展开按钮。',
      },
    },
  },
}

// 极短文本
export const VeryShortText: Story = {
  args: {
    maxLines: 3,
    content: '短',
  },
  parameters: {
    docs: {
      description: {
        story: '极短文本测试，只有一个字符。',
      },
    },
  },
}

// 空文本
export const EmptyText: Story = {
  args: {
    maxLines: 3,
    content: '',
  },
  parameters: {
    docs: {
      description: {
        story: '空文本测试，组件应该能够正常处理空字符串。',
      },
    },
  },
}

// 包含特殊字符的文本
export const SpecialCharacters: Story = {
  args: {
    maxLines: 3,
    content:
      '这是一段包含特殊字符的文本：@#$%^&*()_+-=[]{}|;:,.<>?/~`！@#￥%……&*（）——+【】、；：""\'\'《》？。，这些特殊字符应该能够正常显示。测试组件对各种字符的兼容性，包括中英文标点符号、数字123456789、以及其他特殊符号等。这段文本足够长，可以触发展开功能的显示，让我们看看组件如何处理这些复杂的文本内容。',
  },
  parameters: {
    docs: {
      description: {
        story: '测试组件对特殊字符和标点符号的处理能力。',
      },
    },
  },
}

// 响应式测试
export const ResponsiveTest: Story = {
  render: () => {
    return (
      <div>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Card title="窄容器 (300px)" size="small">
            <div style={{ width: 300 }}>
              <TextExpandable maxLines={3} content={longText} />
            </div>
          </Card>
          <Card title="中等容器 (500px)" size="small">
            <div style={{ width: 500 }}>
              <TextExpandable maxLines={3} content={longText} />
            </div>
          </Card>
          <Card title="宽容器 (800px)" size="small">
            <div style={{ width: 800 }}>
              <TextExpandable maxLines={3} content={longText} />
            </div>
          </Card>
        </Space>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '测试组件在不同容器宽度下的响应式表现。组件会根据容器宽度自动调整，并重新检测是否需要展开功能。',
      },
    },
  },
}

// 动态内容测试
export const DynamicContent: Story = {
  render: () => {
    const DynamicContentDemo = () => {
      const [content, setContent] = useState(shortText)
      const [maxLines, setMaxLines] = useState(3)

      const textOptions = [
        { label: '短文本', value: shortText },
        { label: '中等文本', value: mediumText },
        { label: '长文本', value: longText },
        { label: '多段落文本', value: multiParagraphText },
      ]

      return (
        <div style={{ width: 600 }}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Card title="动态内容控制" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <strong>选择文本内容：</strong>
                  <Space wrap style={{ marginTop: 8 }}>
                    {textOptions.map((option) => (
                      <Button
                        key={option.label}
                        size="small"
                        type={content === option.value ? 'primary' : 'default'}
                        onClick={() => setContent(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </Space>
                </div>
                <div>
                  <strong>选择最大行数：</strong>
                  <Space wrap style={{ marginTop: 8 }}>
                    {[1, 2, 3, 4, 5].map((lines) => (
                      <Button
                        key={lines}
                        size="small"
                        type={maxLines === lines ? 'primary' : 'default'}
                        onClick={() => setMaxLines(lines)}
                      >
                        {lines}行
                      </Button>
                    ))}
                  </Space>
                </div>
              </Space>
            </Card>
            <Card title={`当前设置：${maxLines}行限制`} size="small">
              <TextExpandable maxLines={maxLines} content={content} />
            </Card>
          </Space>
        </div>
      )
    }

    return <DynamicContentDemo />
  },
  parameters: {
    docs: {
      description: {
        story: '动态测试：可以实时切换不同的文本内容和行数限制，观察组件的响应和重新检测行为。',
      },
    },
  },
}

// 性能测试 - 大量文本
export const PerformanceTest: Story = {
  args: {
    maxLines: 3,
    content: Array(50).fill(longText).join('\n\n'),
  },
  parameters: {
    docs: {
      description: {
        story: '性能测试：使用大量文本内容测试组件的性能表现和响应速度。',
      },
    },
  },
}

// 多实例测试
export const MultipleInstances: Story = {
  render: () => {
    const instances = Array.from({ length: 6 }, (_, index) => ({
      id: index,
      maxLines: Math.floor(Math.random() * 3) + 2, // 2-4行
      content: index % 3 === 0 ? shortText : index % 3 === 1 ? mediumText : longText,
    }))

    return (
      <div style={{ width: 800 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Card title="多实例测试" size="small">
            <div style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>
              测试页面中同时存在多个 TextExpandable 组件实例时的表现
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {instances.map((instance) => (
                <Card
                  key={instance.id}
                  title={`实例 ${instance.id + 1} (${instance.maxLines}行)`}
                  size="small"
                  style={{ fontSize: 14 }}
                >
                  <TextExpandable maxLines={instance.maxLines} content={instance.content} />
                </Card>
              ))}
            </div>
          </Card>
        </Space>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '多实例测试：在同一页面中显示多个组件实例，测试它们之间是否会相互影响。',
      },
    },
  },
}
