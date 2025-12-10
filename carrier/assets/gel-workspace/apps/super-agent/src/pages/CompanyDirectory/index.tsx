import React, { useEffect } from 'react'
import { RightPanel } from './parts/RightPanel'
import styles from './index.module.less'
import { getUrlSearchValue } from 'gel-util/common'

export interface CompanyDirectoryProps {
  name?: string
}

const PREFIX = 'company-directory'

export const CompanyDirectory: React.FC<CompanyDirectoryProps> = () => {
  // const [searchParams, setSearchParams] = useSearchParams()
  const selectedId = getUrlSearchValue('selected')

  useEffect(() => {}, [])

  return (
    <div className={styles[`${PREFIX}-container`]}>
      <RightPanel selectedId={Number(selectedId)} />
    </div>
  )
}
