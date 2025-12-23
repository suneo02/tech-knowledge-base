import React from 'react'
import styles from './index.module.less'
import { BalanceSubO, DeleteO } from '@wind/icons'

export interface QuickListItem {
  id: number
  icon?: React.ReactNode
  title: string
}

export interface QuickListProps {
  items: QuickListItem[]
  selectedId?: number
  onSelect?: (id: number) => void
}

export const QuickList: React.FC<QuickListProps> = (props) => {
  const { items, selectedId, onSelect } = props

  return (
    <div className={styles['quick-list']}>
      {items.map((it) => (
        <div
          key={it.id}
          className={styles['quick-list-item']}
          data-selected={selectedId === it.id ? 'true' : 'false'}
          onClick={() => onSelect?.(it.id)}
        >
          <div>
            {it.icon ? <span className={styles['quick-list-icon']}>{it.icon}</span> : null}
            <span className={styles['quick-list-title']}>{it.title}</span>
          </div>
          <div>
            <DeleteO />
            <BalanceSubO />
          </div>
        </div>
      ))}
    </div>
  )
}

export default QuickList
