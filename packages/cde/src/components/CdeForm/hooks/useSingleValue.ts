import { useMemo } from 'react'

/**
 * 一个自定义 Hook，用于将一个可能是数组或字符串的值转换为一个单一的字符串。
 * 这对于像 RadioGroup 这样期望单个值的组件特别有用。
 *
 * @param value - 需要处理的值，可以是字符串、数字或数组。
 * @returns 返回一个 memoized 后的单字符串。如果是数组，则返回第一个元素；
 * 如果是字符串或数字，则返回其本身；其他情况返回空字符串。
 *
 * @example
 * // 返回 'a'
 * const single = useSingleValue(['a', 'b']);
 *
 * @example
 * // 返回 'a'
 * const single2 = useSingleValue('a');
 *
 * @example
 * // 返回 ''
 * const single3 = useSingleValue(undefined);
 */
export const useSingleValue = (value: unknown): string => {
  return useMemo(() => {
    if (Array.isArray(value)) {
      return value.length > 0 ? String(value[0]) : ''
    }
    if (typeof value === 'string') {
      return value
    }
    if (typeof value === 'number') {
      return String(value)
    }
    return ''
  }, [value])
}
