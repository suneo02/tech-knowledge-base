import React from 'react'
import styles from './index.module.less'
import { Tooltip } from '@wind/wind-ui'

export interface QuickTabItem {
  key: string
  icon: React.ReactNode
  tooltip: string
}

export interface QuickTabsProps {
  tabs: QuickTabItem[]
  active: string
  onChange: (key: string) => void
}

const PREFIX = 'company-directory-right'

export const QuickTabs: React.FC<QuickTabsProps> = ({ tabs, active, onChange }) => {
  return (
    <div className={styles[`${PREFIX}-quickbar`]}>
      {tabs.map((tab) => (
        <Tooltip key={tab.key} title={tab.tooltip} placement="bottom">
          <div
            role="button"
            tabIndex={0}
            className={styles[`${PREFIX}-quickbarItem`]}
            data-active={active === tab.key ? 'true' : 'false'}
            onClick={() => onChange(tab.key)}
          >
            {tab.icon}
          </div>
        </Tooltip>
      ))}
    </div>
  )
}

export default QuickTabs
