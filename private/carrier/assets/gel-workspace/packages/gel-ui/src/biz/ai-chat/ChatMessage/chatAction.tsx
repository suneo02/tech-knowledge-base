import { MessageInfo } from '@ant-design/x/es/use-x-chat'
import { t } from 'gel-util/intl'

/**
 * 获取 聊天发送 的 palceholder
 */
export const getChatPlaceholder = (parsedMessages: MessageInfo<any>[], isChating: boolean) => {
  return isChating
    ? t('421517', '正在回答')
    : parsedMessages?.length > 0
      ? t('421516', '您可以继续提问')
      : t('421515', '有什么可以帮你?')
}
