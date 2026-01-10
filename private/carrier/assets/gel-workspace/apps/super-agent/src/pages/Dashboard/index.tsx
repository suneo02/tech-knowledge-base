import { CustomList } from '@/components/CustomList'
import { GeminiButton } from '@/components/GeminiButton'
import { t } from 'gel-util/intl'
import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.less'
import { selectSplTasks, selectSplTasksLoading, useAppSelector } from '@/store'
import { TaskStatus } from 'gel-api'

export interface DashboardProps {
  name?: string
  onCTA?: () => void
}

const PREFIX = 'dashboard'

export const Dashboard: React.FC<DashboardProps> = (props) => {
  const STRINGS = {
    DRILLING_DONE: t('481520', '挖掘完成'),
    DRILLING: t('481502', '挖掘中'),
    DRILLING_FAILED: t('481521', '挖掘失败'),
    ALL: t('19498', '全部'),
    IMMEDIATE_USE: t('481523', '立即找寻'),
    SLOGAN: t('481498', '找到对的客户，不再浪费时间。'),
    SUBTEXT: t('481518', '专业级企业线索挖掘 · 精准画像 · 高效触达。'),
    SUBREMARK: t('481519', '用数据与智能匹配把你的销售时间还给真正有价值的潜在客户。'),
  } as const

  const { onCTA } = props || {}
  const [statusFilter, setStatusFilter] = useState<TaskStatus | undefined>(undefined)
  const customerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const list = useAppSelector(selectSplTasks)
  const loading = useAppSelector(selectSplTasksLoading)

  // Animation State and Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const bannerRef = useRef<HTMLDivElement>(null)
  const [isIntroFixed, setIsIntroFixed] = useState(true)
  const [introStyle, setIntroStyle] = useState<React.CSSProperties>({
    position: 'fixed',
    top: '36px',
    left: 0,
    width: '100vw',
    height: 'calc(100vh - 36px)',
    zIndex: 100,
    backgroundColor: '#fff',
    backgroundImage:
      'linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px)',
    backgroundSize: '72px 72px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0px',
    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  })

  const getScrollParent = (node: HTMLElement | null): HTMLElement | Window => {
    let el: HTMLElement | null = node
    while (el && el.parentElement) {
      const style = window.getComputedStyle(el.parentElement)
      const overflowY = style.overflowY
      if (overflowY === 'auto' || overflowY === 'scroll') return el.parentElement
      el = el.parentElement
    }
    return window
  }

  const scrollToThis = (immediate = false) => {
    const target = customerRef.current
    if (!target) return
    const scrollParent = getScrollParent(target)
    // 仅在“吸附状态”下才滚动
    const headerEl = headerRef.current
    if (!headerEl) return
    const style = window.getComputedStyle(headerEl)
    const stickyTop = parseFloat(style.top || '0') || 0
    const headerRect = headerEl.getBoundingClientRect()
    let isSticky = false
    if (scrollParent === window) {
      isSticky = headerRect.top <= stickyTop + 1
    } else {
      const sp = scrollParent as HTMLElement
      const spRect = sp.getBoundingClientRect()
      isSticky = headerRect.top - spRect.top <= stickyTop + 1
    }
    if (!isSticky) return
    if (scrollParent === window) {
      const top = target.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top, behavior: immediate ? 'instant' : 'smooth' })
      return
    }
    const sp = scrollParent as HTMLElement
    const top = target.getBoundingClientRect().top - sp.getBoundingClientRect().top + sp.scrollTop
    sp.scrollTo({ top, behavior: immediate ? 'instant' : 'smooth' })
  }

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      const data = e?.data
      if (data && typeof data === 'object' && data.type === 'banner/cta' && data.action === 'openModal') {
        if (onCTA) onCTA()
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [onCTA])

  // Intro Animation Effect
  useEffect(() => {
    if (list.length > 0 && isIntroFixed) {
      if (bannerRef.current) {
        const rect = bannerRef.current.getBoundingClientRect()
        setIntroStyle((prev) => ({
          ...prev,
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          borderRadius: '12px',
        }))

        const timer = setTimeout(() => {
          setIsIntroFixed(false)
        }, 800)
        return () => clearTimeout(timer)
      }
    }
  }, [list, isIntroFixed])

  const renderIntroContent = () => (
    <div className={styles[`${PREFIX}-intro`]}>
      <h1 className={styles[`${PREFIX}-intro-slogan`]}>{STRINGS.SLOGAN}</h1>
      <div className={styles[`${PREFIX}-intro-meta`]}>
        <p className={styles[`${PREFIX}-intro-subtext`]}>{STRINGS.SUBTEXT}</p>
        <p className={styles[`${PREFIX}-intro-subtext`]}>{STRINGS.SUBREMARK}</p>
        <div className={styles[`${PREFIX}-intro-actions`]}>
          <GeminiButton onClick={onCTA}>{STRINGS.IMMEDIATE_USE}</GeminiButton>
        </div>
      </div>
    </div>
  )

  return (
    <div className={styles[`${PREFIX}-container`]} ref={containerRef}>
      <div className={styles[`${PREFIX}-banner`]} ref={bannerRef}>
        <div
          className={styles[`${PREFIX}-banner-item`]}
          style={{
            backgroundColor: '#fff',
            backgroundImage:
              'linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isIntroFixed ? 0 : 1, // Hide when fixed intro is active
          }}
        >
          {renderIntroContent()}
        </div>
      </div>

      {isIntroFixed && <div style={introStyle}>{renderIntroContent()}</div>}

      <div className={styles[`${PREFIX}-content`]}>
        {/* CARDS removed as per requirement */}
        <div className={styles[`${PREFIX}-customer`]} ref={customerRef}>
          <div className={styles[`${PREFIX}-customer-header`]} ref={headerRef}>
            <div className={styles[`${PREFIX}-tasks-header`]}>
              <h1 className={styles[`${PREFIX}-tasks-title`]} onClick={() => scrollToThis()}>
                {t('481499', '我的潜在客户')}
              </h1>
              <p className={styles[`${PREFIX}-tasks-desc`]}>
                {t('481500', '查看正在运行的任务进度,或管理已生成的潜在客户名单。')}
              </p>
            </div>

            <div className={styles[`${PREFIX}-filter-tabs`]}>
              <div
                role="button"
                tabIndex={0}
                className={
                  statusFilter === undefined
                    ? `${styles[`${PREFIX}-filter-tab`]} ${styles[`${PREFIX}-filter-tab--active`]}`
                    : styles[`${PREFIX}-filter-tab`]
                }
                onClick={() => setStatusFilter(undefined)}
              >
                {STRINGS.ALL}
              </div>
              <div
                role="button"
                tabIndex={0}
                className={
                  statusFilter === TaskStatus.SUCCESS
                    ? `${styles[`${PREFIX}-filter-tab`]} ${styles[`${PREFIX}-filter-tab--active`]}`
                    : styles[`${PREFIX}-filter-tab`]
                }
                onClick={() => setStatusFilter(TaskStatus.SUCCESS)}
              >
                {STRINGS.DRILLING_DONE}
              </div>
              <div
                role="button"
                tabIndex={0}
                className={
                  statusFilter === TaskStatus.PENDING
                    ? `${styles[`${PREFIX}-filter-tab`]} ${styles[`${PREFIX}-filter-tab--active`]}`
                    : styles[`${PREFIX}-filter-tab`]
                }
                onClick={() => setStatusFilter(TaskStatus.PENDING)}
              >
                {t('481501', '排队中')}
              </div>
              <div
                role="button"
                tabIndex={0}
                className={
                  statusFilter === TaskStatus.RUNNING
                    ? `${styles[`${PREFIX}-filter-tab`]} ${styles[`${PREFIX}-filter-tab--active`]}`
                    : styles[`${PREFIX}-filter-tab`]
                }
                onClick={() => setStatusFilter(TaskStatus.RUNNING)}
              >
                {STRINGS.DRILLING}
              </div>
              <div
                role="button"
                tabIndex={0}
                className={
                  statusFilter === TaskStatus.FAILED
                    ? `${styles[`${PREFIX}-filter-tab`]} ${styles[`${PREFIX}-filter-tab--active`]}`
                    : styles[`${PREFIX}-filter-tab`]
                }
                onClick={() => setStatusFilter(TaskStatus.FAILED)}
              >
                {STRINGS.DRILLING_FAILED}
              </div>
            </div>
          </div>
          <div className={styles[`${PREFIX}-customer-list`]}>
            <CustomList
              statusFilter={statusFilter}
              onRefresh={() => scrollToThis(true)}
              data={list}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
