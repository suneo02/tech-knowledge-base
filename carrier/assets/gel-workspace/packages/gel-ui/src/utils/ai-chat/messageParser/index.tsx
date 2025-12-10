import {
  AgentMsgAIDepre,
  AgentMsgDepre,
  AIHeaderMsg,
  AIMessageGEL,
  ChartMessage,
  SimpleChartMessage,
  SplTableMessage,
  SubQuestionMessage,
  SuggestionMessage,
  UserMessageGEL,
} from '@/types'
import { Space } from 'antd'
import { ChatTypeEnum } from 'gel-api'
import { isEn } from 'gel-util/intl'
import { FC } from 'react'

/**
 * 处理用户消息
 */
export const createUserMessage = <T extends AgentMsgDepre>(agentMessage: T): UserMessageGEL => {
  if (!agentMessage.content) {
    console.error('agentMessage.content is undefined', agentMessage)
  }
  return {
    role: 'user',
    content: agentMessage.content || '',
    think: agentMessage.think,
  }
}

/**
 * 创建AI头部消息
 */
export const createAIHeaderMessage = <T extends AgentMsgAIDepre>(agentMessage: T, roleName?: string): AIHeaderMsg => {
  const aiHeaderStatus = agentMessage.status === 'pending' ? 'pending' : 'finish'

  const defaultRoleName = 'Alice'
  const displayRoleName = roleName || defaultRoleName

  return {
    role: 'aiHeader',
    think: agentMessage.think,
    status: aiHeaderStatus,
    content: (
      <Space>
        {agentMessage.think
          ? isEn()
            ? `${displayRoleName} (R1)`
            : `${displayRoleName} 深度思考(R1)`
          : displayRoleName}
      </Space>
    ),
    styles: {
      content: {
        fontSize: 16,
        fontWeight: 600,
        backgroundColor: 'transparent',
      },
    },
  }
}

/**
 * 创建子问题消息
 */
export const createSubQuestionMessage = <T extends AgentMsgAIDepre>(agentMessage: T): SubQuestionMessage | null => {
  if (agentMessage.status !== 'pending') {
    return null
  }

  return {
    role: 'subQuestion',
    content: agentMessage.subQuestion || [],
    status: 'pending',
  }
}

/**
 * 创建AI回答消息
 */
export const createAIContentMessage = <T extends AgentMsgAIDepre>(
  agentMessage: T,
  FooterComp?: FC<{ content: string; agentMessage: T; onRetry?: () => void }>
): AIMessageGEL | null => {
  if (!agentMessage.content && !agentMessage.reasonContent) {
    return null
  }
  return {
    role: 'ai',
    content: {
      dpuList: agentMessage.dpuList,
      ragList: agentMessage.ragList,
      answer: agentMessage.content || '',
      reasonContent: agentMessage.reasonContent,
      error: agentMessage.error,
      splTable: agentMessage.splTable,
    },
    footer:
      agentMessage.status === 'finish' || agentMessage.status === 'stream_finish' ? (
        FooterComp ? (
          <FooterComp content={agentMessage.content || ''} agentMessage={agentMessage} />
        ) : null
      ) : null,
    think: agentMessage.think,
    status: agentMessage.status || 'finish',
  }
}

/**
 * 创建建议消息
 */
export const createSuggestionMessage = <T extends AgentMsgAIDepre>(agentMessage: T): SuggestionMessage | null => {
  if (
    (!agentMessage.ragList || agentMessage.ragList.length === 0) &&
    (!agentMessage.dpuList || agentMessage.dpuList.length === 0)
  ) {
    return null
  }
  // 流式输出完成 或者 处理完成 才展示建议
  if (agentMessage.status !== 'finish' && agentMessage.status !== 'stream_finish') {
    return null
  }
  return {
    role: 'suggestion',
    content: {
      ragList: agentMessage.ragList || [],
      dpuList: agentMessage.dpuList || [],
    },
    status: 'finish',
    think: agentMessage.think,
  }
}

/**
 * 创建图表消息
 */
export const createChartMessage = <T extends AgentMsgAIDepre>(agentMessage: T): ChartMessage | null => {
  if (!agentMessage.gelData) {
    return null
  }

  return {
    role: 'chart',
    content: agentMessage.gelData,
    status: agentMessage.status === 'finish' ? 'finish' : 'pending',
    think: agentMessage.think,
  }
}

/**
 * 创建超级名单表格消息
 */
export const createSplTableMessage = <T extends AgentMsgAIDepre>(agentMessage: T): SplTableMessage | null => {
  if (!agentMessage.splTable || agentMessage.splTable.length === 0) {
    return null
  }
  // 流式输出完成 或者 处理完成 才展示表格
  if (agentMessage.status !== 'finish' && agentMessage.status !== 'stream_finish') {
    return null
  }

  return {
    role: 'splTable',
    content: agentMessage.splTable,
    status: agentMessage.status === 'finish' ? 'finish' : 'pending',
    think: agentMessage.think,
  }
}

/**
 * 创建简单图表消息
 */
export const createSimpleChartMessage = <T extends AgentMsgAIDepre>(agentMessage: T): SimpleChartMessage | null => {
  if (
    !agentMessage.dpuList ||
    !agentMessage.chartType || // 图表类型
    ![ChatTypeEnum.BAR, ChatTypeEnum.LINE, ChatTypeEnum.PIE, ChatTypeEnum.DOT].includes(agentMessage.chartType) // 只展示柱状图、折线图、饼图
  ) {
    return null
  }
  // 流式输出完成 或者 处理完成 才展示图表
  if (agentMessage.status !== 'finish' && agentMessage.status !== 'stream_finish') {
    return null
  }

  return {
    role: 'simpleChart',
    content: agentMessage,
    status: agentMessage.status === 'finish' ? 'finish' : 'pending',
    think: agentMessage.think,
  }
}
