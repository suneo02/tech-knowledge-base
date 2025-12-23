import { configDetailIntlHelper } from '@/corpConfigJson/intlHelper'
import { TIntl } from '@/types/misc'
import { ConfigTableCellRenderOptions } from 'gel-types'
import { isStringOrNumber } from './validate'

// 默认值
export const DEFAULT_EMPTY_TEXT = '--'

/**
 * 将任意值安全转换为ReactNode
 * @param value 要检查的值
 * @returns 可以安全渲染的ReactNode
 */
export function safeToStringRender(
  t: TIntl,
  value: any,
  config: Pick<ConfigTableCellRenderOptions, 'emptyText' | 'emptyTextIntl'> | undefined
): string {
  try {
    let emptyText = DEFAULT_EMPTY_TEXT
    if (config?.emptyText) {
      emptyText = configDetailIntlHelper(config, 'emptyText', t)
    }
    if (value == null) {
      return emptyText
    }

    // 处理基本类型
    if (isStringOrNumber(value)) {
      return String(value) || emptyText
    }

    // 数组和对象等复杂类型，返回 JSON 字符串
    console.warn('Cannot convert to ReactNode:', value)
    console.trace()
    return JSON.stringify(value)
  } catch (error) {
    console.error('Cannot convert to JSON:', value)
    return DEFAULT_EMPTY_TEXT
  }
}
