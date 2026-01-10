import { BusinessOpportunityResponse } from '@/api/corp/event'
import { Tabs } from '@wind/wind-ui'
import { useInViewport, useUnmount } from 'ahooks'
import { CorpBasicInfo } from 'gel-types'
import { usedInClient } from 'gel-util/env'
import { getLocale, intl } from 'gel-util/intl'
import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { BusinessOpportunitiesTabPane } from './BusinessOpportunities'
import { DynamicTabBar, DynamicTabPane } from './DynamicTab'
import { PublicOpinionTabPane } from './PublicOpinion'
import { DynamicTabsKey } from './type'
import { useBusinessOpportunity } from './useBusinessOpportunity'
import { useDynamicEvents } from './useDynamicEvents'
import { usePublicOpinion } from './usePublicOpinion'
import { useTabInitialization } from './useTabInitialization'

const TabPane = Tabs.TabPane

const DEFAULT_TIMEOUT = 2000 // 这里设置没有数据时，自动尝试的间隔时间

// 静态 Tab 配置
const TAB_CONFIGS = [
  {
    key: 'dongtai' as DynamicTabsKey,
    title: '动态',
    titleKey: '437413',
    getVisible: () => true, // 动态 tab 始终显示
    dataUcId: 'SU6p5RAvJR',
    hasData: (data: any) => Array.isArray(data) && data.length > 0,
  },
  {
    key: 'yuqing' as DynamicTabsKey,
    title: '舆情',
    titleKey: '421503',
    getVisible: (ifIndividualBusiness?: boolean) => !ifIndividualBusiness, // 个体工商户不显示舆情
    dataUcId: 'Pko2aSSQbbu',
    hasData: (data: any) => Array.isArray(data) && data.length > 0,
  },
  {
    key: 'shangji' as DynamicTabsKey,
    title: '商机',
    titleKey: '272288',
    getVisible: () => usedInClient() && getLocale() === 'zh-CN', // 客户端且中文环境才显示
    dataUcId: 'qeWEdLtQvAa',
    hasData: (data: BusinessOpportunityResponse): boolean => {
      try {
        return data && (data.list?.length > 0 || !!data.more)
      } catch {
        return false
      }
    },
  },
] as const

export const defaultCardTabKey = TAB_CONFIGS[0].key // 动态商机舆情 默认的 key 是动态

/**
 * 动态标签页组件
 * @author Calvin<calvin@wind.com.cn>
 * @author 张文浩<suneo@wind.com.cn>
 * @param companycode 公司代码
 * @param baseInfo 公司基本信息
 * @param ifIndividualBusiness 是否个体工商户
 */
export const DynamicTabs: FC<{
  companycode: string
  baseInfo: Partial<CorpBasicInfo>
  ifIndividualBusiness: boolean
}> = ({ companycode, baseInfo, ifIndividualBusiness }) => {
  // 使用自定义 hooks 管理各 tab 的数据
  const {
    mycorpeventlist,
    loading: dynamicLoading,
    hasLoaded: dynamicHasLoaded,
    fetchDynamicEvents,
  } = useDynamicEvents(companycode)

  const {
    businessOpportunityInfo,
    loading: businessLoading,
    hasLoaded: businessHasLoaded,
    fetchBusinessOpportunity,
  } = useBusinessOpportunity(companycode)

  const {
    legalRiskEvents,
    loading: opinionLoading,
    hasLoaded: opinionHasLoaded,
    fetchLegalRiskEvents,
  } = usePublicOpinion(companycode)

  // 视口检测（ahooks）
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [inViewport] = useInViewport(containerRef)

  // 计算可见的 tab 配置
  const visibleTabConfigs = TAB_CONFIGS.filter((config) => {
    return config.getVisible(ifIndividualBusiness)
  })

  // 计算可见的 tab 列表
  const availableTabs = visibleTabConfigs.map((config) => config.key)

  // 渲染 tab 内容的函数
  const renderTabContent = (key: DynamicTabsKey) => {
    switch (key) {
      case 'dongtai':
        return <DynamicTabPane mycorpeventlist={mycorpeventlist} />
      case 'yuqing':
        return <PublicOpinionTabPane legalRiskEvents={legalRiskEvents} companycode={companycode} />
      case 'shangji':
        return <BusinessOpportunitiesTabPane businessOpportunityInfo={businessOpportunityInfo} />
      default:
        return null
    }
  }

  // 检查指定 tab 是否有数据（抽象函数）
  const getCurrentTabHasData = useCallback((key: DynamicTabsKey, data: any) => {
    const config = TAB_CONFIGS.find((c) => c.key === key)
    return config ? config.hasData(data) : false
  }, [])

  // 获取当前 tab 的数据对象
  const getDataByKey = useCallback(
    (key: DynamicTabsKey) => {
      switch (key) {
        case 'dongtai':
          return mycorpeventlist
        case 'yuqing':
          return legalRiskEvents
        case 'shangji':
          return businessOpportunityInfo
        default:
          return undefined
      }
    },
    [mycorpeventlist, legalRiskEvents, businessOpportunityInfo]
  )

  // 检查当前 tab 是否已加载
  const getCurrentTabHasLoaded = (key: DynamicTabsKey) => {
    switch (key) {
      case 'dongtai':
        return dynamicHasLoaded
      case 'yuqing':
        return opinionHasLoaded
      case 'shangji':
        return businessHasLoaded
      default:
        return false
    }
  }

  // 获取当前 tab 的加载状态

  // 获取指定 tab 的数据，返回是否有数据
  const fetchTabData = useCallback(
    async (key: DynamicTabsKey): Promise<boolean> => {
      let data: any

      switch (key) {
        case 'dongtai':
          data = await fetchDynamicEvents()
          return getCurrentTabHasData(key, data)
        case 'shangji':
          data = await fetchBusinessOpportunity()
          return getCurrentTabHasData(key, data)
        case 'yuqing':
          data = await fetchLegalRiskEvents()
          return getCurrentTabHasData(key, data)
        default:
          return false
      }
    },
    [fetchDynamicEvents, fetchBusinessOpportunity, fetchLegalRiskEvents, getCurrentTabHasData]
  )

  // 使用 Tab 初始化 Hook
  const { activeTab, setActiveTab, isInitialized } = useTabInitialization(
    availableTabs,
    fetchTabData,
    defaultCardTabKey
  )

  // 检查指定 tab 是否正在加载
  const isTabLoading = (key: DynamicTabsKey) => {
    switch (key) {
      case 'dongtai':
        return dynamicLoading
      case 'yuqing':
        return opinionLoading
      case 'shangji':
        return businessLoading
      default:
        return false
    }
  }

  // 自动化程序状态
  const [autoEnabled, setAutoEnabled] = useState<boolean>(true) // 是否执行自动化程序
  const [autoIndex, setAutoIndex] = useState<number>(0) // 当前自动尝试的 tab 索引
  const [autoPending, setAutoPending] = useState<boolean>(false) // 防止并发调用
  const autoTimerRef = useRef<number | null>(null)

  const clearAutoTimer = useCallback(() => {
    if (autoTimerRef.current !== null) {
      window.clearTimeout(autoTimerRef.current)
      autoTimerRef.current = null
    }
  }, [])

  // 当第一个接口加载完成后，若无数据则启用自动化程序；若有数据则关闭自动化程序
  useEffect(() => {
    if (!isInitialized || availableTabs.length === 0) return
    const firstKey = availableTabs[0]
    // 等待第一个 tab 数据加载完成
    if (!getCurrentTabHasLoaded(firstKey)) return

    const hasData = getCurrentTabHasData(firstKey, getDataByKey(firstKey))
    if (hasData) {
      setAutoEnabled(false)
    } else {
      // 从下一个 tab 开始自动尝试
      setAutoIndex(availableTabs.length > 1 ? 1 : 0)
      setAutoEnabled(true)
    }
  }, [isInitialized, availableTabs, getCurrentTabHasLoaded, getCurrentTabHasData, getDataByKey])

  // 单步自动化执行：调用当前索引 tab 的接口；若无数据，2s 后尝试下一个
  const runAutoStep = useCallback(
    async (startIndex?: number) => {
      if (!autoEnabled || !isInitialized || !inViewport || availableTabs.length === 0) return
      if (autoPending) return

      const index = typeof startIndex === 'number' ? startIndex : autoIndex
      const key = availableTabs[index]
      if (!key) return

      setAutoPending(true)
      const has = await fetchTabData(key)
      setAutoPending(false)

      if (has) {
        setActiveTab(key)
        setAutoEnabled(false)
        clearAutoTimer()
      } else {
        const nextIndex = (index + 1) % availableTabs.length
        setAutoIndex(nextIndex)
        autoTimerRef.current = window.setTimeout(() => {
          runAutoStep(nextIndex)
        }, DEFAULT_TIMEOUT)
      }
    },
    [autoEnabled, isInitialized, inViewport, availableTabs, autoIndex, autoPending, fetchTabData, clearAutoTimer]
  )

  // 当条件满足时，如果没有排队的计时器则在 2s 后启动自动化；条件不满足则清理计时器
  useEffect(() => {
    if (!autoEnabled || !isInitialized || !inViewport || availableTabs.length === 0) {
      clearAutoTimer()
      return
    }
    if (!autoPending && autoTimerRef.current === null) {
      autoTimerRef.current = window.setTimeout(() => {
        runAutoStep()
      }, 2000)
    }
  }, [autoEnabled, isInitialized, inViewport, availableTabs, autoPending, runAutoStep, clearAutoTimer])

  // 组件卸载时清理计时器
  useUnmount(() => {
    clearAutoTimer()
  })

  // 处理 tab 切换
  const onCardTabChange = useCallback(
    async (key: DynamicTabsKey) => {
      // 如果还未初始化完成，禁止切换
      if (!isInitialized) {
        return
      }

      // 用户主动操作，结束自动化程序
      setAutoEnabled(false)
      clearAutoTimer()

      setActiveTab(key)

      // 如果该 tab 还没有加载数据，先加载
      if (!getCurrentTabHasLoaded(key)) {
        await fetchTabData(key)
      }
    },
    [isInitialized, fetchTabData, setActiveTab, dynamicLoading, businessLoading, opinionLoading]
  )

  // 总体加载状态

  return (
    <div ref={containerRef}>
      <Tabs
        className="risk-tabs-css"
        activeKey={activeTab}
        onChange={onCardTabChange}
        tabBarExtraContent={
          <DynamicTabBar
            companycode={companycode}
            tabKey={activeTab}
            businessOpportunityInfo={businessOpportunityInfo}
            baseInfo={baseInfo}
          />
        }
        data-uc-id="cw_MK7hFWa"
        data-uc-ct="tabs"
      >
        {visibleTabConfigs.map((config) => {
          const tabLoading = isTabLoading(config.key)
          const tabTitle = intl(config.titleKey, config.title)

          return (
            <TabPane
              key={config.key}
              tab={tabTitle}
              data-uc-id={config.dataUcId}
              data-uc-ct="tabpane"
              disabled={tabLoading}
            >
              {renderTabContent(config.key)}
            </TabPane>
          )
        })}
      </Tabs>
    </div>
  )
}
