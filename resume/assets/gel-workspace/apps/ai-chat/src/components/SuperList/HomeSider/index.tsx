import { FileText, LookingClues } from '@/assets/icon/index.ts'
import { Divider } from '@wind/wind-ui'
import classNames from 'classnames'
import React, { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { HistoryList } from './HistoryList.tsx'
import { SuperLogoSection } from './LogoSection.tsx'
import styles from './style/index.module.less'

export const HomeSider: React.FC<{
  className?: string
}> = ({ className }) => {
  const navigate = useNavigate()
  const location = useLocation()

  // 根据当前路径判断选中的菜单项
  const selectedKey = useMemo(() => {
    const { pathname } = location

    if (pathname === '/super' || pathname === '/super/') {
      return 'search'
    }

    if (pathname.includes('/super/my-file')) {
      return 'my-file'
    }

    if (pathname.includes('/super/history')) {
      return 'history'
    }

    return ''
  }, [location])

  return (
    <div className={classNames(styles.sider, className)}>
      {/* Logo and collapse button */}
      <SuperLogoSection />

      {/* 自定义菜单 */}
      <div className={styles.customMenu}>
        {/* 找线索 */}
        <div
          className={classNames(styles.menuItem, { [styles.menuItemActive]: selectedKey === 'search' })}
          onClick={() => navigate('/super')}
        >
          <LookingClues className={styles['sider-icon']} />
          <span className={styles.menuItemText}>找线索</span>
        </div>

        {/* 我的文件 */}
        <div
          className={classNames(styles.menuItem, { [styles.menuItemActive]: selectedKey === 'my-file' })}
          onClick={() => navigate('/super/my-file')}
        >
          <FileText className={styles['sider-icon']} />
          <span className={styles.menuItemText}>我的文件</span>
        </div>
      </div>

      {/* 横线分割 */}
      <Divider className={styles['sider-divider']} />

      <HistoryList />
    </div>
  )
}
