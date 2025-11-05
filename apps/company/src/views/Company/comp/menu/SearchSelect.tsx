import React, { FC, ReactNode } from 'react'
import { isArray } from 'lodash'
import styles from './style/searchSelect.module.less'

export const CorpDetailMenuSearchSelect: FC<{
  searchedMenu?: {
    span: ReactNode
    key: React.Key
  }[]
  className?: string
  treeMenuClick: (keys: React.Key[], options: { selected: boolean }) => void
}> = ({ searchedMenu, treeMenuClick, className }) => {
  if (!searchedMenu || !isArray(searchedMenu) || searchedMenu.length <= 0) {
    return null
  }
  return (
    <div className={`${styles['search-select']} ${className}`}>
      {searchedMenu?.map((t) => {
        return (
          <span
            className={`${styles['search-select--item']}`}
            key={t.key}
            onClick={() => treeMenuClick([t.key], { selected: true })}
          >
            {t.span}
          </span>
        )
      })}
    </div>
  )
}
