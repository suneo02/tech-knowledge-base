import classNames from 'classnames'
import { ConfigTableCellJsonConfig } from 'gel-types'
import React from 'react'
import { getDefaultImage, getImageUrl } from 'report-util/misc'
import styles from './image.module.less'

/**
 *
 * @param value
 * @param _record
 * @param options
 * @returns
 */
export const renderImage = (
  value: any,
  _record: any,
  options: ConfigTableCellJsonConfig['renderConfig'] | undefined,
  getWsid: () => string | undefined
) => {
  if (!options) {
    return null
  }
  const url = getImageUrl(options.imageTableId, value, getWsid())
  const defaultImg = getDefaultImage(options.imageRenderType)
  return (
    <img
      className={classNames(styles['company-table-logo'])}
      alt={options.imageTableId}
      src={url}
      width={'auto'}
      onError={(e) => {
        // @ts-expect-error
        e.target.src = defaultImg
      }}
    />
  )
}
