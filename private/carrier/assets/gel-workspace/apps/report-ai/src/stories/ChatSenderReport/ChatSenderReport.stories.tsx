import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ChatSenderReport } from '../../components/ChatCommon/Sender';

const meta: Meta<typeof ChatSenderReport> = {
  title: 'ChatCommon/Sender/ChatSenderReport',
  component: ChatSenderReport,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '聊天发送器组件，支持文本输入、文件上传和消息发送功能。',
      },
    },
  },
  argTypes: {
    className: {
      description: '容器类名',
      control: { type: 'text' },
    },
    senderClassName: {
      description: '发送器类名',
      control: { type: 'text' },
    },
    isLoading: {
      description: '是否正在加载',
      control: { type: 'boolean' },
    },
    value: {
      description: '输入框的值',
      control: { type: 'text' },
    },
    defaultValue: {
      description: '输入框的默认值',
      control: { type: 'text' },
    },
    placeholder: {
      description: '输入框占位符',
      control: { type: 'text' },
    },
    onCancel: {
      description: '取消回调',
      action: 'cancelled',
    },
    sendMessage: {
      description: '发送消息回调',
      action: 'messageSent',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 包装组件，用于处理状态
const ChatSenderReportWrapper = (props: any) => {
  const [content, setContent] = useState(props.defaultValue || '');

  const handleSendMessage = (message: string, options?: any) => {
    console.log('发送消息:', message, '选项:', options);
    setContent('');
  };

  return <ChatSenderReport {...props} value={content} onChange={setContent} sendMessage={handleSendMessage} />;
};

// 基础用法
export const Default: Story = {
  render: (args) => <ChatSenderReportWrapper {...args} />,
  args: {
    placeholder: '告诉我您的写作思路，您也可以直接在下方上传需要引用内容的文件，为您自动生成报告',
  },
};

// 加载状态
export const Loading: Story = {
  render: (args) => <ChatSenderReportWrapper {...args} />,
  args: {
    isLoading: true,
    placeholder: '正在处理中...',
  },
};

// 有默认内容
export const WithDefaultContent: Story = {
  render: (args) => <ChatSenderReportWrapper {...args} />,
  args: {
    defaultValue: '请帮我生成一份关于公司财务状况的分析报告',
    placeholder: '告诉我您的写作思路，您也可以直接在下方上传需要引用内容的文件，为您自动生成报告',
  },
};

// 文件上传功能展示 - 文件展示现在位于 Header 区域
export const WithFileUpload: Story = {
  render: (args) => <ChatSenderReportWrapper {...args} />,
  args: {
    placeholder: '告诉我您的写作思路，您也可以直接在上方上传需要引用内容的文件，为您自动生成报告',
  },
};

// 自定义样式
export const CustomStyle: Story = {
  render: (args) => <ChatSenderReportWrapper {...args} />,
  args: {
    className: 'custom-chat-sender',
    senderClassName: 'custom-sender',
    placeholder: '告诉我您的写作思路，您也可以直接在下方上传需要引用内容的文件，为您自动生成报告',
  },
};

// 禁用状态
export const Disabled: Story = {
  render: (args) => <ChatSenderReportWrapper {...args} />,
  args: {
    isLoading: true,
    placeholder: '当前不可用',
  },
};
