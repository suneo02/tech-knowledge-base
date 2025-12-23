import { ConfigTableCellRenderConfig, ConfigTableCellRenderOptions } from 'gel-types'
import React, { ReactNode } from 'react'

/**
 * 处理 object key
 */
export function handleConfigTableObjectKey(
  value: any,
  objectKey: ConfigTableCellRenderConfig['objectKey'] | ConfigTableCellRenderOptions['objectKeyForArray']
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
  renderNotArray: (txt: any) => ReactNode
) {
  if (!config.isArrayData) {
    return renderNotArray(txt)
  }
  if (!Array.isArray(txt)) {
    console.warn('txt is not an array:', txt)
    return renderNotArray(txt)
  }
  return txt.map((item, index) => (
    <React.Fragment key={index}>
      {renderNotArray(item)}
      {index < txt.length - 1 && <br />}
    </React.Fragment>
  ))
}
