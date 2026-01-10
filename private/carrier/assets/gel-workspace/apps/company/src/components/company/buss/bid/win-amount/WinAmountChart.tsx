import { Spin } from '@wind/wind-ui'
import * as echarts from 'echarts'
import { t } from 'gel-util/intl'
import React, { useEffect, useMemo, useRef } from 'react'
import styles from './WinAmountChart.module.less'

/**
 * 中标金额数据接口 - 来自金额分析接口
 */
type WinAmountData = {
  /** 时间序列数据 */
  startTime: string
  interval: 'month' | 'quarter' | 'year'
  maxMoney: number
  minMoney: number
  midMoney: number
  lowQuarterMoney: number
  highQuarterMoney: number
}

/**
 * 中标金额图表组件Props
 */
interface WinAmountChartProps {
  /** 图表数据 */
  data: WinAmountData[]
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

/**
 * 中标金额分析图表
 *
 * @description 展示企业中标金额的时间趋势和统计分布，在同一图表中包含折线图和箱型图
 * @since 1.0.0
 *
 * @param data - 中标金额数据，来自金额分析接口
 * @param frequency - 时间频度（用户界面控制）：month/quarter/year
 * @param interval - 时间区间（后端接口参数）：month/quarter/year
 * @param startTime - 统计开始日期，格式yyyy-MM-dd
 * @param endTime - 统计截止日期，格式yyyy-MM-dd
 * @param onFrequencyChange - 时间频度切换回调函数
 * @param onIntervalChange - 时间区间切换回调函数
 * @param onExport - 导出回调函数
 * @param loading - 加载状态
 * @param height - 图表高度
 *
 * @returns JSX.Element 中标金额分析图表组件
 */
export const WinAmountChart: React.FC<WinAmountChartProps> = ({
  data,
  frequency = 'month', // 用户界面控制参数，暂未实现
  interval = 'month', // 后端接口参数，暂未实现
  startTime,
  endTime,
  onFrequencyChange, // 回调函数，暂未实现
  onIntervalChange, // 回调函数，暂未实现
  onExport, // 导出功能，暂未实现
  loading = false,
  height = 400,
}) => {
  // 避免 ESLint 未使用变量警告
  void frequency
  void interval
  void onFrequencyChange
  void onIntervalChange
  void onExport
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  // 处理时间范围文本
  const timeRangeText = startTime && endTime ? `${startTime} ~ ${endTime}` : '最近数据'

  // ECharts 配置
  const chartOption = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return {}
    }

    return {
      // 图表标题配置
      title: {
        left: 'center', // 标题水平居中
        top: 10, // 距离顶部10px
        textStyle: {
          fontSize: 16, // 标题字体大小
          fontWeight: 'normal', // 标题字体粗细
        },
      },
      // 提示框配置
      tooltip: {
        trigger: 'axis', // 触发类型：坐标轴触发
        axisPointer: {
          type: 'cross', // 指示器类型：十字准星
        },
        // 自定义提示框内容格式化函数
        formatter: (
          params: Array<{
            name: string
            seriesType: string
            seriesName: string
            value: number
            marker: string
            data: number[]
          }>
        ) => {
          let result = `${params[0].name}<br/>` // 显示时间点

          params.forEach((param) => {
            if (param.seriesType === 'boxplot') {
              // 箱型图数据：显示分布统计信息
              const data = param.data
              result += `${param.marker}  ${t('', '最高中标金额')}: ${data[5]} ${t('19487', '万元')}<br/>`
              result += `${param.marker}  ${t('', '最低中标金额')}: ${data[1]} ${t('19487', '万元')}<br/>`
              result += `${param.marker}  ${t('', '中标金额中位数')}: ${data[3]} ${t('19487', '万元')}<br/>`
              result += `${param.marker}  ${t('', '中标金额上1/4位')}: ${data[4]} ${t('19487', '万元')}<br/>`
              result += `${param.marker}  ${t('', '中标金额下1/4位')}: ${data[2]} ${t('19487', '万元')}<br/>`
            }
          })

          return result
        },
      },
      // 图例配置
      legend: {
        bottom: 0,
      },
      // 图表网格配置
      grid: {
        left: '10%', // 左边距
        right: '10%', // 右边距
        top: '20%', // 上边距
        bottom: '15%', // 下边距
      },
      // X轴配置
      xAxis: {
        type: 'category', // 坐标轴类型：类目轴
        data: data.map((item) => item.startTime), // 时间数据

        nameLocation: 'middle', // 坐标轴名称位置：中间
        nameGap: 30, // 坐标轴名称与轴线之间的距离
        axisLabel: {
          rotate: 0,
        },
      },
      // Y轴配置
      yAxis: {
        type: 'value', // 坐标轴类型：数值轴
        name: t('', '中标金额（万元）'), // 坐标轴名称

        nameGap: 20, // 坐标轴名称与轴线之间的距离
        splitArea: {
          show: true, // 显示分割区域，增强可读性
        },
      },
      // 数据系列配置
      series: [
        // 折线图系列2 - 中位数金额趋势线
        {
          name: t('', '中位数金额'), // 系列名称
          type: 'line', // 图表类型：折线图
          data: data.map((item) => item.midMoney), // 数据：中位数金额数组

          lineStyle: {
            color: '#F68717', // 线条颜色：绿色
            width: 2, // 线条宽度
          },
          itemStyle: {
            color: '#F68717', // 数据点颜色
          },
        },

        // 箱型图系列 - 金额分布统计
        {
          name: t('425520', '金额分布'), // 系列名称
          type: 'boxplot', // 图表类型：箱型图
          data: data.map((item) => [
            item.minMoney, // 最小值
            item.lowQuarterMoney, // 下四分位数
            item.midMoney, // 中位数
            item.highQuarterMoney, // 上四分位数
            item.maxMoney, // 最大值
          ]), // 箱型图数据格式：[min, Q1, median, Q3, max]
          itemStyle: {
            color: '#05809f', // 箱体颜色：紫色
            borderColor: '#05809f', // 边框颜色
          },
          emphasis: {
            itemStyle: {
              color: '#05809f', // 高亮时箱体颜色：浅紫色
              borderColor: '#05809f', // 高亮时边框颜色
            },
          },
          boxWidth: ['60%', '60%'], // 箱体宽度范围：最小20%，最大20%
        },
      ],
    }
  }, [data, timeRangeText]) // 依赖项：数据和时间范围文本

  // 图表初始化和配置
  useEffect(() => {
    // 初始化 ECharts 实例
    if (chartRef.current && !chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current)
    }

    // 设置图表配置
    if (chartInstance.current) {
      chartInstance.current.setOption(chartOption)
    }

    // 组件卸载时清理图表实例
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose() // 销毁图表实例
        chartInstance.current = null // 清空引用
      }
    }
  }, [chartOption]) // 依赖项：图表配置

  // 响应式处理：监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize() // 重新调整图表大小
      }
    }

    // 添加窗口大小变化监听器
    window.addEventListener('resize', handleResize)
    // 清理监听器
    return () => window.removeEventListener('resize', handleResize)
  }, []) // 空依赖数组：只在组件挂载时执行一次

  // 空数据状态处理
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#999' }}>{t('422032', '暂无数据')}</span>
      </div>
    )
  }

  // 渲染图表组件
  return (
    <div className={styles.root} style={{ height }}>
      {/* 加载状态遮罩层 */}
      {loading && (
        <div className={styles.overlay}>
          <Spin size="large" />
        </div>
      )}

      {/* 图表容器 */}
      <div ref={chartRef} className={styles.chart} />
    </div>
  )
}

// 导出组件类型定义
export type { WinAmountChartProps, WinAmountData }
