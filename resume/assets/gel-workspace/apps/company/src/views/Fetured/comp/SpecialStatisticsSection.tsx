import React, { useCallback, useEffect, useRef, useState } from 'react'
import Table from '@wind/wind-ui-table'
import { t } from 'gel-util/intl'
import { getSpecialStatisticsConfigById, SpecialStatisticsConfigId } from '../config/specialStatistics'
import {
  requestRankListAggSelectV2,
  getOriginData,
  processData,
  generateColumns,
} from '../utils/specialStatisticsUtils'
import { featuredCompany } from '../utils'

interface SpecialStatisticsSectionProps {
  configId: SpecialStatisticsConfigId
  param: any
}

/**
 * 特殊统计组件
 * @param configId 配置ID
 * @param param 参数
 * @returns
 */
export const SpecialStatisticsSection: React.FC<SpecialStatisticsSectionProps> = ({ configId, param }) => {
  const [componentsData, setComponentsData] = useState({})
  const [loadingStates, setLoadingStates] = useState({})
  const chartRefs = useRef({})

  // 根据configId获取配置
  const config = getSpecialStatisticsConfigById(configId)
  console.log('🚀 ~ config:', config)

  useEffect(() => {
    // 如果没有找到配置，直接返回
    if (!config) {
      console.warn(`未找到ID为 ${configId} 的特殊统计配置`)
      return
    }

    // 根据配置动态加载数据
    config.components.forEach((component) => {
      loadComponentData(component, param)
    })
  }, [param, configId])

  const loadComponentData = async (component, param) => {
    // 设置加载状态，但保持现有数据显示
    setLoadingStates((prev) => ({ ...prev, [component.type]: true }))

    try {
      const res = await requestRankListAggSelectV2(param, component.queryType)

      const total = res.Page?.Records
      const originData = getOriginData(res, component)

      const processedData = processData(originData)

      // 直接更新数据，保持界面稳定
      setComponentsData((prev) => ({
        ...prev,
        [component.type]: {
          tableData: processedData.tableData,
          chartData: processedData.chartData,
          columns: generateColumns(component.columns, total),
          total,
        },
      }))

      // 渲染图表
      renderChart(component, processedData.chartData)
    } catch (error) {
      console.error(`加载${component.title}数据失败:`, error)
    } finally {
      setLoadingStates((prev) => ({ ...prev, [component.type]: false }))
    }
  }

  const renderChart = (component, chartData) => {
    const chartRef = chartRefs.current[component.type]
    if (!chartRef) return

    if (component.chartType === 'pie') {
      featuredCompany.showIpoPie(chartRef, chartData)
    } else if (component.chartType === 'bar') {
      featuredCompany.drawBarStatistics(chartRef, chartData)
    }
  }

  // 如果没有找到配置，返回null
  if (!config) {
    return null
  }

  const renderIpo = useCallback(
    (component, data) => (
      <div className="status-ipo">
        <div className="status-left">
          <div className={`status-left-chart`} ref={(el) => (chartRefs.current[component.type] = el)} />
        </div>
        <div className="status-ipo-table">
          <Table columns={data.columns} pagination={false} dataSource={data.tableData} empty={t('17235', '暂无数据')} />
        </div>
      </div>
    ),
    [chartRefs]
  )

  return (
    <>
      {config.components.map((component) => {
        const data = componentsData[component.type]
        const loading = loadingStates[component.type]

        return (
          <div key={component.type}>
            <div className="header-statistics">{t(component.titleIntl, component.title)}</div>
            {data?.tableData?.some((i) => i.doc_count) ? (
              renderIpo(component, data)
            ) : (
              <div className="feture-no-data">{loading ? '' : t('17235', '暂无数据')}</div>
            )}
          </div>
        )
      })}
    </>
  )
}
