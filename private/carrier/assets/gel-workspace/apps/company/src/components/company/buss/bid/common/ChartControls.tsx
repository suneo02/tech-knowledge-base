import React from 'react'
import { Button, Select } from '@wind/wind-ui'
import { DownloadOutlined } from '@ant-design/icons'
import { isEn } from 'gel-util/intl'
import styles from './ChartControls.module.less'

/**
 * 图表控制器组件Props
 */
export interface ChartControlsProps {
  /** 当前时间频率 */
  frequency: 'month' | 'quarter' | 'year'
  /** 频率切换回调 */
  onFrequencyChange?: (frequency: 'month' | 'quarter' | 'year') => void
  /** 导出回调 */
  onExport?: () => void
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示导出按钮 */
  showExport?: boolean
  /** 自定义样式类名 */
  className?: string
}

/**
 * 通用图表控制器组件
 *
 * @description 提供时间频率切换和导出功能的通用控制器组件
 * @since 1.0.0
 *
 * @param frequency - 当前时间频率
 * @param onFrequencyChange - 频率切换回调函数
 * @param onExport - 导出回调函数
 * @param disabled - 是否禁用
 * @param showExport - 是否显示导出按钮
 * @param className - 自定义样式类名
 *
 * @returns JSX.Element 图表控制器组件
 */
export const ChartControls: React.FC<ChartControlsProps> = ({
  frequency,
  onFrequencyChange,
  onExport,
  disabled = false,
  showExport = true,
  className,
}) => {
  // 频率选项
  const frequencyOptions = [
    { label: isEn() ? 'Monthly' : '月频', value: 'month' },
    { label: isEn() ? 'Quarterly' : '季频', value: 'quarter' },
    { label: isEn() ? 'Yearly' : '年频', value: 'year' },
  ]

  // 处理频率切换
  const handleFrequencyChange = (newFrequency: 'month' | 'quarter' | 'year') => {
    onFrequencyChange?.(newFrequency)
  }

  // 处理导出
  const handleExport = () => {
    onExport?.()
  }

  return (
    <div className={`${styles.root} ${className || ''}`}>
      <div className={styles.frequencyControl}>
        <Select
          value={frequency}
          onChange={handleFrequencyChange}
          options={frequencyOptions}
          style={{ width: 100 }}
          size="small"
          disabled={disabled}
        />
      </div>
      {showExport && (
        <Button type="primary" icon={<DownloadOutlined />} size="small" onClick={handleExport} disabled={disabled}>
          {isEn() ? 'Export' : '导出'}
        </Button>
      )}
    </div>
  )
}
