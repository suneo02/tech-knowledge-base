import { useEffect, useState } from 'react'
import styles from './index.module.less'
import 'gel-ui/dist/index.css'
import { WindHeader } from 'gel-ui'
import { Outlet } from 'react-router-dom'
import { getAllUrlSearch } from 'gel-util/common'
import { ResponsiveAside } from '@/components/layout/ResponsiveAside'
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
  console.log('🚀 ~ PageContainer ~ fullWidth:', fullWidth)
  const [full, setFull] = useState(false)
  const [showHeader, setShowHeader] = useState(true)
  const params = getAllUrlSearch()
  useEffect(() => {
    setFull(!!fullWidth || !!params.full)
    setShowHeader(!params.notoolbar)
  }, [params, fullWidth])

  return (
    <div className={styles[`${PREFIX}-container`]}>
      {showHeader && (
        <div className={styles[`${PREFIX}-header`]}>
          <WindHeader vip={'svip'} fullWidth={full} isDev={process.env.NODE_ENV === 'development'} />
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
