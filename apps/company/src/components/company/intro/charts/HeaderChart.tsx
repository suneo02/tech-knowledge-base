import React from 'react'
import './HeaderChart.less'
import { useCompanyTabWidth } from '@/hooks/useCompanyTabWidth.ts'
import { Col } from '@wind/wind-ui'

export interface HeaderChartProps {
  /** 显示文本 */
  text: string
  /** 是否为第一行展示（影响样式） */
  isFirstRow?: boolean
  /** 点击事件 */
  onClick: () => void
}

/**
 * 企业图谱入口组件
 */
export const HeaderChart: React.FC<HeaderChartProps> = ({ text, isFirstRow = false, onClick }) => {
  const chartClassName = `header-chart ${isFirstRow ? 'header-chart-2' : ''} center-container`
  const isWidthLessThan985 = useCompanyTabWidth()
  return (
    <Col className="gutter-row corp-intro-chart-col" span={4} key={text}>
      <div className={chartClassName} onClick={onClick}>
        <span>{text}</span>
        <div className={isWidthLessThan985 ? 'kg-bg-container kg-bg-container-small' : 'kg-bg-container'}></div>
      </div>
    </Col>
  )
}

export default HeaderChart
