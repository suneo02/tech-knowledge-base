import { CustomSendButton, MessageRaw } from 'ai-ui'
import { FC } from 'react'

interface Props {
  loading?: boolean
  onCancel?: () => void
  sendMessage: (message: string, deepthink: MessageRaw['think']) => void
  className?: string
}

export const SuperListChatSender: FC<Props> = ({ loading, onCancel, sendMessage, className }) => {
  const [content, setContent] = useState('')

  return (
    <Sender
      loading={loading}
      value={content}
      onChange={setContent}
      onCancel={onCancel}
      onSubmit={(message) => sendMessage(message, undefined)}
      className={className}
      actions={
        <div
          onClick={() => {
            if (!loading && content) {
              sendMessage(content, undefined)
            }
          }}
          style={{ cursor: content && !loading ? 'pointer' : loading ? 'default' : 'not-allowed' }}
        >
          <CustomSendButton disabled={!content} isLoading={loading || false} onCancel={onCancel} />
        </div>
      }
    />
  )
}
