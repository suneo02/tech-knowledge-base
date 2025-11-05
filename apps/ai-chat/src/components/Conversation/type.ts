import type { ConversationsProps } from '@ant-design/x'
import type { GetProp } from 'antd'
import { ChatHistoryResponse } from 'gel-api'
import { t } from 'gel-util/intl'

// 定义时间分组枚举
export const ConversationTimeGroupMap = {
  TODAY: t('424234', '今天'),
  YESTERDAY: t('421492', '昨天'),
  LAST_7_DAYS: t('424253', '近7天'),
  LAST_30_DAYS: t('424254', '近30天'),
  EARLIER: t('424255', '更早'),
} as const

export type ConversationTimeGroup = (typeof ConversationTimeGroupMap)[keyof typeof ConversationTimeGroupMap]

export type ConversationItemProps = GetProp<ConversationsProps, 'items'>[number] &
  ChatHistoryResponse & {
    group?: ConversationTimeGroup
    timestamp?: number
  }
