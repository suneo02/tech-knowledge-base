import logo2 from '@/assets/header/wind-text.svg'
import logo from '@/assets/header/wind.svg'
import logo3 from '@/assets/header/zx.svg'
import styles from './index.module.less'

import { useHover } from 'ahooks'
import cn from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { AllFeaturesDropdown } from './parts/AllFeaturesDropdown'
import type { VIPType } from './parts/AllFeaturesDropdown/constant/allFeature'
import { UserDropdown } from './parts/UserDropdown'
import { generateUrlByModule, LinkModule } from 'gel-util/link'
import { isEn, switchLocaleInWeb, t } from 'gel-util/locales'
import { usedInClient } from 'gel-util/env'

const PREFIX = 'wind-header'

const DEFAULT_MAX_WIDTH = 1280

export type WindHeaderProps = {
  maxWidth?: number
  fullWidth?: boolean
  vip?: VIPType
  isDev?: boolean
  isOverseas?: boolean
}

const STRINGS = {
  CDE_SEARCH: t('windHeader:259750', '企业数据浏览器'),
  ALL_FEATURES: t('windHeader:437311', '全部功能'),
  VIP_SERVICE: t('windHeader:222403', 'VIP服务'),
}

export const WindHeader: React.FC<WindHeaderProps> = (props) => {
  const { maxWidth = DEFAULT_MAX_WIDTH, fullWidth = false, vip, isDev = false, isOverseas = false } = props || {}
  const triggerRef = useRef<HTMLDivElement | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const inClient = usedInClient()

  const [open, setOpen] = useState(false)
  const closeTimerRef = useRef<number | undefined>(undefined)

  const isTriggerHovered = useHover(triggerRef)
  const isDropdownHovered = useHover(dropdownRef)
  const hoverActive = isTriggerHovered || isDropdownHovered

  useEffect(() => {
    if (hoverActive) {
      setOpen(true)
      if (closeTimerRef.current !== undefined) {
        window.clearTimeout(closeTimerRef.current)
        closeTimerRef.current = undefined
      }
    } else {
      closeTimerRef.current = window.setTimeout(() => {
        setOpen(false)
        closeTimerRef.current = undefined
      }, 300)
    }
    return () => {
      if (closeTimerRef.current !== undefined) {
        window.clearTimeout(closeTimerRef.current)
        closeTimerRef.current = undefined
      }
    }
  }, [hoverActive])

  const routerPath = (module: LinkModule) => {
    const url = generateUrlByModule({ module: module, isDev })
    if (url) window.open(url)
  }

  return (
    <div className={styles[`${PREFIX}-container`]}>
      <div
        className={cn(styles[`${PREFIX}-wrapper`], {
          [styles[`${PREFIX}-wrapper-full`]]: fullWidth,
        })}
        style={maxWidth ? { maxWidth: maxWidth } : undefined}
      >
        <div className={styles[`${PREFIX}-left`]} onClick={() => routerPath(LinkModule.SEARCH_HOME)}>
          <div className={styles[`${PREFIX}-left-logo`]}>
            <img src={logo} alt="logo" />
            <img src={logo2} alt="logo2" />
            <img src={logo3} alt="logo3" />
          </div>
        </div>
        <div className={styles[`${PREFIX}-right`]}>
          <div className={styles[`${PREFIX}-right-item`]} onClick={() => routerPath(LinkModule.CDE_SEARCH)}>
            <span>{STRINGS.CDE_SEARCH}</span>
          </div>
          <div
            className={cn(styles[`${PREFIX}-right-item`], {
              [styles[`${PREFIX}-right-item-hover`]]: open,
            })}
            ref={triggerRef}
          >
            <span>{STRINGS.ALL_FEATURES}</span>
            {/* 将 ref 透传给 dropdown 的外层容器 */}
          </div>
          <div className={styles[`${PREFIX}-right-item`]} onClick={() => routerPath(LinkModule.VIP_CENTER)}>
            <span>{STRINGS.VIP_SERVICE}</span>
          </div>
          <UserDropdown vip={vip} />
          {!inClient ? (
            <div className={styles[`${PREFIX}-right-item`]} onClick={() => switchLocaleInWeb()}>
              <span>{isEn() ? '中文' : 'English'}</span>
            </div>
          ) : null}
        </div>
      </div>
      {/* 全部功能弹窗 */}
      <div ref={dropdownRef}>
        <AllFeaturesDropdown
          open={open}
          maxWidth={maxWidth}
          fullWidth={fullWidth}
          isDev={isDev}
          isOverseas={isOverseas}
        />
      </div>
    </div>
  )
}
