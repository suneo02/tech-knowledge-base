import { COMMON_CONSTANTS } from '../constants/common'
import { usedInClient } from './env'

/**
 * Get image URL
 * @param tableId
 * @param _srcId
 * @param imgType
 */
export const getImageUrl = (tableId, srcId, wsid) => {
  let url = window.location.protocol + '//news.windin.com/ns/imagebase/' + tableId + '/' + srcId

  if (!tableId) {
    url = srcId
  }
  if (srcId?.indexOf('http') > -1) {
    // 兼容后端给的是完整互联网地址
    url = srcId
    url = url.replace(/https|http/, window.location.protocol.split(':')[0])
  }

  if (!usedInClient()) {
    url = url + '?wind.sessionid=' + wsid
  }

  return url
}

/**
 * Get default image based on image type
 * @param imgType
 */
export const getDefaultImage = (imgType?) => {
  let defaultImg = COMMON_CONSTANTS.NO_PHOTO_PATH

  if (imgType == 'corp') {
    defaultImg = COMMON_CONSTANTS.DEFAULT_COMPANY
  } else if (imgType == 'brand') {
    defaultImg = COMMON_CONSTANTS.DEFAULT_BRAND
  }

  return defaultImg
}
