import { message } from '@wind/wind-ui'
import { ChatInputSendBtn } from '../ChatInputSendBtn'
import cn from 'classnames'
import styles from './index.module.less'

export interface ChatSenderFooterContext {
  isLoading?: boolean
  content: string
  handleSend: () => void
  notify: typeof message
}

export interface ChatSenderFooterProps {
  // 业务上下文
  isLoading?: boolean
  content: string
  handleSend: () => void

  // 插槽式自定义渲染。若不提供则渲染默认按钮
  renderLeftActions?: (ctx: ChatSenderFooterContext) => React.ReactNode
  renderRightActions?: (ctx: ChatSenderFooterContext) => React.ReactNode

  // 最大长度
  maxLength?: number
}
const PREFIX = 'chat-sender-footer'
export const ChatSenderFooter = ({
  isLoading,
  content,
  handleSend,
  renderLeftActions,
  renderRightActions,
  maxLength,
}: ChatSenderFooterProps) => {
  const ctx: ChatSenderFooterContext = {
    isLoading,
    content,
    handleSend,
    notify: message,
  }

  const renderDefaultRight = () => {
    return (
      <div className={styles[`${PREFIX}-right-default`]}>
        {maxLength ? (
          <div
            className={cn(styles[`${PREFIX}-right-default-length`], {
              [styles[`${PREFIX}-right-default-length-danger`]]: content.length === maxLength,
            })}
          >
            {content.length} / {maxLength}
          </div>
        ) : null}
        <div className={styles[`${PREFIX}-right-default-btn`]}>
          <ChatInputSendBtn isLoading={isLoading} isActive={!!content} onClick={handleSend} />
        </div>
      </div>
    )
  }
  return (
    <div className={styles[`${PREFIX}-container`]}>
      <div className={styles[`${PREFIX}-left`]}>{renderLeftActions ? renderLeftActions(ctx) : null}</div>
      <div className={styles[`${PREFIX}-right`]}>
        {renderRightActions ? renderRightActions(ctx) : renderDefaultRight()}
      </div>
    </div>
  )
}
