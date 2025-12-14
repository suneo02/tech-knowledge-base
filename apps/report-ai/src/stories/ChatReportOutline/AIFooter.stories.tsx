import { RPOutlineAIFooter } from '@/components/ChatRPOutline';
import { RPOutlineAgentMsgAI } from '@/types/chat/RPOutline';
import type { Meta, StoryObj } from '@storybook/react';
import { ChatQuestionStatus } from 'gel-api';
import { ChatSenderOptions } from 'gel-ui';

const makeMessage = (overrides: Partial<RPOutlineAgentMsgAI> = {}): RPOutlineAgentMsgAI => {
  return {
    // 基础字段（仅填充组件内部会用到的字段）
    role: 'ai',
    rawSentence: '请根据该公司生成一份报告大纲',
    rawSentenceID: 'raw-1',
    questionStatus: ChatQuestionStatus.SUCCESS,
    entityCode: '',
    reportData: {
      companyList: [
        { companyName: '阿里巴巴', companyCode: 'BABA' },
        { companyName: '腾讯控股', companyCode: '0700' },
        { companyName: '字节跳动', companyCode: 'BYTE' },
      ],
      ...overrides,
    },
  };
};

const meta: Meta<typeof RPOutlineAIFooter> = {
  title: 'ChatReportOutline/AIFooter',
  component: RPOutlineAIFooter,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '报告大纲的 AI 消息 Footer，包含公司选择与基础交互按钮。',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: 800 }}>
      <RPOutlineAIFooter
        content={'这是 AI 回复的内容示例'}
        agentMessage={makeMessage()}
        sendMessage={(message: string, options: Pick<ChatSenderOptions, 'agentId' | 'think' | 'entityCode'>) => {
          // 仅示例：输出到控制台
          // eslint-disable-next-line no-console
          console.log('sendMessage called:', message, options);
        }}
      />
    </div>
  ),
};

export const RetryState: Story = {
  render: () => (
    <div style={{ maxWidth: 800 }}>
      <RPOutlineAIFooter
        content={'这是 AI 回复的内容示例（重试态）'}
        agentMessage={makeMessage({ questionStatus: 0 as unknown as ChatQuestionStatus })}
        sendMessage={(message: string, options: Pick<ChatSenderOptions, 'agentId' | 'think' | 'entityCode'>) => {
          // eslint-disable-next-line no-console
          console.log('sendMessage called:', message, options);
        }}
      />
    </div>
  ),
};
