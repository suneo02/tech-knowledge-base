import React from 'react'
import { Select, Spin } from '@wind/wind-ui'
import { isEn } from 'gel-util/intl'
import { DEFAULT_HEIGHT } from '../config/regionDistribution'
import { RegionMap, type RegionItem } from './RegionMap'
import { RegionBarChart, type RegionBarData } from './RegionBarChart'
import styles from './RegionDistribution.module.less'

interface RegionDistributionData {
  mapData: RegionItem[]
  topList: RegionBarData[]
}

interface AreaOption {
  code: string
  name: string
}

interface SelectedArea {
  oldCode: string | null
  name: string
  code?: string
}

interface RegionDistributionProps {
  data: RegionDistributionData
  /** 指定要统计的省份的地区代码，不传或传空则表示统计所有省份 */
  provinceCode?: string
  /** 统计开始日期，格式yyyy-MM-dd，默认去年1月1日 */
  startTime?: string
  /** 统计截止日期，格式yyyy-MM-dd，默认当前日期 */
  endTime?: string
  height?: number
  loading?: boolean
  title?: string
  valueKey?: 'winCount' | 'winAmount'
  topN?: number
  onSelectRegion?: (regionCode: string, regionName: string) => void
  // 选择器
  areaOptions?: AreaOption[]
  selectedAreaCode?: string
  onChangeSelectedArea?: (option: AreaOption | null) => void
  // 右侧柱状图标题
  barTitle?: string
  // 已选地区（用于地图标题行展示与下钻）
  selectedArea?: SelectedArea
}

export const RegionDistribution: React.FC<RegionDistributionProps> = ({
  data,
  provinceCode,
  startTime,
  endTime,
  height = DEFAULT_HEIGHT,
  loading = false,
  valueKey = 'winCount',
  topN = 10,
  onSelectRegion,
  areaOptions = [],
  selectedAreaCode,
  onChangeSelectedArea,
  barTitle,
  selectedArea,
}) => {
  const areaSelect = React.useMemo(() => {
    if (!areaOptions?.length || !onChangeSelectedArea) return null
    return (
      <div className={styles.toolbar}>
        <Select
          style={{ width: 260 }}
          placeholder={isEn() ? 'Select region' : '选择地区'}
          value={selectedAreaCode}
          options={areaOptions.map((o) => ({ label: o.name, value: o.code }))}
          onChange={(val: string) => {
            const found = areaOptions.find((o) => o.code === val) || null
            onChangeSelectedArea(found)
          }}
          size="small"
        />
      </div>
    )
  }, [areaOptions, selectedAreaCode, onChangeSelectedArea])

  // 处理时间范围显示（可选，用于调试或显示）
  const timeRangeText = startTime && endTime ? `${startTime} ~ ${endTime}` : '最近一年数据'

  return (
    <div className={styles.root} style={{ height }}>
      {loading && (
        <div className={styles.overlay}>
          <Spin size="large" />
        </div>
      )}
      <div className={styles.container}>
        {/* 可选：显示时间范围信息 */}
        {(startTime || endTime) && (
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>{timeRangeText}</div>
        )}
        {/* 可选：显示省份代码信息 */}
        {provinceCode && (
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>省份代码: {provinceCode}</div>
        )}
        {areaSelect}
        <div className={styles.layout}>
          <div className={styles.leftCol}>
            <RegionMap
              data={data?.mapData || []}
              valueKey={valueKey}
              onSelectRegion={onSelectRegion}
              selectedArea={selectedArea}
              className={styles.mapComponent}
            />
          </div>
          <div className={styles.rightCol}>
            <RegionBarChart
              data={data?.topList || []}
              valueKey={valueKey}
              topN={topN}
              title={barTitle}
              className={styles.barComponent}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export type { RegionDistributionProps, RegionDistributionData, RegionItem, RegionBarData, AreaOption, SelectedArea }
