import { useResetState } from 'ahooks'
import type { IndicatorTreeClassification, IndicatorTreeIndicator } from 'gel-api'
import { useCallback } from 'react'
import { findIndicatorById } from '../handle'

export interface UseIndicatorCheckResult {
  // 选中的指标 Map（新的 newMap 数据结构）
  checkedIndicators: Map<number, IndicatorTreeIndicator>
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
  setCheckedIndicators: React.Dispatch<React.SetStateAction<Map<number, IndicatorTreeIndicator>>>
  // 重置选中的指标
  resetCheckedIndicators: () => void
  // 获取选中的指标数量
  getCheckedCount: () => number
  // 获取选中的指标ID集合（兼容性方法）
  getCheckedIds: () => Set<number>
  // 获取选中的指标对象数组
  getCheckedIndicators: () => IndicatorTreeIndicator[]
}

export function useIndicatorCheck(
  indicatorTree: IndicatorTreeClassification[],
  initialCheckedIndicators?: Set<number>
): UseIndicatorCheckResult {
  // 使用 Map 存储选中的指标完整信息（newMap）
  const [checkedIndicators, setCheckedIndicators, resetCheckedIndicators] = useResetState<
    Map<number, IndicatorTreeIndicator>
  >(new Map())

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
        const next = new Map(prev)

        if (checked) {
          // 选中操作：将所有相关指标添加到选中集合中，除非它在 initialCheckedIndicators 中
          indicatorKeys.forEach((key) => {
            if (!initialCheckedIndicators?.has(key)) {
              const indicator = findIndicatorById(indicatorTree, key)
              if (indicator) {
                next.set(key, indicator)
              }
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
    [getIndicatorKeys, initialCheckedIndicators, setCheckedIndicators, indicatorTree]
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
        const next = new Map<number, IndicatorTreeIndicator>()

        // 先复制所有现有的指标
        prev.forEach((indicator, k) => {
          next.set(k, indicator)
        })

        if (checked) {
          // 添加指标：查找完整的指标对象并添加到 Map 中
          const indicator = findIndicatorById(indicatorTree, key)
          if (indicator) {
            next.set(key, indicator)
          }
        } else {
          // 移除指标
          next.delete(key)
        }

        return next
      })
    },
    [initialCheckedIndicators, setCheckedIndicators, indicatorTree]
  )

  /**
   * 获取选中的指标数量
   */
  const getCheckedCount = useCallback(() => {
    return checkedIndicators.size
  }, [checkedIndicators])

  /**
   * 获取选中的指标ID集合（兼容性方法）
   */
  const getCheckedIds = useCallback(() => {
    return new Set(checkedIndicators.keys())
  }, [checkedIndicators])

  /**
   * 获取选中的指标对象数组
   */
  const getCheckedIndicators = useCallback(() => {
    return Array.from(checkedIndicators.values())
  }, [checkedIndicators])

  return {
    checkedIndicators,
    handleClassificationCheck,
    handleIndicatorCheck,
    isIndicatorChecked,
    isClassificationSelected,
    isClassificationIndeterminate,
    setCheckedIndicators,
    resetCheckedIndicators,
    getCheckedCount,
    getCheckedIds,
    getCheckedIndicators,
  }
}
