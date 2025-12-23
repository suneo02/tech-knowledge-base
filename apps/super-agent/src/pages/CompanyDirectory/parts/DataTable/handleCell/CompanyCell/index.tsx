import React, { useMemo, useState } from 'react'
import { Drawer, Typography } from 'antd'
import { Tag } from '@wind/wind-ui'
import { RatiohalfO } from '@wind/icons'
import styles from './index.module.less'
import { generateUrlByModule, LinkModule } from 'gel-util/link'
import { isDev } from '@/utils/env'
import { usedInClient } from 'gel-util/env'

export interface CompanyCellProps {
  name: string
  code: string
  labels: {
    openDrawer: string
    micro: string
    green: string
  }
}

const PREFIX = 'company-directory-company-cell'

export const CompanyCell: React.FC<CompanyCellProps> = ({ name, labels, code }) => {
  const [open, setOpen] = useState(false)
  const url = useMemo(
    () => generateUrlByModule({ module: LinkModule.COMPANY_DETAIL, params: { companycode: code }, isDev }),
    [code]
  )
  const routerCompany = () => {
    if (!url) return
    if (usedInClient()) {
      window.location.href = url
    } else {
      window.open(url, '_blank', 'noopener noreferrer')
    }
  }
  const content = (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* <a
        style={{
          fontSize: 16,
          color: 'var(--font-color-1)',
          textDecoration: 'underline',
          cursor: 'pointer',
          textUnderlineOffset: '4px',
        }}
        onClick={routerCompany}
        rel="noopener noreferrer"
      >
        {name}
      </a> */}
      <Typography.Link onClick={routerCompany} rel="noopener noreferrer" underline>
        {name}
      </Typography.Link>
      <div>
        <Tag color="color-2" type="secondary">
          {labels.micro}
        </Tag>
        <Tag color="color-8" type="secondary">
          {labels.green}
        </Tag>
      </div>
    </div>
  )
  return (
    <div className={`${styles[`${PREFIX}-cellWrapper`]} ${styles[`${PREFIX}-cellInline`]}`}>
      {content}
      <span
        className={styles[`${PREFIX}-cellActionIconInline`]}
        role="button"
        aria-label={labels.openDrawer}
        title={labels.openDrawer}
        onClick={(e) => {
          e.stopPropagation()
          setOpen(true)
        }}
      >
        <RatiohalfO size={16} />
      </span>
      <Drawer open={open} onClose={() => setOpen(false)} title={name} placement="right" width={520}>
        <div className={styles[`${PREFIX}-fullText`]}>{content}</div>
      </Drawer>
    </div>
  )
}
