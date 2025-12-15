import { useEffect, useRef, useState } from 'react'
import { DynamicTabsKey } from './type'

/**
 * Tab 初始化 Hook
 * @author Calvin<calvin@wind.com.cn>
 * @author 张文浩<suneo@wind.com.cn>
 * @param availableTabs 可用的 tab 列表
 * @param fetchTabData 获取 tab 数据的函数
 * @param defaultTab 默认 tab
 * @returns 初始化状态和 active tab
 */
export const useTabInitialization = (
  availableTabs: DynamicTabsKey[],
  fetchTabData: (key: DynamicTabsKey) => Promise<boolean>,
  defaultTab: DynamicTabsKey
) => {
  const [activeTab, setActiveTab] = useState<DynamicTabsKey>(defaultTab)
  const hasInitialized = useRef(false)

  // 初始化效果 - 只在有可用 tabs 且未初始化时执行一次
  useEffect(() => {
    if (hasInitialized.current || availableTabs.length === 0) return

    hasInitialized.current = true // 立即标记为已初始化，防止重复执行

    // 仅确定初始激活 tab，并调用该 tab 的数据接口
    const initialTab = availableTabs.includes(defaultTab) ? defaultTab : availableTabs[0]
    setActiveTab(initialTab)
    // 只触发一次默认 tab 的数据加载，不在此处遍历其它 tab
    fetchTabData(initialTab).catch(() => {})
  }, [availableTabs, fetchTabData, defaultTab])

  return {
    activeTab,
    setActiveTab,
    isInitialized: hasInitialized.current,
  }
}
