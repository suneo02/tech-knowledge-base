import no_photo_list from '../../../assets/img/no_photo_list.png'
import defaultCompanyImg from '../../../assets/img/default_company.png'
import brand120 from '../../../assets/img/brand120.png'
import { usedInClient, getWsidProd } from 'gel-util/env'
import { Tooltip } from '@wind/wind-ui'

export const imageBase = (tableId, srcId, css?, isEnlarge?, defaultWidth?, imgType?) => {
  let url = window.location.protocol + '//news.windin.com/ns/imagebase/' + tableId + '/' + srcId
  let defaultImg = no_photo_list
  if (!tableId) {
    url = srcId
  }
  if (srcId?.indexOf('http') > -1) {
    // 兼容后端给的是完整互联网地址
    url = srcId
    url = url.replace(/https|http/, window.location.protocol.split(':')[0])
  }
  if (imgType == 'corp') {
    defaultImg = defaultCompanyImg
  } else if (imgType == 'brand') {
    defaultImg = brand120
  }
  if (!usedInClient()) {
    url = url + '?wind.sessionid=' + getWsidProd()
  }
  return isEnlarge ? (
    <Tooltip
      key={srcId}
      title={
        <img
          width="140"
          src={url}
          onError={(e) => {
            // @ts-expect-error ttt
            e.target.src = defaultImg
          }}
        />
      }
    >
      <img
        src={url}
        width={defaultWidth ? defaultWidth : 'auto'}
        className={` ${css ? css : 'company-table-logo'}`}
        onError={(e) => {
          // @ts-expect-error ttt
          e.target.src = defaultImg
        }}
      />
    </Tooltip>
  ) : (
    <img
      src={url}
      width={defaultWidth ? defaultWidth : 'auto'}
      className={` ${css ? css : 'company-table-logo'}`}
      onError={(e) => {
        // @ts-expect-error ttt
        e.target.src = defaultImg
      }}
    />
  )
}

/**
 * 判断字符串是否为中文名称，含繁体
 * /[\u4e00-\u9fff]/.test('汉') true
 * /[\u4e00-\u9fff]/.test('。') false
 * /[\u4e00-\u9fff]/.test('a') false
 * /[\u4e00-\u9fff]/.test('주식') false
 * /[\u4e00-\u9fff]/.test('華') true
 */
export const isChineseName = (name: string) => {
  return /[\u4e00-\u9fff]/.test(name)
}
