import { HomeSider } from '@/components/SuperList/HomeSider'
import React from 'react'
import { Outlet } from 'react-router-dom'
import styles from './SuperLayout.module.less'
import { fetchPoints, useAppDispatch } from '@/store'

/**
 * Super应用通用布局组件
 * 左侧为HomeSider菜单，右侧为内容区
 * 内容区通过Outlet渲染子路由组件
 */
const SuperLayout: React.FC = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchPoints())
  }, [])
  return (
    <div className={styles['super-layout-container']} data-id="super-home">
      {/* 左侧边栏，保持状态不变 */}
      <HomeSider className={styles['super-layout-sider']} />

      {/* 右侧内容区，通过Outlet渲染子路由 */}
      <div className={styles['content-wrapper']}>
        <Outlet />
      </div>
    </div>
  )
}

export default SuperLayout
