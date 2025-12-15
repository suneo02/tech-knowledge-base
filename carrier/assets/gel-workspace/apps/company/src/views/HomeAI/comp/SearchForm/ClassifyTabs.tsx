import { TabsSafe } from '@/components/windUISafe'
import { Tabs } from '@wind/wind-ui'
import React from 'react'
import styles from './style/classfyTabs.module.less'

interface TabItem {
  key: string
  value: string
}

interface ClassifyTabsProps {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (tab: TabItem) => void
}

/**
 * 搜索分类标签组件
 * @param props.tabs - 标签配置数组
 * @param props.activeTab - 当前激活的标签key
 * @param props.onTabChange - 标签切换回调
 */
const ClassifyTabs: React.FC<ClassifyTabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <TabsSafe
      className={styles.classifyTabs}
      activeKey={activeTab}
      onChange={(key) => {
        const tab = tabs.find((item) => item.key === key)
        if (tab) {
          onTabChange(tab)
        }
      }}
      data-uc-id="Rre4Eiy2pK"
      data-uc-ct="tabssafe"
    >
      {tabs.map((item) => (
        <Tabs.TabPane key={item.key} tab={item.value} data-uc-id="eM55zfz4r5" data-uc-ct="tabs" data-uc-x={item.key} />
      ))}
    </TabsSafe>
  )
}

export default ClassifyTabs
