import { getWsid } from '@/utils/env'
import { wftCommon } from '@/utils/utils.tsx'
import React from 'react'

/**
 * 地址render
 * @param {*} txt1
 * @param {*} baseInfo
 * @param {*} fromBGDZ
 */
export const AddrComp = (txt1, baseInfo: any, fromBGDZ?) => {
  // fromBGDZ  办公地址
  const txt = txt1 || '--'
  const code = baseInfo.corp ? baseInfo.corp.corp_id : ''

  if (wftCommon.is_overseas_config) {
    return txt
  }

  return code && txt1 ? (
    <a
      onClick={() => {
        if (wftCommon.usedInClient()) {
          wftCommon.jumpJqueryPage(
            'https://GOVWebSite/govmap/index.html?mode=2&pureMode&title=万寻地图&right=4C203DE15&companyId=' +
              code +
              (fromBGDZ ? '&addressType=businessAddress&1=1' : '') +
              '#/'
          )
        } else {
          const wsidStr = getWsid()
          wftCommon.jumpJqueryPage(
            'http://dgov.wind.com.cn/govmap/index.html?mode=2&pureMode&title=万寻地图 &right=4C203DE15&companyId=' +
              code +
              (fromBGDZ ? '&addressType=businessAddress&1=1' : '') +
              '&wind.sessionid=' +
              wsidStr
          )
        }
      }}
    >
      {txt}
    </a>
  ) : (
    txt
  )
}
