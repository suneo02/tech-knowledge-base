import { useRef } from 'react'
import { UseIndicatorCheckResult } from './useIndicatorCheck'

export interface IndicatorTreeOverallRef
  extends Pick<
    UseIndicatorCheckResult,
    'checkedIndicators' | 'setCheckedIndicators' | 'resetCheckedIndicators' | 'handleIndicatorCheck'
  > {
  getCheckedIndicators: () => Set<number>
  scrollToClassification: (classificationKey: string) => void
  getCurrentVisibleClassification: () => string | null
}

export interface IndicatorTreeOverallInstance extends Omit<IndicatorTreeOverallRef, 'checkedIndicators'> {
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
 * // 获取选中的指标
 * const checkedIndicators = indicatorTreeRef.getCheckedIndicators()
 *
 * // 设置选中的指标
 * indicatorTreeRef.setCheckedIndicators(['indicator-1', 'indicator-2'])
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
    getCheckedIndicators() {
      if (!treeRef.current) {
        warnIfNotReady()
        return new Set()
      }
      return treeRef.current.getCheckedIndicators() || new Set()
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
