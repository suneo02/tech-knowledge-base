import { WindHeader } from 'gel-ui'
import { Outlet } from 'react-router-dom'
import styles from './mainLayout.module.less'
import { getAllUrlSearch } from 'gel-util/common'
import { isOverseas, selectVipStatus, useAppSelector, VipStatusEnum } from '@/store'
import { isDev } from '@/utils/env'

export interface MainLayoutProps {
  full?: boolean
  center?: boolean // 是否内容居中
  noPadding?: boolean // 是否去掉内容内边距
}

export const MainLayout = ({ full, center, noPadding }: MainLayoutProps) => {
  console.log('full', full)
  const { notoolbar } = getAllUrlSearch()
  const _isOverseas = useAppSelector(isOverseas)
  console.log('🚀 ~ MainLayout ~ _isOverseas:', _isOverseas)
  const contentClassName = [
    styles.content,
    center ? styles.contentCenter : '',
    noPadding ? styles.contentNoPadding : '',
  ]
    .filter(Boolean)
    .join(' ')
  const vipStatus = useAppSelector(selectVipStatus)
  const vip = vipStatus === VipStatusEnum.SVIP ? 'svip' : vipStatus === VipStatusEnum.VIP ? 'vip' : undefined
  return (
    <div className={styles.mainLayout}>
      {!notoolbar ? <WindHeader fullWidth={full} vip={vip} isOverseas={_isOverseas} isDev={isDev} /> : null}
      <div className={contentClassName}>
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
