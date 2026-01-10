import { ResponsiveAside } from '@/components/layout/ResponsiveAside'
import { useAppSelector, VipStatusEnum } from '@/store'
import { WindHeader } from 'gel-ui'
import 'gel-ui/dist/index.css'
import { getAllUrlSearch } from 'gel-util/common'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import styles from './index.module.less'
export type PageContainerProps = {
  full?: boolean
  // 是否启用左侧菜单/侧栏
  enableAside?: boolean
  // 侧栏内容由外部提供，增强可扩展性
  asideContent?: React.ReactNode
  // 可选：自定义侧栏宽度与内容最小宽度
  asideWidth?: number
  contentMinWidth?: number
}

const PREFIX = 'page-container'

export const PageContainer: React.FC<PageContainerProps> = (props) => {
  const { full: fullWidth, enableAside, asideContent, asideWidth, contentMinWidth } = props
  const [full, setFull] = useState(false)
  const [showHeader, setShowHeader] = useState(true)
  const params = getAllUrlSearch()
  const user = useAppSelector((state) => state.user)
  useEffect(() => {
    setFull(!!fullWidth || !!params.full)
    setShowHeader(!params.notoolbar)
  }, [params, fullWidth])
  const isDeveloper = localStorage.getItem('GEL_BETA') === 'GelDeveloper'
  return (
    <div className={styles[`${PREFIX}-container`]}>
      {showHeader && (
        <div className={styles[`${PREFIX}-header`]}>
          <WindHeader
            vip={
              user.vipStatus === VipStatusEnum.SVIP ? 'svip' : user.vipStatus === VipStatusEnum.VIP ? 'vip' : undefined
            }
            fullWidth={full}
            isDev={process.env.NODE_ENV === 'development' || isDeveloper}
          />
        </div>
      )}
      <div className={styles[`${PREFIX}-content`]}>
        {enableAside ? (
          <ResponsiveAside
            enable={true}
            asideWidth={asideWidth}
            contentMinWidth={contentMinWidth}
            asideContent={asideContent}
            mainContent={<Outlet />}
          />
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  )
}
