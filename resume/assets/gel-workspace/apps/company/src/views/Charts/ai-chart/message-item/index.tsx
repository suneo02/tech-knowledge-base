import React from 'react'

import styles from './index.module.less'
import RobotItem from './robot-item'
import OwnItem from './own-item'

interface MessageItemProps {
  content: string
  role: number
  id: string
  fetching: boolean
}

const MessageItem: React.FC<MessageItemProps> = (props) => {
  const { content = '', role, id, fetching } = props

  return (
    <div className={styles.root}>
      {role === 2 ? <RobotItem content={content} id={id} fetching={fetching} /> : <OwnItem content={content} />}
    </div>
  )
}

export default MessageItem
