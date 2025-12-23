import React from 'react'
import { Tabs as WindTabs } from '@wind/wind-ui'
import { TabsSafe } from '@/components/windUISafe'
import AIChartsGraph from '../AiChartsGraph'
import styles from './index.module.less'
import { AIGRAPH_EXCEL_SHEET_KEYS, AIGraphRightTabKey } from '../../types'
import { AIGRAPH_EXCEL_SHEET_CONFIG } from '../../contansts'
import AIChartsExcelSheet from '../AiChartsExcel/sheet'
import SpinLoading from '@/views/Charts/comp/spin-loading'
import ChartEmpty from '@/views/Charts/comp/chartEmpty'
import { useAIChartsStore } from '../../store'

const TabPane = WindTabs.TabPane

interface AIChartsRightProps {
  resizerTrigger: number // 记录内容区宽度变化事件
  dimensions: { width: number; height: number }
  handleSummaryClick: () => void
}

/**
 * @description AI图谱右侧内容组件
 * @author bcheng<bcheng@wind.com.cn>
 */
const AIChartsRight: React.FC<AIChartsRightProps> = (props) => {
  const { resizerTrigger, dimensions, handleSummaryClick } = props
  const {
    activeChatId,
    fetchingStatus,
    aiGraphRightActiveTabKey,
    setAiGraphRightActiveTabKey,
    currentVersion,
    getCurrentChartData,
  } = useAIChartsStore()
  const fetching = fetchingStatus.type !== 'summary' && fetchingStatus.value

  function renderContent(key) {
    const currentChartData = getCurrentChartData()
    if (fetching) {
      return <SpinLoading />
    }

    if (currentChartData) {
      if (!currentChartData.config) {
        return <ChartEmpty />
      }
      return key === AIGRAPH_EXCEL_SHEET_KEYS.GRAPH ? (
        <AIChartsGraph
          resizerTrigger={resizerTrigger}
          width={dimensions.width}
          height={dimensions.height}
          fetching={fetching}
          handleSummaryClick={handleSummaryClick}
        />
      ) : (
        <AIChartsExcelSheet sheetType={key} fetching={fetching} />
      )
    }

    if (currentVersion === undefined) {
      return <ChartEmpty />
    }

    return null
  }

  return (
    <TabsSafe
      className={styles.aiChartsRight}
      activeKey={aiGraphRightActiveTabKey}
      onChange={(val: string) => {
        setAiGraphRightActiveTabKey(val as AIGraphRightTabKey)
      }}
      data-uc-id="k-meSPL0bA"
      data-uc-ct="tabssafe"
    >
      {AIGRAPH_EXCEL_SHEET_CONFIG.map((item) => {
        return (
          <TabPane tab={item.label} key={item.key}>
            {renderContent(item.key)}
          </TabPane>
        )
      })}
    </TabsSafe>
  )
}

export default AIChartsRight
