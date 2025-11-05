import intl from '@/utils/intl'
import React, { FC } from 'react'
import styles from './index.module.less'
import { getUrlByLinkModule, LinksModule, SearchLinkEnum } from '@/handle/link'

export const BreadCrumbT: FC<{
  subTitle: React.ReactNode
  onSubClick?: () => void
  width?: string
}> = ({ subTitle, onSubClick, width = '1260px' }) => {
  return (
    <div className={styles['bread-crumb']}>
      <div className={styles['bread-crumb-content']} style={{ width: width }}>
        <span
          className={styles['last-rank']}
          onClick={() =>
            open(
              getUrlByLinkModule(LinksModule.SEARCH, {
                subModule: SearchLinkEnum.CompanyHomeFront,
              })
            )
          }
        >
          {intl('19475', '首页')}
        </span>
        <i></i>
        <span
          style={{
            cursor: onSubClick ? 'pointer' : 'initial',
          }}
          onClick={() => {
            onSubClick && onSubClick()
          }}
        >
          {subTitle || '--'}
        </span>
      </div>
    </div>
  )
}
