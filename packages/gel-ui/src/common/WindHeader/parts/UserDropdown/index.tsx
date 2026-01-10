import SVIP_ICON from '@/assets/header/svip.svg'
import VIP_ICON from '@/assets/header/vip.svg'
import { Dropdown, Menu } from '@wind/wind-ui'
import cn from 'classnames'
import { usedInClient } from 'gel-util/env'
import { generateUrlByModule } from 'gel-util/link'
import { t } from 'gel-util/locales'
import { useState } from 'react'
import WindHeaderStyles from '../../index.module.less'
import type { VIPType } from '../AllFeaturesDropdown/constant/allFeature'
import { UserMenusRaw, type UserMenuItem } from './constant/userMenus'

type UserDropdownProps = {
  vip?: VIPType
  isDev?: boolean
}

export const UserDropdown: React.FC<UserDropdownProps> = (props) => {
  const STRINGS = {
    USER_CENTER: t('windHeader:210156', '用户中心'),
  }
  const { vip, isDev = false } = props || {}
  const [userOpen, setUserOpen] = useState(false)
  const handleUserMenuClick = (item: UserMenuItem) => {
    if (item.onClick) {
      item.onClick()
      return
    }

    if (!item.url) return

    if (typeof item.url === 'string') {
      window.open(item.url, '_blank', 'noopener,noreferrer')
      // window.open(item.url)
      return
    }

    const url = generateUrlByModule({ module: item.url.module, params: item.url.params, isDev })
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }
  const inClient = usedInClient()
  const menus = UserMenusRaw.filter((item) => (inClient ? !item.hideInTerminal : !item.hideInWeb))

  const userOverlay = (
    // @ts-expect-error windUI overlay typing
    <Menu>
      {menus.map((item) => (
        <Menu.Item key={String(item.id ?? item.zh)} onClick={() => handleUserMenuClick(item)}>
          <div style={{ padding: '4px 8px' }}>{t(`windHeader:${item.id as string}`, item.zh)}</div>
        </Menu.Item>
      ))}
    </Menu>
  )

  return (
    <Dropdown
      overlay={userOverlay}
      trigger={['hover']}
      placement="bottomCenter"
      onVisibleChange={(v?: boolean) => setUserOpen(!!v)}
    >
      <div
        className={cn(WindHeaderStyles[`wind-header-right-item`], {
          [WindHeaderStyles[`wind-header-right-item-hover`]]: userOpen,
        })}
      >
        <span>{STRINGS.USER_CENTER}</span>
        {vip ? <img src={vip === 'svip' ? SVIP_ICON : VIP_ICON} alt={vip} /> : null}
      </div>
    </Dropdown>
  )
}
