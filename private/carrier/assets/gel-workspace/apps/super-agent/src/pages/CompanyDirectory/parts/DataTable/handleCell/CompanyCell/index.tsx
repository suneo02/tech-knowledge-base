import { isDev } from '@/utils/env'
import { Typography } from 'antd'
import styles from './index.module.less'
import { usedInClient } from 'gel-util/env'
import { generateUrlByModule, LinkModule } from 'gel-util/link'
import React, { useMemo } from 'react'
import { postPointBuried, SUPER_AGENT_BURY_POINTS } from '@/utils/bury'

export interface CompanyCellProps {
  name: string
  code: string
}

// const PREFIX = 'company-directory-company-cell'

const PREFIX = 'company-directory-company-cell'

export const CompanyCell: React.FC<CompanyCellProps> = ({ name, code }) => {
  const url = useMemo(
    () => generateUrlByModule({ module: LinkModule.COMPANY_DETAIL, params: { companycode: code }, isDev }),
    [code]
  )
  const routerCompany = () => {
    postPointBuried(SUPER_AGENT_BURY_POINTS.COMPANY_DETAIL, {
      click_companyname: name,
    })
    if (!url) return
    if (usedInClient()) {
      window.location.href = url
    } else {
      window.open(url, '_blank', 'noopener noreferrer')
    }
  }
  return code ? (
    <Typography.Link
      onClick={routerCompany}
      rel="noopener noreferrer"
      underline
      className={styles[`${PREFIX}-companyLink`]}
    >
      {name}
    </Typography.Link>
  ) : (
    name || ''
  )
}
