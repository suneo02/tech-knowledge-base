import { useMemo } from 'react'

/**
 * 将未知输入解析为数字或 null。
 * @param input - 需要解析的输入值。
 * @returns 返回一个数字或 null。
 */
const parseInputToNumber = (input: unknown): number | null => {
  if (input === null || input === undefined || input === '') {
    return null
  }
  const num = Number(input)
  return Number.isNaN(num) ? null : num
}

/**
 * 一个自定义 Hook，用于将一个值解析为`[min, max]`的数字范围。
 * 它可以处理以下情况:
 * - 包含两个数字的数组: `[10, 20]`
 * - 包含单个字符串的数组: `'10-20'`, `'10-'`, `'-20'`, `'10'`
 * - 包含单个数字的数组: `[10]`
 * - 包含混合类型的数组: `[10, '20']`, `[null, 20]`
 *
 * @param value - 需要处理的值，通常来自 `value.value`。
 * @returns 返回一个 memoized 后的元组 `[min: number | null, max: number | null]`。
 *
 * @example
 * useRangeValue([10, 20]);
 * // returns [10, 20]
 *
 * @example
 * useRangeValue(['10-20']);
 * // returns [10, 20]
 *
 * @example
 * useRangeValue(['10-']);
 * // returns [10, null]
 *
 * @example
 * useRangeValue(['-20']);
 * // returns [null, 20]
 *
 * @example
 * useRangeValue([10]);
 * // returns [10, null]
 *
 * @example
 * useRangeValue(['10']);
 * // returns [10, null]
 *
 * @example
 * useRangeValue([]);
 * // returns [null, null]
 *
 * @example
 * useRangeValue([10, '20']);
 * // returns [10, 20]
 *
 * @example
 * useRangeValue([null, 20]);
 * // returns [null, 20]
 */
export const useRangeValue = (value: unknown): [number | null, number | null] => {
  return useMemo(() => {
    if (!Array.isArray(value)) {
      return [null, null]
    }

    if (value.length === 0) {
      return [null, null]
    }

    // Case: single value in array
    if (value.length === 1) {
      const singleValue = value[0]
      if (typeof singleValue === 'string' && singleValue.includes('-')) {
        const parts = singleValue.split('-')
        if (parts.length === 2) {
          // '12-13', '12-', '-13'
          const [minStr, maxStr] = parts
          return [parseInputToNumber(minStr), parseInputToNumber(maxStr)]
        }
      }
      // e.g. '16', 16, or something that didn't parse with '-'
      return [parseInputToNumber(singleValue), null]
    }

    // Case: array with 2 values, e.g. [12, 13], [null, 13], ['12', '13']
    const [minVal, maxVal] = value
    return [parseInputToNumber(minVal), parseInputToNumber(maxVal)]
  }, [value])
}
