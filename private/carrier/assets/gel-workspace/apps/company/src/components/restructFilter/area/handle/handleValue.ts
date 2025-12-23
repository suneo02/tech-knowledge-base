import React from 'react'
import { getAreaCodes } from '../../../../lib/utils.js'

/**
 * 解析铺平的数据
 * @param valueFlattened
 * @param geoFilters
 */
export const parseRegionCascadeValue = (valueFlattened: React.Key[], geoFilters) => {
  const res = []
  valueFlattened.forEach((option) => {
    res.push(getAreaCodes(option))
  })
  geoFilters.forEach((item) => {
    if (item?.id) {
      // 判断是地盘还是定位
      res.push(['territory', item.id])
    } else {
      res.push(['current_location'])
    }
  })
  return res
}
