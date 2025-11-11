/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'
import { CDEFormValues } from '../types'

type InitialValueArrayItem = {
  itemId: string | number
  value: any
  [key: string]: any
}

/**
 * 一个自定义 Hook，用于规范化 FilterForm 的 `initialValues`。
 *
 * **何时使用此 Hook：**
 * 当 `initialValues` 来自外部数据源（例如 API 返回的已保存筛选器）且其格式可能为数组时，请使用此 Hook。
 * 它主要将数组形式的筛选值 (`{itemId: string, value: any}[]`) 转换为 `FilterForm` 所期望的、以 `itemId` 为键的对象格式。
 * 如果值已经是对象格式，则直接返回。
 *
 * **与 `buildInitialValuesFromConfig` 的区别：**
 * - `useNormalizedValues`: 重点在于 **规范化已有的值**，通常是动态的、来自外部的值。
 * - `buildInitialValuesFromConfig`: 重点在于从 **静态的组件配置** 中 **生成初始值**。
 *
 * @param initialValues - 原始的初始值，可以是符合 `InitialValueArrayItem[]` 格式的数组，或已经是 `FilterFormValues` 对象。
 * @returns 返回规范化后的对象形式的初始值，或在没有初始值时返回 `undefined`。
 *
 * @example
 * // 示例 1: 当 initialValues 是一个数组时
 * const initialArray = [
 *   { itemId: 'corp_name', value: ['Apple'], logic: 'any' },
 *   { itemId: 'data_from', value: ['298010000'], logic: 'any' }
 * ];
 * const { result } = renderHook(() => useNormalizedValues(initialArray));
 * // result.current 将会是:
 * // {
 * //   corp_name: { value: ['Apple'], logic: 'any' },
 * //   data_from: { value: ['298010000'], logic: 'any' }
 * // }
 *
 * // 示例 2: 当 initialValues 已经是一个对象时
 * const initialObject = {
 *   corp_name: { value: ['Microsoft'], logic: 'all' }
 * };
 * const { result } = renderHook(() => useNormalizedValues(initialObject));
 * // result.current 将会保持不变:
 * // {
 * //   corp_name: { value: ['Microsoft'], logic: 'all' }
 * // }
 *
 * // 示例 3: 当 initialValues 为空时
 * const { result } = renderHook(() => useNormalizedValues(undefined));
 * // result.current 将会是 undefined
 */
export const useNormalizedValues = (
  initialValues: InitialValueArrayItem[] | CDEFormValues | undefined
): CDEFormValues | undefined => {
  return useMemo(() => {
    if (!initialValues) {
      return undefined
    }

    if (!Array.isArray(initialValues)) {
      return initialValues
    }

    const result: CDEFormValues = {}

    for (const item of initialValues) {
      if (item.itemId !== undefined) {
        const { itemId, ...rest } = item
        result[itemId] = {
          ...rest,
          operator: rest.logic,
        }
      }
    }

    return result
  }, [initialValues])
}
