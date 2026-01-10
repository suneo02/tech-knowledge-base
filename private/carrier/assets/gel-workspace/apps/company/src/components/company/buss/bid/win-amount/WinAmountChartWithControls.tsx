import React from 'react'
import { message } from '@wind/wind-ui'
import { Spin } from 'antd'
import { isEn } from 'gel-util/intl'
import { memo, useRef, useState } from 'react'
import { WinAmountChart } from './WinAmountChart'
import type { WinAmountChartProps } from './WinAmountChart'
import { ChartControls } from '../common/ChartControls'
import { exportChartAsImage } from '../win-count/utils/exportChart'
import styles from './WinAmountChartWithControls.module.less'

/**
 * 带控制器的中标金额图表组件Props
 */
export interface WinAmountChartWithControlsProps
  extends Omit<WinAmountChartProps, 'frequency' | 'onFrequencyChange' | 'onExport'> {
  /** 初始时间区间，默认为 'month' */
  defaultInterval?: 'month' | 'quarter' | 'year'
  /** 时间区间切换回调 */
  onIntervalChange?: (interval: 'month' | 'quarter' | 'year') => void
  /** 导出回调 */
  onExport?: () => void
}

/**
 * 带控制器的中标金额分析图表
 *
 * @description 包含频率切换、导出功能等控制器的完整中标金额分析图表组件
 * @since 1.0.0
 *
 * @param data - 中标金额数据
 * @param defaultInterval - 初始时间区间，默认为 'month'
 * @param onIntervalChange - 时间区间切换回调函数
 * @param onExport - 导出回调函数
 * @param loading - 加载状态
 * @param height - 图表高度
 *
 * @returns JSX.Element 带控制器的中标金额分析图表组件
 */
export const WinAmountChartWithControls = memo(function WinAmountChartWithControls({
  data,
  defaultInterval = 'year',
  onIntervalChange,
  onExport,
  loading = false,
  height = 400,
  ...rest
}: WinAmountChartWithControlsProps) {
  // 内部状态管理
  const [interval, setInterval] = useState<'month' | 'quarter' | 'year'>(defaultInterval)
  const chartRef = useRef<HTMLDivElement>(null)

  const handleIntervalChange = (newInterval: 'month' | 'quarter' | 'year') => {
    setInterval(newInterval)
    onIntervalChange?.(newInterval)
  }

  const handleExport = async () => {
    try {
      if (!chartRef.current) {
        message.error(isEn() ? 'Chart element not found' : '未找到图表元素')
        return
      }

      // 如果提供了自定义导出回调，优先使用
      if (onExport) {
        onExport()
      }

      // 默认导出功能
      const filename = `win-amount-chart-${interval}-${new Date().toISOString().split('T')[0]}`
      await exportChartAsImage(chartRef.current, filename, {
        scale: 2,
        backgroundColor: '#ffffff',
      })

      message.success(isEn() ? 'Chart exported successfully' : '图表导出成功')
    } catch (error) {
      console.error('Export failed:', error)
      message.error(isEn() ? 'Export failed, please try again' : '导出失败，请稍后重试')
    }
  }

  return (
    <div className={styles.root} style={{ height: height + 60 }}>
      {/* 控制器区域 */}
      <ChartControls
        frequency={interval}
        onFrequencyChange={handleIntervalChange}
        onExport={handleExport}
        disabled={loading}
        showExport={true}
      />

      {/* 图表区域 */}
      <div className={styles.chartWrap} ref={chartRef} data-chart-container>
        <Spin spinning={loading}>
          <WinAmountChart data={data} frequency={interval} height={height} loading={loading} {...rest} />
        </Spin>
      </div>
    </div>
  )
})
