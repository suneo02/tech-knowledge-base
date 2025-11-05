import SendBtnIcon from '@/assets/icon/send-btn.svg'
import SendDisabledIcon from '@/assets/icon/send-disabled.svg'
import StopIcon from '@/assets/icon/stop.svg'

import { Sender, Suggestion } from '@ant-design/x'
import React from 'react'
import { ChatSenderProps } from './types'

// 自定义发送按钮组件
const CustomSendButton = ({
  disabled,
  isLoading,
  onCancel,
}: {
  disabled: boolean
  isLoading: boolean
  onCancel?: () => void
}) => {
  if (isLoading) {
    return (
      <div
        style={{ width: 32, height: 32, cursor: 'pointer' }}
        onClick={(e) => {
          e.stopPropagation()
          onCancel?.()
        }}
      >
        <img src={StopIcon} alt="停止" width={32} height={32} />
      </div>
    )
  }

  return (
    <div style={{ width: 32, height: 32 }}>
      {disabled ? (
        <img src={SendDisabledIcon} alt="发送(禁用)" width={32} height={32} />
      ) : (
        <img src={SendBtnIcon} alt="发送" width={32} height={32} />
      )}
    </div>
  )
}

const SuggestionChatSender = (props: ChatSenderProps) => {
  const { isLoading, content, placeholder, className, onCancel, sendMessage, deepthink, headerNode, suggestions } =
    props
  const [value, setValue] = React.useState(content)
  const [open, setOpen] = React.useState(false)
  const handleSuggestionSelect = (item: string) => {
    setValue((val) => val + `sheet:${item}`)
    setOpen(false)
  }

  return (
    <Suggestion open={open} items={suggestions!} onSelect={handleSuggestionSelect}>
      {({ onKeyDown }) => (
        <Sender
          value={value}
          header={headerNode}
          disabled={isLoading}
          placeholder={placeholder}
          loading={isLoading}
          onCancel={onCancel}
          onChange={(nextVal) => {
            if (nextVal.endsWith('@')) {
              setOpen(true)
            } else if (!nextVal) {
              setOpen(false)
            } else {
              setOpen(false)
            }
            setValue(nextVal)
          }}
          onKeyDown={(e) => {
            console.log('onKeyDown', e)
            onKeyDown(e)
            if (e.key === 'Enter') {
              setOpen(false)
            }
          }}
          onSubmit={(message) => {
            if (open) return
            sendMessage(message, undefined, deepthink ? 1 : undefined)
            setValue('')
          }}
          className={className}
          actions={
            <div
              onClick={() => {
                if (!isLoading && value) {
                  sendMessage(value, undefined, deepthink ? 1 : undefined)
                }
              }}
              style={{ cursor: value && !isLoading ? 'pointer' : isLoading ? 'default' : 'not-allowed' }}
            >
              <CustomSendButton disabled={!value} isLoading={isLoading} onCancel={onCancel} />
            </div>
          }
        />
      )}
    </Suggestion>
  )
}

const OnlyChatSender: React.FC<ChatSenderProps> = ({
  isLoading,
  content,
  placeholder,
  className,
  onCancel,
  handleContentChange,
  sendMessage,
  deepthink,
  headerNode,
}) => {
  return (
    <Sender
      value={content}
      header={headerNode}
      disabled={isLoading}
      placeholder={placeholder}
      loading={isLoading}
      onCancel={onCancel}
      onChange={handleContentChange}
      onSubmit={(message) => sendMessage(message, undefined, deepthink ? 1 : undefined)}
      className={className}
      actions={
        <div
          onClick={() => {
            if (!isLoading && content) {
              sendMessage(content, undefined, deepthink ? 1 : undefined)
            }
          }}
          style={{ cursor: content && !isLoading ? 'pointer' : isLoading ? 'default' : 'not-allowed' }}
        >
          <CustomSendButton disabled={!content} isLoading={isLoading} onCancel={onCancel} />
        </div>
      }
    />
  )
}

export const ChatSender = (props: ChatSenderProps) => {
  const { suggestions, ...rest } = props
  return suggestions && suggestions?.length > 0 ? (
    <SuggestionChatSender {...rest} suggestions={suggestions} />
  ) : (
    <OnlyChatSender {...rest} />
  )
}

export { CustomSendButton }
