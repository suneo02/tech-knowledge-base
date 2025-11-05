import React from 'react'
import MessageItem from './MessageItem'

const ChatItem = ({ isLoading, chatMessages, handleCopyMessage, handleRetry }) => {
  return chatMessages.map((message) => (
    <MessageItem
      key={message.id}
      message={message}
      isLoading={isLoading}
      handleCopyMessage={handleCopyMessage}
      handleRetry={handleRetry}
    />
  ))
}

export default ChatItem
