import type { Meta, StoryObj } from '@storybook/react';
import { ReportEditor } from '../../components';

/**
 * ReportEditor 组件基础 Story - HTML 内容测试
 *
 * 这个 Story 专注于测试 HTML 内容的渲染：
 *
 * 1. Default - 基础 HTML 内容测试
 * 2. Default2 - 复杂 HTML 内容测试
 * 3. Empty - 空状态展示
 * 4. Generating - 生成中状态
 *
 * 流式输出测试请查看 ReportEditorStreaming.stories.tsx
 * Markdown 转换测试请查看 ReportEditorMarkdown.stories.tsx
 */

const meta: Meta<typeof ReportEditor> = {
  title: 'Report/ReportEditor',
  component: ReportEditor,
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: '600px',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Story style={{ flex: 1 }} />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ReportEditor>;

// HTML 内容测试
export const Default: Story = {
  args: {
    style: { flex: 1 },
  },
};

export const Default2: Story = {
  args: {},
};

export const Empty: Story = {
  args: {},
};

export const Generating: Story = {
  args: {
    className: 'is-streaming',
  },
};
