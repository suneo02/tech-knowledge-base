import React from 'react'
import { WCBChart } from '@wind/chart-builder'
import defaultThemeObj from '@wind/chart-builder/lib/themes/standard/wind.characteristic.theme.json'
import { isEn, t } from 'gel-util/intl'
import { memo, useMemo } from 'react'
import styles from './WinCountChart.module.less'

/**
 * 中标次数图表组件
 *
 * @description 展示企业中标次数统计，包含堆叠柱形图（中标次数/未中标次数）和折线图（中标金额）
 * @since 1.0.0
 *
 * @param data - 图表数据，来自趋势分析接口
 * @param frequency - 时间频度（用户界面控制），兼容旧版本：month/quarter/year
 * @param interval - 时间区间（后端接口参数）：month/quarter/year
 * @param startTime - 统计开始日期，格式yyyy-MM-dd
 * @param endTime - 统计截止日期，格式yyyy-MM-dd
 * @param onFrequencyChange - 时间频度切换回调
 * @param onIntervalChange - 时间区间切换回调
 * @param onExport - 导出回调
 * @param loading - 加载状态
 * @param height - 图表高度
 */
export interface WinCountChartProps {
  /** 图表数据，来自趋势分析接口（兼容两种字段命名） */
  data: Array<{
    date?: string
    startTime?: string
    interval: 'month' | 'quarter' | 'year'
    bidCount: number
    unsuccessfulBidCount?: number
    notBidCount?: number
    totalMoney: number
    tenderCount?: number
  }>
  /** 时间频度（用户界面控制）：month/quarter/year */
  frequency?: 'month' | 'quarter' | 'year'
  /** 时间区间（后端接口参数）：month/quarter/year */
  interval?: 'month' | 'quarter' | 'year'
  /** 统计开始日期，格式yyyy-MM-dd */
  startTime?: string
  /** 统计截止日期，格式yyyy-MM-dd */
  endTime?: string
  /** 时间频度切换回调 */
  onFrequencyChange?: (frequency: 'month' | 'quarter' | 'year') => void
  /** 时间区间切换回调 */
  onIntervalChange?: (interval: 'month' | 'quarter' | 'year') => void
  /** 导出回调 */
  onExport?: () => void
  /** 加载状态 */
  loading?: boolean
  /** 图表高度 */
  height?: number
}

export const WinCountChart = memo(function WinCountChart({
  data,
  frequency = 'month', // 用户界面控制参数，暂未实现
  interval = 'month', // 后端接口参数，暂未实现
  startTime, // 时间范围参数，暂未实现
  endTime, // 时间范围参数，暂未实现
  onFrequencyChange, // 回调函数，暂未实现
  onIntervalChange, // 回调函数，暂未实现
  onExport, // 导出功能，暂未实现
  loading = false,
  height = 400,
}: WinCountChartProps) {
  // 避免 ESLint 未使用变量警告
  void frequency
  void interval
  void startTime
  void endTime
  void onFrequencyChange
  void onIntervalChange
  void onExport
  const chartData = useMemo(() => {
    if (!data?.length) {
      return {
        indicators: [],
        chart: {},
        config: {},
        chartConfig: {},
      }
    }

    // 处理数据格式
    const processedData = data.map((item) => ({
      date: item.date || item.startTime || '',
      winCount: item.bidCount ? item.bidCount : 0,
      loseCount: item.unsuccessfulBidCount ? item.unsuccessfulBidCount : 0,
      winAmount: item.totalMoney ? item.totalMoney : 0,
      tenderCount: item.tenderCount ? item.tenderCount : 0,
    }))

    return {
      legend: {
        show: true,
        position: 'top',
      },

      indicators: [
        {
          meta: {
            type: 'bar',
            unit: t('', '中标次数（次）'),
            uuid: '0',
            name: t('', '中标次数'),
            subType: ['stack'], // 关键：设置堆叠类型 上下堆叠

            label: {
              show: true, // 在meta中也设置标签显示
              position: 'insideTop',
              fontSize: 12,
              color: '#fff',
            },
          },
          data: processedData.map((item) => ({
            name: item.date,
            value: item.winCount,
          })),
        },
        {
          meta: {
            type: 'bar',
            uuid: '1',
            name: t('', '未中标次数'),
            subType: ['stack'], // 关键：设置堆叠类型
            label: {
              show: true, // 在meta中也设置标签显示
              position: 'insideTop',
              fontSize: 12,
              color: '#fff',
            },
          },
          data: processedData.map((item) => ({
            name: item.date,
            value: item.loseCount,
          })),
        },
        {
          meta: {
            type: 'line',
            uuid: '2',
            name: t('', '中标总金额'),
            unit: t('', '中标总金额（万元）'),
            yAxisIndex: 1,
            label: {
              show: false, // 折线图不显示标签
            },
          },
          data: processedData.map((item) => ({
            name: item.date,
            value: item.winAmount,
          })),
        },
      ],
    }
  }, [data])

  if (loading) {
    return (
      <div className={styles.root} style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    )
  }

  if (!data?.length) {
    return (
      <div className={styles.empty} style={{ height }}>
        <div>{t('422032', '暂无数据')}</div>
      </div>
    )
  }

  return (
    <div className={styles.root} style={{ height }}>
      <WCBChart
        waterMark={false}
        lang={isEn() ? 'en' : 'cn'}
        defaultTheme={{ name: 'wind.characteristic', data: defaultThemeObj }}
        data={chartData}
        style={{ height: '100%' }}
      />
    </div>
  )
})
