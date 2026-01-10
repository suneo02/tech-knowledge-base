import { useCallback, useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import styles from './index.module.less'
import { Button, Tooltip } from '@wind/wind-ui'
import { t } from 'gel-util/intl'
import { InsertO, RatioonethirdO } from '@wind/icons'
import { OverlayAside } from './overlay-aside.tsx'
import type { CSSProperties } from 'react'

export type ResponsiveAsideProps = {
  /** 是否启用响应式侧栏；为 false 时仅渲染主内容 */
  enable?: boolean
  /** 侧栏宽度（同时作为窄屏 overlay 的宽度） */
  asideWidth?: number
  /** 主内容的最小宽度，小于该宽度时侧栏进入 overlay 模式 */
  contentMinWidth?: number
  /** 侧栏内容 */
  asideContent?: React.ReactNode
  /** overlay 模式下的内容，默认回退到 asideContent */
  overlayContent?: React.ReactNode
  /** 主内容 */
  mainContent: React.ReactNode
}

const PREFIX = 'responsive-aside'

export const ResponsiveAside: React.FC<ResponsiveAsideProps> = (props) => {
  const { enable = true, asideWidth = 264, contentMinWidth = 1300, asideContent, overlayContent, mainContent } = props

  const [viewportWidth, setViewportWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1920)
  const isNarrow = useMemo(() => {
    return viewportWidth < asideWidth + contentMinWidth
  }, [viewportWidth, asideWidth, contentMinWidth])

  const isMinWidth = useMemo(() => {
    return viewportWidth <= contentMinWidth + 24
  }, [viewportWidth, contentMinWidth])

  const [isAsidePinned, setIsAsidePinned] = useState<boolean>(!isNarrow)
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false)

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setIsAsidePinned(!isNarrow)
    if (!isNarrow) setIsOverlayOpen(false)
  }, [isNarrow])

  const handleTogglePinned = useCallback(() => setIsAsidePinned((prev) => !prev), [])
  const handleOpenOverlay = useCallback(() => setIsOverlayOpen(true), [])
  const handleCloseOverlay = useCallback(() => setIsOverlayOpen(false), [])

  // 用户可见文案统一管理
  const STRINGS = {
    TITLE: t('222402', '超级名单'),
    COLLAPSE: t('119102', '收起'),
    EXPAND: t('28912', '展开'),
    MENU: t('417395', '菜单'),
    CLOSE: t('6653', '关闭'),
  } as const

  if (!enable) return <>{mainContent}</>
  return (
    // 通过 CSS 变量传递侧栏宽度，统一控制 aside 与 overlay
    <div className={styles[`${PREFIX}-root`]} style={{ ['--aside-width']: `${asideWidth}px` } as CSSProperties}>
      <div className={styles[`${PREFIX}-layout`]}>
        <aside
          className={classNames(styles[`${PREFIX}-aside`], {
            [styles[`${PREFIX}-asideHidden`]]: !isNarrow ? !isAsidePinned : true,
          })}
          aria-hidden={!isNarrow ? (!isAsidePinned ? 'true' : 'false') : 'true'}
        >
          {asideContent}
        </aside>
        <main className={styles[`${PREFIX}-main`]}>{mainContent}</main>
      </div>

      {/* 左上角：宽屏下的收起/展开按钮 */}
      {!isNarrow &&
        (isAsidePinned ? (
          <div className={styles[`${PREFIX}-collapseBtn-flex`]}>
            <span className={styles[`${PREFIX}-titleGradient`]}>{STRINGS.TITLE}</span>
            <Button
              size="small"
              onClick={handleTogglePinned}
              icon={isAsidePinned ? <InsertO /> : <RatioonethirdO />}
              type="text"
              aria-label={isAsidePinned ? STRINGS.COLLAPSE : STRINGS.EXPAND}
            />
          </div>
        ) : (
          <div className={styles[`${PREFIX}-collapseBtn`]}>
            <Button
              size="small"
              onClick={handleTogglePinned}
              icon={<RatioonethirdO />}
              type="text"
              aria-label={isAsidePinned ? STRINGS.COLLAPSE : STRINGS.EXPAND}
            />
          </div>
        ))}

      {/* 窄屏下的菜单按钮 */}
      {isNarrow && !isMinWidth && (
        <div className={styles[`${PREFIX}-collapseBtn`]}>
          <Tooltip title={STRINGS.MENU} placement="right">
            <Button
              size="small"
              onClick={handleOpenOverlay}
              icon={<RatioonethirdO />}
              type="text"
              aria-label={STRINGS.MENU}
            />
          </Tooltip>
        </div>
      )}

      {isMinWidth && (
        <Tooltip title={STRINGS.MENU} placement="right">
          <div className={styles[`${PREFIX}-collapseBtn-minWidth`]} onClick={handleOpenOverlay}>
            <div className={styles[`${PREFIX}-collapseBtn-minWidth-icon`]} />
          </div>
        </Tooltip>
      )}

      {/* 窄屏 overlay 侧栏与遮罩（内容默认复用 asideContent） */}
      {isNarrow && (
        <OverlayAside
          open={isOverlayOpen}
          onClose={handleCloseOverlay}
          title={STRINGS.TITLE}
          ariaLabelClose={STRINGS.CLOSE}
        >
          {overlayContent ?? asideContent}
        </OverlayAside>
      )}
    </div>
  )
}

export default ResponsiveAside
