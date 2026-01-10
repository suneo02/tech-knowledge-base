import type { Meta, StoryObj } from '@storybook/react';
import { ProgressRoleMessage } from './progress';

/**
 * 进度消息组件 Story
 *
 * @description
 * 展示 AIGC 生成进度的消息组件，用于报告大纲生成过程中的实时进度反馈。
 *
 * ## 使用场景
 * - 报告大纲生成过程中的步骤进度展示
 * - 长时间任务的进度反馈
 * - 多步骤流程的当前状态提示
 *
 * ## 组件特性
 * - 显示当前步骤名称
 * - 展示进度百分比
 * - 动画效果的进度条
 * - 轻量级的视觉设计
 */
const meta: Meta<typeof ProgressRoleMessage> = {
  title: 'Report/ChatRoles/Progress',
  component: ProgressRoleMessage,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '进度消息组件，用于展示 AIGC 生成过程中的实时进度信息。包含步骤名称和进度百分比的可视化展示。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      description: '进度消息内容对象',
      control: 'object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressRoleMessage>;

/**
 * 默认状态
 *
 * 展示基本的进度消息，包含步骤名称和进度条
 */
export const Default: Story = {
  args: {
    message: {
      currentStepCode: 'TEMPLATE_CONFIRMED',
      currentStepName: '模板已确认',
      progressPercentage: 25,
    },
  },
};

/**
 * 初始状态
 *
 * 任务刚开始时的进度状态（0%）
 */
export const Initial: Story = {
  args: {
    message: {
      currentStepCode: 'TASK_STARTED',
      currentStepName: '任务已开始',
      progressPercentage: 0,
    },
  },
};

/**
 * 进行中状态
 *
 * 任务执行过程中的各个阶段
 */
export const InProgress: Story = {
  args: {
    message: {
      currentStepCode: 'ANALYZING_CONTENT',
      currentStepName: '正在分析内容',
      progressPercentage: 50,
    },
  },
};

/**
 * 即将完成
 *
 * 任务接近完成时的状态（75%）
 */
export const AlmostDone: Story = {
  args: {
    message: {
      currentStepCode: 'FINALIZING',
      currentStepName: '正在完成最后步骤',
      progressPercentage: 75,
    },
  },
};

/**
 * 完成状态
 *
 * 任务完成时的进度状态（100%）
 */
export const Completed: Story = {
  args: {
    message: {
      currentStepCode: 'COMPLETED',
      currentStepName: '生成完成',
      progressPercentage: 100,
    },
  },
};

/**
 * 长文本步骤名称
 *
 * 测试较长的步骤名称的显示效果
 */
export const LongStepName: Story = {
  args: {
    message: {
      currentStepCode: 'PROCESSING_COMPLEX_DATA',
      currentStepName: '正在处理复杂数据并进行深度分析，这可能需要一些时间',
      progressPercentage: 60,
    },
  },
};

/**
 * 多个进度阶段示例
 *
 * 展示报告生成的典型流程
 */
export const TypicalFlow: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '600px' }}>
      <ProgressRoleMessage
        message={{
          currentStepCode: 'TEMPLATE_CONFIRMED',
          currentStepName: '模板已确认',
          progressPercentage: 20,
        }}
      />
      <ProgressRoleMessage
        message={{
          currentStepCode: 'ANALYZING_REQUIREMENTS',
          currentStepName: '正在分析需求',
          progressPercentage: 40,
        }}
      />
      <ProgressRoleMessage
        message={{
          currentStepCode: 'GENERATING_OUTLINE',
          currentStepName: '正在生成大纲',
          progressPercentage: 60,
        }}
      />
      <ProgressRoleMessage
        message={{
          currentStepCode: 'OPTIMIZING_STRUCTURE',
          currentStepName: '正在优化结构',
          progressPercentage: 80,
        }}
      />
      <ProgressRoleMessage
        message={{
          currentStepCode: 'COMPLETED',
          currentStepName: '生成完成',
          progressPercentage: 100,
        }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示报告大纲生成的完整流程，从模板确认到最终完成的各个阶段。',
      },
    },
  },
};

/**
 * 在聊天消息中的展示
 *
 * 模拟在实际聊天界面中的显示效果
 */
export const InChatContext: Story = {
  render: () => (
    <div
      style={{
        width: '800px',
        padding: '20px',
        background: '#f5f5f5',
        borderRadius: '8px',
      }}
    >
      <div style={{ marginBottom: '12px', color: '#666', fontSize: '12px' }}>AI 助手 · 刚刚</div>
      <ProgressRoleMessage
        message={{
          currentStepCode: 'GENERATING_CONTENT',
          currentStepName: '正在生成报告内容',
          progressPercentage: 65,
        }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示进度消息在实际聊天界面中的显示效果，包含时间戳和发送者信息。',
      },
    },
  },
};

/**
 * 响应式布局测试
 *
 * 测试组件在不同屏幕尺寸下的表现
 */
export const ResponsiveLayout: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>桌面端 (600px)</div>
        <div style={{ width: '600px' }}>
          <ProgressRoleMessage
            message={{
              currentStepCode: 'PROCESSING',
              currentStepName: '正在处理数据',
              progressPercentage: 45,
            }}
          />
        </div>
      </div>
      <div>
        <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>平板端 (400px)</div>
        <div style={{ width: '400px' }}>
          <ProgressRoleMessage
            message={{
              currentStepCode: 'PROCESSING',
              currentStepName: '正在处理数据',
              progressPercentage: 45,
            }}
          />
        </div>
      </div>
      <div>
        <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>移动端 (320px)</div>
        <div style={{ width: '320px' }}>
          <ProgressRoleMessage
            message={{
              currentStepCode: 'PROCESSING',
              currentStepName: '正在处理数据',
              progressPercentage: 45,
            }}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '测试进度消息组件在不同屏幕尺寸下的响应式表现。',
      },
    },
  },
};
