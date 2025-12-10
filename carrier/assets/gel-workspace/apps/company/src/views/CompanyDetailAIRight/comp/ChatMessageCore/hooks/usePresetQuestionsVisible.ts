import { MessageInfo } from '@ant-design/x/es/use-x-chat'
import { MsgParsedDepre } from 'gel-ui'
import { useMemo } from 'react'

type PresetQuestionsPosition = 'welcome' | 'after-history'

interface UsePresetQuestionsVisibleReturn {
  shouldShow: boolean
  position: PresetQuestionsPosition
}

/**
 * usePresetQuestionsVisible - 预设问句展示判定 Hook
 *
 * 职责：
 * 1. 判断预设问句是否应该展示
 * 2. 确定预设问句的展示位置
 *
 * 展示规则：
 * - 用户已发送过消息（isSentMsg = true）→ 隐藏
 * - 无历史消息（parsedMessages.length === 0）→ 展示在欢迎消息下方
 * - 有历史消息但用户未发言（isSentMsg = false）→ 展示在历史消息后
 *
 * @param parsedMessages - 解析后的消息列表
 * @param isSentMsg - 用户是否已发送过消息
 * @returns 展示状态和位置
 *
 * @see {@link file:../components/PresetQuestions/index.tsx} - 预设问句组件
 * @see {@link file:../../../../../docs/specs/chat-message-core-preset-questions/spec-design-v1.md} - 设计文档
 */
export const usePresetQuestionsVisible = (
  parsedMessages: MessageInfo<MsgParsedDepre>[],
  isSentMsg: boolean
): UsePresetQuestionsVisibleReturn => {
  // 判断展示位置和是否显示
  const { shouldShow, position } = useMemo(() => {
    // 用户已发送过消息时不显示
    if (isSentMsg) {
      return { shouldShow: false, position: 'welcome' as const }
    }

    // 无历史消息：显示在欢迎消息下方
    if (parsedMessages.length === 0) {
      return { shouldShow: true, position: 'welcome' as const }
    }

    // 有历史消息但用户未发言：显示在历史消息后
    return { shouldShow: true, position: 'after-history' as const }
  }, [parsedMessages, isSentMsg])

  return {
    shouldShow,
    position,
  }
}
