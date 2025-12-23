/**
 * 流程处理步骤模块
 * 包含各个阶段的处理函数
 *
 * 重构后使用简化的架构：RunContext + StreamDependencies
 */

import { AgentMsgAIDepre } from '@/types'
import { message as messageApi } from '@wind/wind-ui'
import { ChatRunContext } from '../runContext'
import { StreamDependencies } from './types'

/**
 * 流程1: 预处理阶段
 * 包含输入验证、状态初始化、加载状态设置
 */
export async function processPreprocessing<AgentMsg extends AgentMsgAIDepre = AgentMsgAIDepre>(
  context: ChatRunContext,
  dependencies: StreamDependencies<AgentMsg>
): Promise<void> {
  const { input } = context
  const { setContent, setIsChating } = dependencies

  // 输入验证
  if (!input?.content) {
    messageApi.error('出了点问题，请稍后再试')
    throw new Error('Message content is required')
  }

  // 状态初始化
  setContent('')
  setIsChating(true)

  // isFirstQuestion 已在 createChatRunContext 中根据 chatId 自动设置
  // 无需在此处重复设置

  // 创建新的 AbortController（会自动触发 'abortController:created' 事件）
  context.createAbortController()
}
