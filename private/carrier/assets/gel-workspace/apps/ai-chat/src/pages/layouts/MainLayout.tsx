import { RimeHeader, WindHeader } from 'gel-ui'
import { Outlet } from 'react-router-dom'
import styles from './mainLayout.module.less'
import { getAllUrlSearch } from 'gel-util/common'
import { isOverseas, selectVipStatus, useAppSelector, VipStatusEnum } from '@/store'
import { isDev } from '@/utils/env'
import { axiosInstance } from '@/api/axios'

export interface MainLayoutProps {
  full?: boolean
  center?: boolean // 是否内容居中
  noPadding?: boolean // 是否去掉内容内边距
}

export const MainLayout = ({ full, center, noPadding }: MainLayoutProps) => {
  console.log('full', full)
  const { notoolbar, linksource } = getAllUrlSearch()
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

  const isDeveloper = localStorage.getItem('GEL_BETA') === 'GelDeveloper'
  const renderHeader = () => {
    if (notoolbar) {
      return null
    }
    if (linksource === 'rimepevc') {
      return <RimeHeader axiosInstance={axiosInstance} />
    }
    return <WindHeader fullWidth={full} vip={vip} isOverseas={_isOverseas} isDev={isDev || isDeveloper} />
  }

  return (
    <div className={styles.mainLayout}>
      {renderHeader()}
      <div className={contentClassName}>
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
