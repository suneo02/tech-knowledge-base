import { FolderO, HomeO } from '@wind/icons'
import { t } from 'gel-util/intl'
import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './index.module.less'

export interface AppSideMenuItem {
  key: string
  label: string
  path: string
  icon?: React.ReactNode
}

export interface AppSideMenuProps {
  items?: AppSideMenuItem[]
  roles?: string[]
  defaultRole?: string
  onRoleChange?: (role: string) => void
  roleCards?: {
    key: string
    label: string
    miniSrc: string
    fullSrc: string
  }[]
}

const PREFIX = 'app-side-menu'

export const AppSideMenu: React.FC<AppSideMenuProps> = (props) => {
  const location = useLocation()
  const navigate = useNavigate()

  const STRINGS = {
    MENU_HOME: t('254999', '找客户'),
    // MENU_PROSPECT: t('482234', '线索拓展'),
    MENU_COMPANY: t('464132', '我的下载'),
  } as const

  const defaultItems: AppSideMenuItem[] = [
    {
      key: 'home',
      label: STRINGS.MENU_HOME,
      path: '/home',
      icon: <HomeO style={{ fontSize: 18 }} />,
    },
    //   { key: 'prospect', label: STRINGS.MENU_PROSPECT, path: '/prospect', icon: <SearchO /> },
    {
      key: 'company',
      label: STRINGS.MENU_COMPANY,
      path: '/my-file',
      icon: <FolderO style={{ fontSize: 18 }} />,
    },
  ]

  const items = props.items ?? defaultItems

  //   const handleRoleChange = useCallback(
  //     (nextRole: string) => {
  //       setRole(nextRole)
  //       props.onRoleChange?.(nextRole)
  //       // 角色切换后可按需重定向或刷新菜单，当前保持不跳转
  //     },
  //     [props]
  //   )

  const handleClick = useCallback(
    (path: string) => {
      if (!path) return
      if (location.pathname !== path) navigate(path)
    },
    [location.pathname, navigate]
  )

  return (
    <div className={styles[`${PREFIX}-container`]}>
      <nav className={styles[`${PREFIX}-menu`]} aria-label="side menu">
        {items.map((item) => {
          const active = location.pathname === item.path
          return (
            <div
              key={item.key}
              className={active ? styles[`${PREFIX}-itemActive`] : styles[`${PREFIX}-item`]}
              onClick={() => handleClick(item.path)}
            >
              <span className={styles[`${PREFIX}-icon`]} aria-hidden>
                {item.icon ?? <span className={styles[`${PREFIX}-dotIcon`]} />}
              </span>
              <span className={styles[`${PREFIX}-label`]}>{item.label}</span>
            </div>
          )
        })}
      </nav>
    </div>
  )
}

export default AppSideMenu
