import type { ConversationsProps } from '@ant-design/x'
import type { GetProp } from 'antd'
import { AIChatHistory } from 'gel-api'
import { t } from 'gel-util/intl'

// 定义时间分组枚举
export const ConversationTimeGroupMap = {
  TODAY: t('421524', '今天'),
  YESTERDAY: t('421492', '昨天'),
  LAST_7_DAYS: t('257792', '近7天'),
  LAST_30_DAYS: t('432346', '近30天'),
  EARLIER: t('424255', '更早'),
} as const

export type ConversationTimeGroup = (typeof ConversationTimeGroupMap)[keyof typeof ConversationTimeGroupMap]

export type ConversationItemProps = GetProp<ConversationsProps, 'items'>[number] &
  AIChatHistory & {
    group?: ConversationTimeGroup
    timestamp?: number
  }

/**
 * 获取会话分组配置
 */
export const getGroupableConfig = (): ConversationsProps['groupable'] => ({
  sort(a: ConversationTimeGroup, b: ConversationTimeGroup) {
    const order: ConversationTimeGroup[] = [
      ConversationTimeGroupMap.TODAY,
      ConversationTimeGroupMap.YESTERDAY,
      ConversationTimeGroupMap.LAST_7_DAYS,
      ConversationTimeGroupMap.LAST_30_DAYS,
      ConversationTimeGroupMap.EARLIER,
    ]
    return order.indexOf(a) - order.indexOf(b)
  },
  title: (group: ConversationTimeGroup | undefined, { components: { GroupTitle } }) =>
    group ? (
      <GroupTitle>
        <span style={{ color: '#999', marginInlineStart: 12 }}>{group}</span>
      </GroupTitle>
    ) : (
      <GroupTitle />
    ),
})
