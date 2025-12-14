// import { FileText, LookingClues } from '@/assets/icon/index.ts'
import { Divider } from '@wind/wind-ui'
import classNames from 'classnames'
import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { HistoryList } from './HistoryList.tsx'
import { SuperLogoSection } from './LogoSection'
import styles from './style/index.module.less'
import { postPointBuried } from '@/utils/common/bury.ts'
import { t } from 'gel-util/intl'
import { AireportO, ScaleUpO } from '@wind/rime-icons'
import { useNavigateWithLangSource } from '@/hooks/useLangSource.ts'
import { usedInClient } from 'gel-util/env'
import { isDev } from '@/utils/env.ts'
import { INNER_LINK_PARAM_KEYS } from 'gel-util/link'

const PREFIX = 'home-sider'

const STRINGS = {
  FIND_COMPANY: t('425485', '找企业'),
  MY_FILE: t('464132', '我的下载'),
}

const BURY_NAME = {
  FIND_COMPANY: '找企业',
  MY_FILE: '我的下载',
}

export const HomeSider: React.FC<{
  className?: string
}> = ({ className }) => {
  const navigate = useNavigateWithLangSource()
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
    <div className={classNames(styles[`${PREFIX}-container`], className)}>
      {/* Logo and collapse button */}
      <SuperLogoSection disabled />

      {/* 自定义菜单 */}
      <div className={styles[`${PREFIX}-custom-menu`]}>
        {/* 找线索 */}
        <div
          className={classNames(styles[`${PREFIX}-menu-item`], {
            [styles[`${PREFIX}-menu-item-active`]]: selectedKey === 'search',
          })}
          onClick={() => {
            postPointBuried('922604570272', {
              click: BURY_NAME.FIND_COMPANY,
            })
            navigate('/super')
          }}
        >
          {/* @ts-expect-error Wind-ui */}
          <ScaleUpO style={{ width: 16, marginRight: 8 }} />
          <span className={styles.menuItemText}>{STRINGS.FIND_COMPANY}</span>
        </div>

        {/* 我的文件 */}
        <div
          className={classNames(styles[`${PREFIX}-menu-item`], {
            [styles[`${PREFIX}-menu-item-active`]]: selectedKey === 'my-file',
          })}
          onClick={() => {
            postPointBuried('922604570272', {
              click: BURY_NAME.MY_FILE,
            })
            if (window.location.ancestorOrigins[0]) {
              let baseUrl: URL
              if (usedInClient()) {
                baseUrl = new URL(
                  `${window.location.ancestorOrigins[0]}/Wind.WFC.Enterprise.Web/PC.Front/Company/index.html#/innerlinks`
                )
              } else if (isDev) {
                baseUrl = new URL(`${window.location.ancestorOrigins[0]}/index.html#/innerlinks`)
              } else {
                baseUrl = new URL(`${window.location.ancestorOrigins[0]}/web/ai/index.html#/innerlinks`)
              }
              baseUrl.searchParams.set(INNER_LINK_PARAM_KEYS.TARGET, 'super')
              baseUrl.searchParams.set('path', 'super/my-file')
              navigate(baseUrl.toString())
            } else {
              navigate('/super/my-file')
            }
          }}
        >
          {/* @ts-expect-error Wind-ui */}
          <AireportO style={{ width: 16, marginRight: 8 }} />
          <span className={styles.menuItemText}>{STRINGS.MY_FILE}</span>
        </div>
      </div>

      {/* 横线分割 */}
      <Divider className={styles[`${PREFIX}-divider`]} />

      <HistoryList />
    </div>
  )
}
