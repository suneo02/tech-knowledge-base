import type { Meta, StoryObj } from '@storybook/react';
import { ChatSenderReportFooter } from '../../components/ChatCommon/Sender/Footer';
import { ChatSenderProvider } from '../../components/ChatCommon/Sender/context';

interface FooterStoryProps {
  isLoading?: boolean;
  maxFileCount?: number;
  initialContent?: string;
}

const FooterStoryContainer = ({ isLoading = false, maxFileCount = 4, initialContent = '' }: FooterStoryProps) => {
  return (
    <ChatSenderProvider
      config={{
        defaultValue: initialContent,
        isLoading,
        maxFileCount,
        sendMessage: () => undefined,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          border: '1px solid #e9ecef',
          borderRadius: '8px',
          padding: '16px',
        }}
      >
        <ChatSenderReportFooter isLoading={isLoading} maxFileCount={maxFileCount} />
      </div>
    </ChatSenderProvider>
  );
};

const meta: Meta<typeof FooterStoryContainer> = {
  title: 'ChatCommon/Sender/Footer',
  component: FooterStoryContainer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '聊天发送器的底部组件，包含文件上传按钮、文件展示和发送按钮。',
      },
    },
  },
  argTypes: {
    isLoading: {
      description: '是否正在加载',
      control: { type: 'boolean' },
    },
    maxFileCount: {
      description: '允许上传的最大文件数',
      control: { type: 'number' },
    },
    initialContent: {
      description: '初始输入框内容（用于演示）',
      control: { type: 'text' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof FooterStoryContainer>;

export const Default: Story = {
  args: {
    initialContent: '',
    isLoading: false,
    maxFileCount: 4,
  },
};

export const WithInitialContent: Story = {
  args: {
    initialContent: '请帮我生成一份关于公司财务状况的分析报告',
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    initialContent: '正在处理中...',
  },
};

export const CustomFileLimit: Story = {
  args: {
    initialContent: '请帮我分析这些文件',
    maxFileCount: 6,
  },
};
