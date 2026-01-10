import { FireF } from '@wind/icons'
// import { useEffect, useMemo } from 'react'
import * as RimeIcons from '@wind/rime-icons'
import cn from 'classnames'
import { usedInClient } from 'gel-util/env'
import { t } from 'gel-util/locales'
import { generateUrl, GenerateUrlInput } from 'gel-util/link'
import { allFeatureListWithMenu, type AllFeatureItem, type VIPType } from './constant/allFeature'
import styles from './index.module.less'

const PREFIX = 'all-features-dropdown'

type AllFeaturesDropdownProps = {
  open: boolean
  vip?: VIPType
  isOverseas?: boolean
  fullWidth?: boolean // 是否全宽
  maxWidth?: number // 最大宽度
  isDev?: boolean
}

const DEFAULT_MAX_WIDTH = 1280

const getIcon = (name: string) => {
  const IconComp = RimeIcons?.[name as keyof typeof RimeIcons] as unknown as React.ComponentType
  return <IconComp />
}

export const AllFeaturesDropdown = ({
  open,
  vip,
  isOverseas = false,
  fullWidth = false,
  maxWidth = DEFAULT_MAX_WIDTH,
  isDev = false,
}: AllFeaturesDropdownProps) => {
  const isTerminal = usedInClient()

  const list = allFeatureListWithMenu.filter((menu) => {
    const m = menu as unknown as AllFeatureItem
    if (isOverseas && m.hideInOverseas) return false
    return true
  })

  const isVisibleWithoutDev = (item: AllFeatureItem) => {
    if (item.disabled) return false
    if (item.hideInWeb && !isTerminal) return false
    if (item.hideInTerminal && isTerminal) return false
    if (item.hideInOverseas && isOverseas) return false
    const perms = item.permissions
    if (perms && perms.length > 0 && vip && !perms.includes(vip as VIPType)) return false
    return true
  }

  const isVisible = (item: AllFeatureItem) => {
    if (isDev) return true
    return isVisibleWithoutDev(item)
  }

  const handleClick = (item: AllFeatureItem) => {
    if (item?.disabled) return
    console.log('🚀 ~ handleClick ~ item:', item)
    let url = ''
    if (item.url?.target) {
      if (item.url?.target === 'baifen') {
        url = generateUrl({ isDev, ...item.url, isTerminal } as GenerateUrlInput)
      } else {
        url = generateUrl({ isDev, ...item.url } as GenerateUrlInput)
      }
    }

    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }

  // Preload all visible icons when dropdown opens to avoid lazy-import flicker
  // const visibleIconKeys = useMemo(() => {
  //   return list
  //     .flatMap((menu) => menu.children)
  //     .filter((child) => visibleList(child))
  //     .map((child) => child.iconKey)
  //     .filter(Boolean) as string[]
  // }, [list, vip, isOverseas, isTerminal, visibleList])

  // useEffect(() => {
  //   if (open) {
  //     preloadIcons(visibleIconKeys)
  //   }
  // }, [open, visibleIconKeys])

  // 图标懒加载通过白名单映射，避免整包打入
  return (
    <div className={`${styles[`${PREFIX}-dropdown`]} ${open ? styles[`${PREFIX}-dropdown-open`] : ''}`}>
      <div
        className={cn(styles[`${PREFIX}-mega`], {
          [styles[`${PREFIX}-mega-full`]]: fullWidth,
        })}
        style={maxWidth ? { maxWidth: maxWidth } : undefined}
      >
        {list.map((item) => (
          <div key={item.id} className={styles[`${PREFIX}-mega-col`]}>
            <div className={styles[`${PREFIX}-mega-title`]}>{t(`windHeader:${item.titleIntl}`, item.title)}</div>

            {item.children.map((child) => {
              if (!isVisible(child)) return null
              const devOnly = isDev && !isVisibleWithoutDev(child)
              return (
                <div
                  key={child.id}
                  className={styles[`${PREFIX}-mega-item`]}
                  onClick={() => handleClick(child)}
                  role="button"
                  tabIndex={0}
                  aria-disabled={devOnly}
                  style={devOnly ? { opacity: 0.5 } : undefined}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleClick(child)
                  }}
                  title={t(`windHeader:${child.titleIntl}`, child.title)}
                >
                  <div className={styles[`${PREFIX}-mega-icon`]}>
                    {child.iconKey ? getIcon(child.iconKey as string) : null}
                  </div>

                  <span
                    className={styles[`${PREFIX}-mega-text`]}
                    title={t(`windHeader:${child.titleIntl}`, child.title)}
                  >
                    {t(`windHeader:${child.titleIntl}`, child.title)}
                  </span>
                  <span className={styles[`${PREFIX}-badge-group`]}>
                    {child.new && (
                      <span className={`${styles[`${PREFIX}-badge`]} ${styles[`${PREFIX}-badge-new`]}`}>NEW</span>
                    )}
                    {/* @ts-expect-error windUI icon typing */}
                    {child.hot && <FireF className={styles[`${PREFIX}-badge-hot`]} />}
                  </span>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
