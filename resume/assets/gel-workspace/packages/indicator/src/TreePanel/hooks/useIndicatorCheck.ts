import { useResetState } from 'ahooks'
import type { IndicatorTreeClassification } from 'gel-api'
import { useCallback } from 'react'

export interface UseIndicatorCheckResult {
  // 选中的指标 id 集合
  checkedIndicators: Set<number>
  // 处理分类的选中/取消选中
  handleClassificationCheck: (checked: boolean, classification: IndicatorTreeClassification) => void
  // 处理单个指标变化
  handleIndicatorCheck: (key: number, checked: boolean) => void
  // 检查指标是否被选中
  isIndicatorChecked: (indicatorKey: number) => boolean
  // 检查分类是否被选中（所有子指标都被选中）
  isClassificationSelected: (classification: IndicatorTreeClassification) => boolean
  // 检查分类是否部分选中
  isClassificationIndeterminate: (classification: IndicatorTreeClassification) => boolean
  // 设置选中的指标
  setCheckedIndicators: React.Dispatch<React.SetStateAction<Set<number>>>
  // 重置选中的指标
  resetCheckedIndicators: () => void
}

export function useIndicatorCheck(initialCheckedIndicators?: Set<number>): UseIndicatorCheckResult {
  // 使用 Set 存储选中的指标 id
  const [checkedIndicators, setCheckedIndicators, resetCheckedIndicators] = useResetState<Set<number>>(new Set())

  /**
   * 获取分类及其所有子分类下的所有指标 key
   */
  const getIndicatorKeys = useCallback((classification: IndicatorTreeClassification): number[] => {
    const keys: number[] = []

    // 添加当前分类的指标
    if (classification.indicators) {
      keys.push(...classification.indicators.map((i) => i.spId))
    }

    // 递归添加子分类的指标
    if (classification.children) {
      classification.children.forEach((child) => {
        keys.push(...getIndicatorKeys(child))
      })
    }

    return keys
  }, [])

  /**
   * 检查指标是否被选中
   */
  const isIndicatorChecked = useCallback(
    (indicatorKey: number): boolean => {
      return checkedIndicators.has(indicatorKey)
    },
    [checkedIndicators]
  )

  /**
   * 检查分类是否被选中（所有子指标都被选中）
   */
  const isClassificationSelected = useCallback(
    (classification: IndicatorTreeClassification): boolean => {
      const indicatorKeys = getIndicatorKeys(classification)
      // 过滤掉 initialCheckedIndicators 中的 key
      const selectableKeys = indicatorKeys.filter((key) => !initialCheckedIndicators?.has(key))
      return selectableKeys.length > 0 && selectableKeys.every((key) => checkedIndicators.has(key))
    },
    [checkedIndicators, getIndicatorKeys, initialCheckedIndicators]
  )

  /**
   * 检查分类是否部分选中（部分子指标被选中，但不是全部）
   */
  const isClassificationIndeterminate = useCallback(
    (classification: IndicatorTreeClassification): boolean => {
      const indicatorKeys = getIndicatorKeys(classification)
      // 过滤掉 initialCheckedIndicators 中的 key
      const selectableKeys = indicatorKeys.filter((key) => !initialCheckedIndicators?.has(key))
      if (selectableKeys.length === 0) return false // 如果没有可选的，则不是部分选中

      const hasChecked = selectableKeys.some((key) => checkedIndicators.has(key))
      const allChecked = selectableKeys.every((key) => checkedIndicators.has(key))
      return hasChecked && !allChecked
    },
    [checkedIndicators, getIndicatorKeys, initialCheckedIndicators]
  )

  /**
   * 处理分类的选中/取消选中
   * 当点击分类的 checkbox 时调用
   */
  const handleClassificationCheck = useCallback(
    (checked: boolean, classification: IndicatorTreeClassification) => {
      // 获取当前分类及其所有子分类下的所有指标 key
      const indicatorKeys = getIndicatorKeys(classification)

      setCheckedIndicators((prev) => {
        const next = new Set(prev)

        if (checked) {
          // 选中操作：将所有相关指标添加到选中集合中，除非它在 initialCheckedIndicators 中
          indicatorKeys.forEach((key) => {
            if (!initialCheckedIndicators?.has(key)) {
              next.add(key)
            }
          })
        } else {
          // 取消选中操作：从选中集合中移除所有相关指标，除非它在 initialCheckedIndicators 中
          indicatorKeys.forEach((key) => {
            if (!initialCheckedIndicators?.has(key)) {
              next.delete(key)
            }
          })
        }

        return next
      })
    },
    [getIndicatorKeys, initialCheckedIndicators, setCheckedIndicators]
  )

  /**
   * 处理单个指标变化
   */
  const handleIndicatorCheck = useCallback(
    (key: number, checked: boolean) => {
      // 如果指标在 initialCheckedIndicators 中，则不允许修改
      if (initialCheckedIndicators?.has(key)) {
        return
      }
      setCheckedIndicators((prev) => {
        const next = new Set<number>()

        // If adding, first add all existing indicators, then add the new one
        if (checked) {
          prev.forEach((k) => next.add(k))
          next.add(key)
        } else {
          // If removing, add all except the one being removed
          prev.forEach((k) => {
            if (k !== key) {
              next.add(k)
            }
          })
        }

        return next
      })
    },
    [initialCheckedIndicators, setCheckedIndicators]
  )

  return {
    checkedIndicators,
    handleClassificationCheck,
    handleIndicatorCheck,
    isIndicatorChecked,
    isClassificationSelected,
    isClassificationIndeterminate,
    setCheckedIndicators,
    resetCheckedIndicators,
  }
}
