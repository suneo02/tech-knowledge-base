/**
 * UI 交互状态 Hook：管理悬停行与选中指标键。
 * @author yxlu.calvin
 * @example
 * const { hoveredRowKey, setHoveredRowKey } = useFinancialUI()
 */
import { useState } from 'react'

export const useFinancialUI = () => {
  const [hoveredRowKey, setHoveredRowKey] = useState<string | null>(null)
  const [selectedMetricKey, setSelectedMetricKey] = useState<string | null>(null)

  return {
    hoveredRowKey,
    setHoveredRowKey,
    selectedMetricKey,
    setSelectedMetricKey,
  }
}