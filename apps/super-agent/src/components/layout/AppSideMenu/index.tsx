import { FolderO, HomeO } from '@wind/icons'
import { t } from 'gel-util/locales'
import { useCallback, useMemo } from 'react'
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
    MENU_HOME: t('menu.home', '首页'),
    MENU_DASHBOARD: t('menu.dashboard', '仪表盘'),
    MENU_PROSPECT: t('menu.prospect', '线索拓展'),
    MENU_COMPANY: t('menu.companyDirectory', '我的下载'),
    ROLE_ASSISTANT: t('role.assistant', '助理'),
    ROLE_CS: t('role.cs', '客服'),
    ROLE_SALERS: t('role.salers', '销售'),
  } as const

  //   const availableRoles = props.roles ?? ['assistant', 'cs', 'salers']
  //   const [role, setRole] = useState<string>(props.defaultRole ?? availableRoles[0])

  //   const defaultRoleCards = useMemo(
  //     () => [
  //       {
  //         key: 'assistant',
  //         label: STRINGS.ROLE_ASSISTANT,
  //         miniSrc: assistantMini, // 小图
  //         fullSrc: assistant, // 大图
  //       },
  //       { key: 'cs', label: STRINGS.ROLE_CS, miniSrc: csMini, fullSrc: cs }, // 小图
  //       { key: 'salers', label: STRINGS.ROLE_SALERS, miniSrc: salersMini, fullSrc: salers }, // 大图
  //     ],
  //     [STRINGS.ROLE_ASSISTANT, STRINGS.ROLE_CS, STRINGS.ROLE_SALERS]
  //   )
  //   const roleCards = props.roleCards ?? defaultRoleCards

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
      {/* <div className={styles[`${PREFIX}-roleCards`]}>
        {roleCards
          .filter((c) => availableRoles.includes(c.key))
          .map((c) => {
            const isActive = c.key === role
            return (
              <div
                key={c.key}
                className={isActive ? styles[`${PREFIX}-roleCardActive`] : styles[`${PREFIX}-roleCard`]}
                style={{
                  background: `url(${c.miniSrc}) center no-repeat`,
                  backgroundSize: 'auto 70%',
                }}
                title={c.label}
                onClick={() => handleRoleChange(c.key)}
                aria-pressed={isActive}
              >
                <span className={styles[`${PREFIX}-roleCardBgMini`]} aria-hidden />
                <span className={styles[`${PREFIX}-roleCardBgFull`]} aria-hidden />
                <div className={styles[`${PREFIX}-roleCardTitle`]}>{c.label}</div>
              </div>
            )
          })}
      </div> */}

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
