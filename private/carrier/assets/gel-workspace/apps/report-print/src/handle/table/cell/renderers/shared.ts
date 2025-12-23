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

/**
 * 处理 array
 */
export function handleConfigTableArray(
  txt: any,
  config: ConfigTableCellRenderConfig,
  renderNotArray: (txt: any) => JQuery | string
) {
  if (!config.isArrayData) {
    return renderNotArray(txt)
  }
  if (!Array.isArray(txt)) {
    console.warn('txt is not an array:', txt)
    return renderNotArray(txt)
  }
  const $element = $('<span>')
  for (let i = 0; i < txt.length; i++) {
    $element.append(renderNotArray(txt[i]))
    // Add line break after each item except the last one
    if (i < txt.length - 1) {
      $element.append($('<br>'))
    }
  }
  return $element
}
