import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ContentEditable } from '../../components/common';

// 简单的 action 函数替代
const action =
  (name: string) =>
  (...args: any[]) => {
    console.log(`[Storybook Action] ${name}:`, ...args);
  };

const meta: Meta<typeof ContentEditable> = {
  title: 'Common/ContentEditable',
  component: ContentEditable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '可编辑内容组件，基于 contentEditable 实现，支持自动聚焦、占位符、只读模式等功能。解决了光标跳跃等 contentEditable 的常见问题。',
      },
    },
  },
  argTypes: {
    content: {
      control: 'text',
      description: '内容文本',
    },
    placeholder: {
      control: 'text',
      description: '占位符文本',
    },
    autoFocus: {
      control: 'boolean',
      description: '是否自动聚焦',
    },
    readonly: {
      control: 'boolean',
      description: '是否只读',
    },
    className: {
      control: 'text',
      description: '自定义样式类名',
    },
    onContentChange: {
      action: 'contentChanged',
      description: '内容变更回调',
    },
    onFocus: {
      action: 'focused',
      description: '聚焦事件回调',
    },
    onBlur: {
      action: 'blurred',
      description: '失焦事件回调',
    },
    onKeyDown: {
      action: 'keyDown',
      description: '键盘事件回调',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ContentEditable>;

// 基础故事 - 默认状态
export const Default: Story = {
  args: {
    content: '',
    placeholder: '请输入内容...',
    autoFocus: false,
    readonly: false,
    onContentChange: action('contentChanged'),
    onFocus: action('focused'),
    onBlur: action('blurred'),
    onKeyDown: action('keyDown'),
  },
  parameters: {
    docs: {
      description: {
        story: '默认的可编辑内容组件，显示占位符文本。',
      },
    },
  },
};

// 带初始内容
export const WithInitialContent: Story = {
  args: {
    ...Default.args,
    content: '这是初始内容',
  },
  parameters: {
    docs: {
      description: {
        story: '带有初始内容的编辑器。',
      },
    },
  },
};

// 自动聚焦
export const AutoFocus: Story = {
  args: {
    ...Default.args,
    autoFocus: true,
    content: '自动聚焦的内容',
  },
  parameters: {
    docs: {
      description: {
        story: '自动聚焦到编辑器，光标会定位到内容末尾。',
      },
    },
  },
};

// 只读模式
export const ReadOnly: Story = {
  args: {
    ...Default.args,
    content: '这是只读内容，无法编辑',
    readonly: true,
  },
  parameters: {
    docs: {
      description: {
        story: '只读模式，内容不可编辑。',
      },
    },
  },
};

// 自定义占位符
export const CustomPlaceholder: Story = {
  args: {
    ...Default.args,
    placeholder: '输入您的想法和创意...',
  },
  parameters: {
    docs: {
      description: {
        story: '使用自定义占位符文本。',
      },
    },
  },
};

// 长文本内容
export const LongContent: Story = {
  args: {
    ...Default.args,
    content:
      '这是一段很长的文本内容，用来测试组件在处理长文本时的表现。文本会自动换行，并且保持良好的编辑体验。用户可以在任意位置插入或删除内容，光标位置会正确保持。',
  },
  parameters: {
    docs: {
      description: {
        story: '测试长文本内容的编辑体验。',
      },
    },
  },
};

// 多行内容
export const MultilineContent: Story = {
  args: {
    ...Default.args,
    content: `第一行内容
第二行内容
第三行内容`,
  },
  parameters: {
    docs: {
      description: {
        story: '多行文本内容，测试换行符的处理。',
      },
    },
  },
};

// 交互式演示
export const InteractiveDemo: Story = {
  render: (args) => {
    const [content, setContent] = useState(
      '"1. 字段提取 - 梳理主要产品/服务、产能利用率、订单满足率、交付准时率\n2. 产能分析 - 评估当前产能与市场需求的匹配情况\n3. 交付评估 - 分析交付准时率对客户满意度的影响\n4. 订单满足率分析 - 判断企业在市场中的响应能力\n5. 结论撰写 - 识别企业运营效率及改进空间"'
    );
    const [focused, setFocused] = useState(false);
    const [lastKey, setLastKey] = useState('');

    return (
      <div style={{ padding: '20px', border: '1px solid #d9d9d9', borderRadius: '6px' }}>
        <h4>交互式演示</h4>
        <div style={{ marginBottom: '16px' }}>
          <ContentEditable
            {...args}
            content={content}
            onContentChange={(newContent) => {
              setContent(newContent);
              action('contentChanged')(newContent);
            }}
            onFocus={() => {
              setFocused(true);
              action('focused')();
            }}
            onBlur={() => {
              setFocused(false);
              action('blurred')();
            }}
            onKeyDown={(event) => {
              setLastKey(event.key);
              action('keyDown')(event);
            }}
          />
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          <p>
            <strong>当前内容：</strong>
            {content || '(空)'}
          </p>
          <p>
            <strong>聚焦状态：</strong>
            {focused ? '已聚焦' : '未聚焦'}
          </p>
          <p>
            <strong>最后按键：</strong>
            {lastKey || '(无)'}
          </p>
        </div>
      </div>
    );
  },
  args: {
    placeholder: '开始输入...',
    autoFocus: false,
    readonly: false,
  },
  parameters: {
    docs: {
      description: {
        story: '交互式演示，实时显示内容变化、聚焦状态和按键信息。',
      },
    },
  },
};

// 自定义样式
export const CustomStyle: Story = {
  args: {
    ...Default.args,
    content: '这是带有自定义样式的内容',
    className: 'custom-editable',
  },
  decorators: [
    (Story) => (
      <div>
        <style>{`
          .custom-editable {
            background-color: #f6f8fa;
            border: 1px solid #d1d9e0;
            border-radius: 6px;
            padding: 8px 12px;
            font-family: 'SF Mono', Monaco, monospace;
            font-size: 14px;
            line-height: 1.4;
          }
          .custom-editable:focus {
            border-color: #0969da;
            box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.1);
          }
        `}</style>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: '使用自定义样式的编辑器，展示样式定制能力。',
      },
    },
  },
};

// 键盘事件测试
export const KeyboardEvents: Story = {
  render: (args) => {
    const [content, setContent] = useState('测试键盘事件');
    const [events, setEvents] = useState<string[]>([]);

    const handleKeyDown = (event: React.KeyboardEvent) => {
      const eventInfo = `${event.key} (${event.code})`;
      setEvents((prev) => [...prev.slice(-4), eventInfo]);
      action('keyDown')(event);
    };

    return (
      <div style={{ padding: '20px', border: '1px solid #d9d9d9', borderRadius: '6px' }}>
        <h4>键盘事件测试</h4>
        <div style={{ marginBottom: '16px' }}>
          <ContentEditable {...args} content={content} onContentChange={setContent} onKeyDown={handleKeyDown} />
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          <p>
            <strong>最近的按键事件：</strong>
          </p>
          <ul>
            {events.map((event, index) => (
              <li key={index}>{event}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  },
  args: {
    placeholder: '按下不同的键测试...',
    autoFocus: true,
  },
  parameters: {
    docs: {
      description: {
        story: '测试各种键盘事件的处理，包括特殊键和组合键。',
      },
    },
  },
};

// 内容同步测试
export const ContentSync: Story = {
  render: (args) => {
    const [content, setContent] = useState('初始内容');
    const [externalContent, setExternalContent] = useState('初始内容');

    const updateExternalContent = () => {
      const newContent = `外部更新: ${new Date().toLocaleTimeString()}`;
      setExternalContent(newContent);
      setContent(newContent);
    };

    return (
      <div style={{ padding: '20px', border: '1px solid #d9d9d9', borderRadius: '6px' }}>
        <h4>内容同步测试</h4>
        <div style={{ marginBottom: '16px' }}>
          <ContentEditable {...args} content={content} onContentChange={setContent} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <button
            onClick={updateExternalContent}
            style={{
              padding: '6px 12px',
              backgroundColor: '#0969da',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            外部更新内容
          </button>
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          <p>
            <strong>当前内容：</strong>
            {content}
          </p>
          <p>
            <strong>外部内容：</strong>
            {externalContent}
          </p>
        </div>
      </div>
    );
  },
  args: {
    placeholder: '测试内容同步...',
  },
  parameters: {
    docs: {
      description: {
        story: '测试外部内容更新时的同步机制，确保不会导致光标跳跃。',
      },
    },
  },
};
