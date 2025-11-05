import React, { useEffect, useState } from 'react'
import { parseQueryString } from '../lib/utils'
import intl from '../utils/intl'
import { wftCommon } from '../utils/utils'
import { setPageTitle } from '../handle/siteTitle'

function RelatedLinks(props) {
  const [url, setUrl] = useState('')
  const is_terminal = wftCommon.usedInClient()
  const qs = parseQueryString()
  const target = qs['target'] || null
  let govSiteHost = 'GOVWebSite'
  const wsid = wftCommon.getwsd() || ''
  const wsid2 = Math.floor(Math.random() * 100000000) + wsid + Math.floor(Math.random() * 100000000)

  // BatchOutput 批量查询导出
  const renderBatchOutput = () => {
    setPageTitle('BulkQueryExport')
    if (is_terminal) {
      const src = '//wx.wind.com.cn/IndicatorWebs/index.html?lan=' + (window.en_access_config ? 'en' : 'zh')
      setUrl(src)
    } else {
      const src =
        '//wx.wind.com.cn/IndicatorWebs/index.html?lan=' +
        (window.en_access_config ? 'en' : 'zh') +
        '&tks=' +
        wsid2 +
        '&wind.sessionid=' +
        wsid
      setUrl(src)
    }
  }

  // 园区
  const renderParks = () => {
    document.title = intl('294403', '重点园区')
    if (is_terminal) {
      const src =
        '//' +
        govSiteHost +
        '/govweb/?pageId=IAGHSSUK&right=4D5G8R6H2&sss=1229&notoolbar=1&lan=' +
        (window.en_access_config ? 'en' : '') +
        '#/GeneralPage'
      setUrl(src)
    } else {
      const src =
        '//wx.wind.com.cn/govweb/?pageId=IAGHSSUK&right=4D5G8R6H2&sss=0117&notoolbar=1&lan=' +
        (window.en_access_config ? 'en' : '') +
        '&tks=' +
        wsid2 +
        '#/GeneralPage'
      setUrl(src)
    }
  }

  // 新企
  const renderNewCorps = () => {
    document.title = intl('235783', '新企发现')
    if (is_terminal) {
      const src =
        '//' +
        govSiteHost +
        '/govweb/?pageId=KPWHENFA&right=4D5G8R6H2&gogel=dgov&sss=0217&notoolbar=1&from=GEL&lan=' +
        (window.en_access_config ? 'en' : '') +
        '#/GeneralPage'
      setUrl(src)
    } else {
      const src =
        '//wx.wind.com.cn/govweb/?pageId=KPWHENFA&right=4D5G8R6H2&gogel=dgov&sss=0217&notoolbar=1&from=GEL&lan=' +
        (window.en_access_config ? 'en' : '') +
        '&tks=' +
        wsid2 +
        '#/GeneralPage'
      setUrl(src)
    }
  }

  // 产业链
  const renderChain = () => {
    document.title = intl('298427', '产业链')
    if (is_terminal) {
      const src =
        window.location.protocol +
        '//pdbwebserver/pdb.web/index.html?hideHeader=true&lan=' +
        (window.en_access_config ? 'en' : '')
      setUrl(src)
    } else {
      setUrl('404')
    }
  }

  // 供应链
  const renderSupply = () => {
    document.title = intl('314444', '供应链探索')
    if (is_terminal) {
      const src =
        window.location.protocol +
        '//windkgserver/windkg/index.html#/supplier?notoolbar=1&lan=' +
        (window.en_access_config ? 'en' : '')
      setUrl(src)
    } else {
      setUrl('404')
    }
  }

  useEffect(() => {
    if (url && url.length) return

    if (is_terminal) {
      if (window.external && window.external.ClientFunc) {
        var govSite = window.external.ClientFunc(
          JSON.stringify({
            func: 'serverInfo',
            isGlobal: '1',
            name: 'GOVWebSite',
          })
        )
        govSiteHost = JSON.parse(govSite).serverInfoAddress
      }
    }

    switch (target) {
      case 'park':
        renderParks()
        break
      case 'chain':
        renderChain()
        break
      case 'supply':
        renderSupply()
        break
      case 'batchoutput':
        renderBatchOutput()
        break
      case 'newcorp':
      default:
        renderNewCorps()
    }
  }, [target])

  return (
    <div className="" style={{ width: '100%', height: '100%' }}>
      {url && url !== '404' ? <iframe width="100%" height="100%" src={url} frameBorder="0"></iframe> : null}
      {url === '404' ? (
        <div
          style={{
            height: '80px',
            lineHeight: '80px',
            textAlign: 'center',
            margin: '12px',
            background: '#fff',
          }}
        >
          {intl('17235', '暂无数据')}
        </div>
      ) : null}
    </div>
  )
}

export default RelatedLinks
