import { Sender, Suggestion } from '@ant-design/x'
import { ChatInputSendBtn, ChatSenderFooter } from 'gel-ui'
import React, { useCallback, useEffect, useRef } from 'react'
import { ChatSenderProps } from './types'
import { GetRef } from 'antd'

const SuggestionChatSender = (props: ChatSenderProps) => {
  const {
    isLoading,
    content,
    placeholder,
    className,
    onCancel,
    sendMessage,
    headerNode,
    suggestions,
    handleContentChange,
    focus,
  } = props
  const senderRef = useRef<GetRef<typeof Sender>>(null)
  const [value, setValue] = React.useState(content)
  const [open, setOpen] = React.useState(false)
  const handleSuggestionSelect = (item: string) => {
    setValue((val) => val + `sheet:${item}`)
    setOpen(false)
  }
  const handleSend = useCallback(() => {
    if (open) return

    if (!isLoading && content) {
      sendMessage(content, undefined)
      setValue('')
    } else {
      onCancel?.()
    }
  }, [open, isLoading, content, sendMessage, onCancel])
  useEffect(() => {
    if (focus) {
      senderRef.current?.focus()
    }
  }, [focus])
  return (
    <Suggestion open={open} items={suggestions!} onSelect={handleSuggestionSelect}>
      {({ onKeyDown }) => (
        <Sender
          ref={senderRef}
          value={value}
          header={headerNode}
          disabled={isLoading}
          placeholder={placeholder}
          loading={isLoading}
          onCancel={onCancel}
          // maxLength={maxLength}
          onChange={(nextVal) => {
            if (nextVal.endsWith('@')) {
              setOpen(true)
            } else if (!nextVal) {
              setOpen(false)
            } else {
              setOpen(false)
            }
            setValue(nextVal)
            handleContentChange?.(nextVal)
          }}
          onKeyDown={(e) => {
            console.log('onKeyDown', e)
            onKeyDown(e)
            if (open) {
              setOpen(false)
            } else if (e.key === 'Enter') {
              handleSend()
            }
          }}
          className={className}
          actions={
            <div style={{ cursor: value && !isLoading ? 'pointer' : isLoading ? 'default' : 'not-allowed' }}>
              <ChatInputSendBtn isLoading={isLoading} isActive={!!content} onClick={handleSend} />
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
  headerNode,
  renderLeftActions,
  renderRightActions,
  focus,
  maxLength,
}) => {
  const senderRef = useRef<GetRef<typeof Sender>>(null)
  const handleSend = useCallback(() => {
    if (!isLoading && content) {
      sendMessage(content, undefined)
    } else {
      onCancel?.()
    }
  }, [isLoading, content, sendMessage, onCancel])

  useEffect(() => {
    if (focus) {
      senderRef.current?.focus()
    }
  }, [focus])

  // 没有自定义footer，则默认一行展示，不展示footer
  if (!renderLeftActions && !renderRightActions && !maxLength) {
    return (
      <Sender
        ref={senderRef}
        value={content}
        header={headerNode}
        disabled={isLoading}
        placeholder={placeholder}
        loading={isLoading}
        onCancel={onCancel}
        onChange={handleContentChange}
        onSubmit={(message) => sendMessage(message, undefined)}
        className={className}
        actions={
          <div style={{ cursor: content && !isLoading ? 'pointer' : isLoading ? 'default' : 'not-allowed' }}>
            <ChatInputSendBtn isLoading={isLoading} isActive={!!content} onClick={handleSend} />
          </div>
        }
      />
    )
  }
  return (
    <Sender
      ref={senderRef}
      value={content}
      header={headerNode}
      disabled={isLoading}
      placeholder={placeholder}
      loading={isLoading}
      onCancel={onCancel}
      onChange={handleContentChange}
      onSubmit={(message) => sendMessage(message, undefined)}
      className={className}
      actions={false}
      footer={
        <ChatSenderFooter
          isLoading={isLoading}
          content={content}
          handleSend={handleSend}
          renderLeftActions={renderLeftActions}
          renderRightActions={renderRightActions}
          maxLength={maxLength}
        />
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
