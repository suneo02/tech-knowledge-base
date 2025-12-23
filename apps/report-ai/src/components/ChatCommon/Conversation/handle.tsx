import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ConversationTimeGroup, ConversationTimeGroupMap } from 'gel-ui';

// 配置 dayjs
dayjs.extend(relativeTime);
dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);
dayjs.locale('zh-cn');

export const groupConversation = <
  T extends {
    updateTime?: string;
    group?: ConversationTimeGroup;
  },
>(
  conversation: T
): T & {
  group?: ConversationTimeGroup;
} => {
  if (conversation.group) {
    return conversation;
  }
  const updateTime = dayjs(conversation.updateTime);
  const now = dayjs();

  let group: ConversationTimeGroup;
  if (updateTime.isSame(now, 'day')) {
    group = ConversationTimeGroupMap.TODAY;
  } else if (updateTime.isSame(now.subtract(1, 'day'), 'day')) {
    group = ConversationTimeGroupMap.YESTERDAY;
  } else if (updateTime.isBetween(now.subtract(7, 'day'), now.subtract(1, 'day'), 'day', '()')) {
    group = ConversationTimeGroupMap.LAST_7_DAYS;
  } else if (updateTime.isBetween(now.subtract(30, 'day'), now.subtract(7, 'day'), 'day', '[]')) {
    group = ConversationTimeGroupMap.LAST_30_DAYS;
  } else {
    group = ConversationTimeGroupMap.EARLIER;
  }
  return {
    ...conversation,
    group,
  };
};
