import { ConfigTableCellRenderConfig } from 'gel-types'

/**
 * 处理 object key
 */
export function handleConfigTableObjectKey(
  value: any,
  objectKey: ConfigTableCellRenderConfig['objectKey'] | ConfigTableCellRenderConfig['renderConfig']['objectKeyForArray']
) {
  if (objectKey) {
    if (typeof value !== 'object' || value == null) {
      console.warn('value is not an object:', value)
      return value
    }
    return value[objectKey]
  }
  return value
}
