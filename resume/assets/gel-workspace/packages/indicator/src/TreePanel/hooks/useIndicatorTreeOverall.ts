import { useRef } from 'react'
import type { IndicatorTreeIndicator } from 'gel-api'
import { UseIndicatorCheckResult } from './useIndicatorCheck'

export interface IndicatorTreeOverallRef
  extends Pick<
    UseIndicatorCheckResult,
    'checkedIndicators' | 'setCheckedIndicators' | 'resetCheckedIndicators' | 'handleIndicatorCheck'
  > {
  // 兼容性方法：返回选中的指标ID集合
  getCheckedIndicators: () => Set<number>
  // 新方法：返回选中的指标Map
  getCheckedIndicatorsMap: () => Map<number, IndicatorTreeIndicator>
  // 新方法：返回选中的指标对象数组
  getCheckedIndicatorsList: () => IndicatorTreeIndicator[]
  scrollToClassification: (classificationKey: string) => void
  getCurrentVisibleClassification: () => string | null
}

export interface IndicatorTreeOverallInstance {
  // 兼容性方法：返回选中的指标ID集合
  getCheckedIndicators: () => Set<number>
  // 新方法：返回选中的指标Map
  getCheckedIndicatorsMap: () => Map<number, IndicatorTreeIndicator>
  // 新方法：返回选中的指标对象数组
  getCheckedIndicatorsList: () => IndicatorTreeIndicator[]
  setCheckedIndicators: (indicators: Map<number, IndicatorTreeIndicator>) => void
  resetCheckedIndicators: () => void
  handleIndicatorCheck: (indicator: number, checked: boolean) => void
  scrollToClassification: (classificationKey: string) => void
  getCurrentVisibleClassification: () => string | null
  getTreeRef: () => React.RefObject<IndicatorTreeOverallRef>
}

/**
 * 创建 IndicatorTreeOverall 实例
 * @returns IndicatorTreeOverall 实例
 *
 * 使用示例:
 * ```tsx
 * const indicatorTreeRef = useIndicatorTreeOverall()
 *
 * // 获取选中的指标ID集合（兼容性方法）
 * const checkedIndicators = indicatorTreeRef.getCheckedIndicators()
 *
 * // 获取选中的指标Map（新方法）
 * const checkedIndicatorsMap = indicatorTreeRef.getCheckedIndicatorsMap()
 *
 * // 获取选中的指标对象数组（新方法）
 * const checkedIndicatorsList = indicatorTreeRef.getCheckedIndicatorsList()
 *
 * // 设置选中的指标
 * indicatorTreeRef.setCheckedIndicators(new Map())
 *
 * // 重置选择
 * indicatorTreeRef.resetCheckedIndicators()
 *
 * return (
 *   <IndicatorTreeOverall
 *     ref={indicatorTreeRef.getTreeRef()}
 *     indicatorTree={indicatorTree}
 *   />
 * )
 * ```
 */
export const useIndicatorTreeOverall = (): IndicatorTreeOverallInstance => {
  const treeRef = useRef<IndicatorTreeOverallRef>(null)

  // 用于开发环境下的警告提示
  const warning = useRef(false)

  const warnIfNotReady = () => {
    if (process.env.NODE_ENV !== 'production' && !warning.current) {
      warning.current = true
      console.warn('IndicatorTreeOverall is not ready. ' + 'Please ensure it is rendered with valid props.')
    }
  }

  // 确保实例只创建一次
  const treeInstance = useRef<IndicatorTreeOverallInstance>({
    // 兼容性方法：返回选中的指标ID集合
    getCheckedIndicators() {
      if (!treeRef.current) {
        warnIfNotReady()
        return new Set()
      }
      return treeRef.current.getCheckedIndicators() || new Set()
    },
    // 新方法：返回选中的指标Map
    getCheckedIndicatorsMap() {
      if (!treeRef.current) {
        warnIfNotReady()
        return new Map()
      }
      return treeRef.current.getCheckedIndicatorsMap() || new Map()
    },
    // 新方法：返回选中的指标对象数组
    getCheckedIndicatorsList() {
      if (!treeRef.current) {
        warnIfNotReady()
        return []
      }
      return treeRef.current.getCheckedIndicatorsList() || []
    },
    setCheckedIndicators: (indicators) => {
      if (!treeRef.current) {
        warnIfNotReady()
        return
      }
      treeRef.current.setCheckedIndicators(indicators)
    },
    resetCheckedIndicators: () => {
      if (!treeRef.current) {
        warnIfNotReady()
        return
      }
      treeRef.current.resetCheckedIndicators()
    },
    handleIndicatorCheck: (indicator, checked) => {
      if (!treeRef.current) {
        warnIfNotReady()
        return
      }
      treeRef.current.handleIndicatorCheck(indicator, checked)
    },
    scrollToClassification: (classificationKey) => {
      if (!treeRef.current) {
        warnIfNotReady()
        return
      }
      treeRef.current.scrollToClassification(classificationKey)
    },
    getCurrentVisibleClassification: () => {
      if (!treeRef.current) {
        warnIfNotReady()
        return null
      }
      return treeRef.current.getCurrentVisibleClassification()
    },
    getTreeRef() {
      return treeRef
    },
  })

  return treeInstance.current
}
