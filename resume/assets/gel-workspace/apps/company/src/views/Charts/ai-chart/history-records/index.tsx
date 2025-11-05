import React, { useEffect, useState } from 'react'

import { getAiGraphChatHistory } from '../../../../api/ai-graph'
import styles from './index.module.less'

interface HistoryRecordsProps {
  handleClick: (id: string) => void
}

const HistoryRecords: React.FC<HistoryRecordsProps> = (props) => {
  const { handleClick } = props
  const [list, setList] = useState([])

  useEffect(() => {
    getList()
  }, [])

  async function getList() {
    try {
      const res = await getAiGraphChatHistory('6535663')
      if (res.data) {
        setList(res.data)
      }
    } catch (err) { }
  }

  return (
    <div className={styles.list}>
      {list.map((item) => {
        return (
          <div key={item.id} className={styles.item} onClick={() => handleClick(item.id)}>
            <p className={styles.title}>{item.title}</p>
            <span className={styles.type}>AI构建图谱</span>
          </div>
        )
      })}
    </div>
  )
}

export default HistoryRecords
