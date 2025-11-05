import React, { useEffect } from 'react'
import { Layout, ThemeProvider, Menu } from '@wind/wind-ui'
import Charts from '../Charts'
import AIChartsContent from './comp/AiChartsContent'
import styles from './index.module.less'
import alice from '@/assets/icons/icon-alice.png'
import { AIGRAPH_MENU_ITEMS } from './contansts'
import { AIGRAPH_MENU_KEYS, AIGraphMenuKey, BuildGraphItem } from './types'
import { AIGraphProvider, useAIGraph, AIChartProvider } from './context'
const { Sider } = Layout

/**
 * @description AI图谱布局组件
 * @author bcheng<bcheng@wind.com.cn>
 */
const AIGraphContent: React.FC<{
  buildGraphItem?: BuildGraphItem
}> = ({ buildGraphItem: propBuildGraphItem }) => {
  const {
    selectedKeys,
    setSelectedKeys,
    buildGraphItem,
    setBuildGraphItem,
    companyCode,
    companyName,
  } = useAIGraph()

  // 当props中的buildGraphItem变化时，同步到context中
  useEffect(() => {
    if (propBuildGraphItem) {
      setBuildGraphItem(propBuildGraphItem)
      setSelectedKeys([AIGRAPH_MENU_KEYS.BUILD])
    }
  }, [propBuildGraphItem])

  // 当buildGraphItem变化时，切换到AI构建菜单
  useEffect(() => {
    if (buildGraphItem) {
      console.log('buildGraphItem', buildGraphItem)
      setSelectedKeys([AIGRAPH_MENU_KEYS.BUILD])
    }
  }, [buildGraphItem])

  /**
   * @description 渲染菜单项
   */
  const renderMenuItems = () => (
    AIGRAPH_MENU_ITEMS.map((item) => (
      <Menu.Item key={item.key} className={styles.aiGraphLayout__menuItem}>
        <div className={styles.aiGraphLayout__menuItemLabel}>{item.label}</div>
      </Menu.Item>
    ))
  )

  /**
   * @description 构建图谱
   * @param {BuildGraphItem} item 构建图谱项
   */
  const handleBuildGraph = (item: BuildGraphItem) => {
    setBuildGraphItem(item)
    setSelectedKeys([AIGRAPH_MENU_KEYS.BUILD])
  }

  /**
   * @description 渲染内容区域
   */
  const renderContent = () => (
    <>
      <div className={`${styles.aiGraphLayout__contentItem} ${selectedKeys[0] === AIGRAPH_MENU_KEYS.HOME ? styles.active : ''}`}>
        <Charts onBuildGraph={handleBuildGraph} />
      </div>
      <div className={`${styles.aiGraphLayout__contentItem} ${selectedKeys[0] === AIGRAPH_MENU_KEYS.BUILD ? styles.active : ''}`}>
        <AIChartsContent />
      </div>
    </>
  )

  return (
    // @ts-ignore
    <Layout className={`ai-graph ${styles.aiGraphLayout}`}>
      <ThemeProvider pattern="gray">
        {/* @ts-ignore */}
        <Sider width={72}>
          {/* @ts-ignore */}
          <Menu
            mode="vertical"
            style={{ flex: 1 }}
            selectedKeys={selectedKeys}
            onSelect={({ key }) => setSelectedKeys([key as AIGraphMenuKey])}
          >
            {renderMenuItems()}
          </Menu>
          <div className={styles.aiGraphLayout__menuBottom}>
            <img src={alice} alt="alice" />
          </div>
        </Sider>
      </ThemeProvider>
      {/* @ts-ignore */}
      <Layout className={styles.aiGraphLayout__content}>
        {renderContent()}
      </Layout>
    </Layout>
  )
}

/**
 * @description AI图谱组件
 * @author bcheng<bcheng@wind.com.cn>
 */
const AIGraph: React.FC<{
  buildGraphItem?: BuildGraphItem
  companyCode?: string
  companyName?: string
}> = ({ buildGraphItem, companyCode = '1015343518', companyName = '融创房地产集团有限公司' }) => {
  return (
    <AIGraphProvider
      initialCompanyCode={companyCode}
      initialCompanyName={companyName}
    >
      <AIChartProvider>
        <AIGraphContent buildGraphItem={buildGraphItem} />
      </AIChartProvider>
    </AIGraphProvider>
  )
}

export default AIGraph
