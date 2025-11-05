import React from 'react'

import styles from './index.module.less'

interface OwnItemProps {
  content: string
}

const OwnItem: React.FC<OwnItemProps> = (props) => {
  const { content = 'dsds' } = props

  return (
    <div className={styles.ownRoot}>
      <div className={styles.ownContent}>{content}</div>
    </div>
  )
}

export default OwnItem
