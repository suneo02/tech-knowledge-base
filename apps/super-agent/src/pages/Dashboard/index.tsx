import buoumao from '@/assets/demo/buoumao.svg'
import chaiquan from '@/assets/demo/chaiquan.svg'
import helanzhu from '@/assets/demo/helanzhu.svg'
import banner from '@/assets/html/banner.html?raw'
import { CustomList } from '@/components/CustomList'
import { Button, Card, Carousel, Divider } from '@wind/wind-ui'
import { t } from 'gel-util/locales'
import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.less'
import { selectSplTasks, selectSplTasksLoading, useAppSelector } from '@/store'
import { TaskStatus } from 'gel-api'

export interface DashboardProps {
  name?: string
  onCTA?: () => void
}

const PREFIX = 'dashboard'

const STRINGS = {
  TITLE: t('superAgent:', 'Dashboard'),
  BUTTON: t('superAgent:', 'Click'),
  PRECISE_MATCH: t('superAgent:', '精准匹配'),
  FAST_GENERATION: t('superAgent:', '极速生成'),
  DATA_DRIVEN: t('superAgent:', '数据驱动'),
  PRECISE_MATCH_DESCRIPTION: t('superAgent:', '基于企业信息和产品特点，AI智能分析匹配度，精准找到潜在客户'),
  FAST_GENERATION_DESCRIPTION: t('superAgent:', '5分钟快速生成完整客户名单，包含联系方式、营销话术等详细信息'),
  DATA_DRIVEN_DESCRIPTION: t('superAgent:', '基于海量企业数据库，提供营销分数排序，让您优先联系高价值客户'),
  CUSTOMER_LIST: t('superAgent:', '我的客户名单'),
  DRILLING_DONE: t('superAgent:', '挖掘完成'),
  DRILLING: t('superAgent:', '挖掘中'),
  DRILLING_FAILED: t('superAgent:', '挖掘失败'),
  // DOWNLOADED: t('superAgent:', '已下载'),
  ALL: t('superAgent:', '全部'),
  NOT_SUBSCRIBED: t('superAgent:', '未订阅'),
  SUBSCRIBED: t('superAgent:', '已订阅'),
  CARD_VIEW: t('superAgent:', '卡片'),
  LIST_VIEW: t('superAgent:', '列表'),
  DOWNLOAD: t('superAgent:', '我的下载'),
}

const CARDS = [
  {
    icon: buoumao,
    title: STRINGS.PRECISE_MATCH,
    description: STRINGS.PRECISE_MATCH_DESCRIPTION,
  },
  {
    icon: chaiquan,
    title: STRINGS.FAST_GENERATION,
    description: STRINGS.FAST_GENERATION_DESCRIPTION,
  },
  {
    icon: helanzhu,
    title: STRINGS.DATA_DRIVEN,
    description: STRINGS.DATA_DRIVEN_DESCRIPTION,
  },
]
export const Dashboard: React.FC<DashboardProps> = (props) => {
  const { onCTA } = props || {}
  const [statusFilter, setStatusFilter] = useState<TaskStatus | undefined>(undefined)
  const [subscriptionFilter, setSubscriptionFilter] = useState<'ALL' | 'SUBSCRIBED' | 'NOT_SUBSCRIBED'>('ALL')
  const customerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const list = useAppSelector(selectSplTasks)
  const loading = useAppSelector(selectSplTasksLoading)
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

  return (
    <div className={styles[`${PREFIX}-container`]}>
      <div className={styles[`${PREFIX}-banner`]}>
        <Carousel autoplay autoplaySpeed={5000} arrows>
          <div className={styles[`${PREFIX}-banner-item`]}>
            <iframe
              title="interactive-banner"
              srcDoc={banner}
              style={{ width: '100%', height: '100%', border: 'none' }}
              scrolling="no"
            />
          </div>
        </Carousel>
      </div>
      <div className={styles[`${PREFIX}-content`]}>
        <div className={styles[`${PREFIX}-features`]}>
          {CARDS.map((card) => (
            <Card bordered key={card.title} className={styles[`${PREFIX}-card`]}>
              <div className={styles[`${PREFIX}-card-content`]}>
                <div className={styles[`${PREFIX}-card-icon`]}>
                  <img src={card.icon} alt={card.title} style={{ width: '60px', height: '60px' }} />
                </div>
                <div className={styles[`${PREFIX}-card-title`]}>{card.title}</div>
                <div className={styles[`${PREFIX}-card-description`]}>{card.description}</div>
              </div>
            </Card>
          ))}
        </div>
        <div className={styles[`${PREFIX}-customer`]} ref={customerRef}>
          <div className={styles[`${PREFIX}-customer-header`]} ref={headerRef}>
            <div className={styles[`${PREFIX}-customer-header-left`]}>
              <h2 onClick={() => scrollToThis()}>{STRINGS.CUSTOMER_LIST}</h2>
              <Button size="small" onClick={() => scrollToThis()}>
                {STRINGS.DOWNLOAD}
              </Button>
            </div>

            <div className={styles[`${PREFIX}-toolbar`]}>
              {statusFilter === TaskStatus.SUCCESS ? (
                <>
                  <div className={styles[`${PREFIX}-toolbar-group`]}>
                    <div
                      role="button"
                      tabIndex={0}
                      className={
                        subscriptionFilter === 'ALL'
                          ? `${styles[`${PREFIX}-chip`]} ${styles[`${PREFIX}-chip--active`]}`
                          : styles[`${PREFIX}-chip`]
                      }
                      onClick={() => setSubscriptionFilter('ALL')}
                    >
                      {STRINGS.ALL}
                    </div>
                    <div
                      role="button"
                      tabIndex={0}
                      className={
                        subscriptionFilter === 'NOT_SUBSCRIBED'
                          ? `${styles[`${PREFIX}-chip`]} ${styles[`${PREFIX}-chip--active`]}`
                          : styles[`${PREFIX}-chip`]
                      }
                      onClick={() => setSubscriptionFilter('NOT_SUBSCRIBED')}
                    >
                      {STRINGS.NOT_SUBSCRIBED}
                    </div>
                    <div
                      role="button"
                      tabIndex={0}
                      className={
                        subscriptionFilter === 'SUBSCRIBED'
                          ? `${styles[`${PREFIX}-chip`]} ${styles[`${PREFIX}-chip--active`]}`
                          : styles[`${PREFIX}-chip`]
                      }
                      onClick={() => setSubscriptionFilter('SUBSCRIBED')}
                    >
                      {STRINGS.SUBSCRIBED}
                    </div>
                  </div>
                  <Divider type="vertical" />
                </>
              ) : null}

              <div className={styles[`${PREFIX}-toolbar-group`]}>
                <div
                  role="button"
                  tabIndex={0}
                  className={
                    statusFilter === TaskStatus.SUCCESS
                      ? `${styles[`${PREFIX}-chip`]} ${styles[`${PREFIX}-chip--active`]}`
                      : styles[`${PREFIX}-chip`]
                  }
                  onClick={() => setStatusFilter(statusFilter === TaskStatus.SUCCESS ? undefined : TaskStatus.SUCCESS)}
                >
                  {STRINGS.DRILLING_DONE}
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  className={
                    statusFilter === TaskStatus.PENDING
                      ? `${styles[`${PREFIX}-chip`]} ${styles[`${PREFIX}-chip--active`]}`
                      : styles[`${PREFIX}-chip`]
                  }
                  onClick={() => setStatusFilter(statusFilter === TaskStatus.PENDING ? undefined : TaskStatus.PENDING)}
                >
                  {t('superAgent:', '排队中')}
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  className={
                    statusFilter === TaskStatus.RUNNING
                      ? `${styles[`${PREFIX}-chip`]} ${styles[`${PREFIX}-chip--active`]}`
                      : styles[`${PREFIX}-chip`]
                  }
                  onClick={() => setStatusFilter(statusFilter === TaskStatus.RUNNING ? undefined : TaskStatus.RUNNING)}
                >
                  {STRINGS.DRILLING}
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  className={
                    statusFilter === TaskStatus.FAILED
                      ? `${styles[`${PREFIX}-chip`]} ${styles[`${PREFIX}-chip--active`]}`
                      : styles[`${PREFIX}-chip`]
                  }
                  onClick={() => setStatusFilter(statusFilter === TaskStatus.FAILED ? undefined : TaskStatus.FAILED)}
                >
                  {STRINGS.DRILLING_FAILED}
                </div>
              </div>
            </div>
          </div>
          <div className={styles[`${PREFIX}-customer-list`]}>
            <CustomList
              statusFilter={statusFilter}
              subscriptionFilter={subscriptionFilter}
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
