import {
  AgentMsgAIOverall,
  AgentMsgOverall,
  AIHeaderMsg,
  AIMessageGEL,
  AIFooterMsg,
  ChartMessage,
  SimpleChartMessage,
  SplTableMessage,
  SubQuestionMessage,
  SuggestionMessage,
  UserMessageGEL,
} from '@/types'
import { Space } from 'antd'
import { ChatTypeEnum, SplTable } from 'gel-api'
import { isEn } from 'gel-util/intl'
import { FC } from 'react'

/**
 * 处理用户消息
 */
export const createUserMessage = <T extends AgentMsgOverall>(agentMessage: T): UserMessageGEL => {
  if (!agentMessage.content) {
    console.error('agentMessage.content is undefined', agentMessage)
  }
  return {
    role: 'user',
    content: agentMessage.content || '',
  }
}

/**
 * 创建AI头部消息
 */
export const createAIHeaderMessage = <T extends AgentMsgAIOverall>(agentMessage: T, roleName?: string): AIHeaderMsg => {
  const aiHeaderStatus = agentMessage.status === 'pending' ? 'pending' : 'finish'

  const defaultRoleName = 'Alice'
  const displayRoleName = roleName || defaultRoleName

  return {
    role: 'aiHeader',
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
export const createSubQuestionMessage = <T extends AgentMsgAIOverall>(agentMessage: T): SubQuestionMessage | null => {
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
export const createAIContentMessage = <T extends AgentMsgAIOverall>(
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
    status: agentMessage.status || 'finish',
  }
}

/**
 * 创建建议消息
 */
export const createSuggestionMessage = <T extends AgentMsgAIOverall>(agentMessage: T): SuggestionMessage | null => {
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
  }
}

/**
 * 创建图表消息
 */
export const createChartMessage = <T extends AgentMsgAIOverall>(agentMessage: T): ChartMessage | null => {
  if (!agentMessage.gelData) {
    return null
  }

  return {
    role: 'chart',
    content: agentMessage.gelData,
    status: agentMessage.status === 'finish' ? 'finish' : 'pending',
  }
}

/**
 * 创建超级名单表格消息
 */
export const createSplTableMessage = <T extends AgentMsgAIOverall>(agentMessage: T): SplTableMessage | null => {
  // 尝试获取 splTable 数据，支持直接属性和嵌套属性
  let splTables: SplTable[] | undefined = agentMessage.splTable

  if (!splTables || !Array.isArray(splTables) || splTables.length === 0) {
    const withData = agentMessage as unknown as { data?: { result?: { splTable?: SplTable[] } } }
    if (withData.data?.result?.splTable && Array.isArray(withData.data.result.splTable)) {
      splTables = withData.data.result.splTable
    }
  }

  if (!splTables || !Array.isArray(splTables) || splTables.length === 0) {
    return null
  }

  // 流式输出完成 或者 处理完成 才展示表格
  if (agentMessage.status !== 'finish' && agentMessage.status !== 'stream_finish') {
    return null
  }

  return {
    role: 'splTable',
    content: splTables,
    status: agentMessage.status === 'finish' ? 'finish' : 'pending',
  }
}

export const createAIFooterMessage = <T extends AgentMsgAIOverall>(
  agentMessage: T,
  FooterComp?: FC<{ content: string; agentMessage: T; onRetry?: () => void }>
): AIFooterMsg | null => {
  if (agentMessage.status !== 'finish' && agentMessage.status !== 'stream_finish') {
    return null
  }
  if (!FooterComp) {
    return null
  }

  return {
    role: 'aiFooter',
    status: 'finish',
    content: <FooterComp content={agentMessage.content || ''} agentMessage={agentMessage} />,
  }
}

/**
 * 创建简单图表消息
 */
export const createSimpleChartMessage = <T extends AgentMsgAIOverall>(agentMessage: T): SimpleChartMessage | null => {
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
  }
}
