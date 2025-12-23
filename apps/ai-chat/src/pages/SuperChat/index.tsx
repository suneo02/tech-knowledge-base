import { useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import SuperChat from './Chat'
import CDE from './CDE'
import styles from './index.module.less'

const PREFIX = 'super-chat'

const SuperChatHome = () => {
  const params = useParams()
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type')
  console.log('🚀 ~ SuperChatHome ~ type:', type)

  useEffect(() => {
    // console.log('Conversation ID:', params.conversationId)
    // console.log('Type:', type)
    // You can add logic here to handle the type
  }, [params, type])

  const renderContent = () => {
    if (type === 'CDE') {
      return <CDE key={params.conversationId} />
    }
    // Add other conditions for other types
    // else if (type === 'some-other-type') {
    //   return <div>Another interface</div>
    // }
    return (
      <div className={styles[`${PREFIX}-container`]}>
        <SuperChat />
      </div>
    )
  }

  return <div className={styles[`${PREFIX}-container`]}>{renderContent()}</div>
}

export default SuperChatHome
