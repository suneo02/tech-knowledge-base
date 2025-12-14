import React, { useEffect, useState } from 'react'
import { parseQueryString } from '../../lib/utils'
import { t } from 'gel-util/intl'
import { wftCommon } from '../../utils/utils'
import { setPageTitle } from '../../handle/siteTitle'
import { LINK_ENUM, LINK_ENUM_TITLE, INNER_LINK_ENUM, INNER_LINK_ENUM_TITLE } from './constant'
import { usedInClient } from 'gel-util/env'
import { getWebAIChatLink, getWebAISuperListLink, getWebAISuperLink } from '@/handle/link/WebAI'
import { getUrlSearchValue } from 'gel-util/common'
import { CHAT_PARAM_KEYS } from 'gel-util/link'
import styles from './index.module.less'

/**
 * @description 友情链接路由
 * @author bcheng<bcheng@wind.com.cn>
 */
function RelatedLinks() {
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
    const url = `//wx.wind.com.cn/IndicatorWebs/index.html?lan=${window.en_access_config ? 'en' : 'zh'}`
    if (is_terminal) {
      setUrl(url)
    } else {
      setUrl(`${url}&tks=${wsid2}&wind.sessionid=${wsid}`)
    }
  }

  // 园区
  const renderParks = () => {
    document.title = LINK_ENUM_TITLE[LINK_ENUM.PARK]
    if (is_terminal) {
      setUrl(
        `//${govSiteHost}/govweb/?pageId=IAGHSSUK&right=4D5G8R6H2&sss=1229&notoolbar=1&lan=${window.en_access_config ? 'en' : ''}#/GeneralPage`
      )
    } else {
      setUrl(
        `//wx.wind.com.cn/govweb/?pageId=IAGHSSUK&right=4D5G8R6H2&sss=0117&notoolbar=1&lan=${window.en_access_config ? 'en' : ''}&tks=${wsid2}#/GeneralPage`
      )
    }
  }

  // 新企
  const renderNewCorps = () => {
    document.title = LINK_ENUM_TITLE[LINK_ENUM.NEW_CORP]
    if (is_terminal) {
      setUrl(
        `//${govSiteHost}/govweb/?pageId=KPWHENFA&right=4D5G8R6H2&gogel=dgov&sss=0217&notoolbar=1&from=GEL&lan=${window.en_access_config ? 'en' : ''}#/GeneralPage`
      )
    } else {
      setUrl(
        `//wx.wind.com.cn/govweb/?pageId=KPWHENFA&right=4D5G8R6H2&gogel=dgov&sss=0217&notoolbar=1&from=GEL&lan=${window.en_access_config ? 'en' : ''}&tks=${wsid2}#/GeneralPage`
      )
    }
  }

  // 产业链
  const renderChain = () => {
    document.title = LINK_ENUM_TITLE[LINK_ENUM.CHAIN]
    if (is_terminal) {
      setUrl(
        `${window.location.protocol}//pdbwebserver/pdb.web/index.html?hideHeader=true&lan=${window.en_access_config ? 'en' : ''}`
      )
    } else {
      setUrl('404')
    }
  }

  // 供应链
  const renderSupply = () => {
    document.title = LINK_ENUM_TITLE[LINK_ENUM.SUPPLY]
    if (is_terminal) {
      setUrl(
        `${window.location.protocol}//windkgserver/windkg/index.html#/supplier?notoolbar=1&lan=${window.en_access_config ? 'en' : ''}`
      )
    } else {
      setUrl('404')
    }
  }

  // 智能财报诊断
  const renderAiFinancial = (type: 'report-analysis/process' | 'report-analysis') => {
    document.title = LINK_ENUM_TITLE[LINK_ENUM.AI_FINANCIAL]
    setUrl(`//wx.wind.com.cn/govbusiness/#/${type}?noheader=1&from=GEL`)
  }

  // 集团系成员关系图谱
  const renderGroupChart = () => {
    document.title = LINK_ENUM_TITLE[LINK_ENUM.GROUP_CHART]
    const groupId = qs['groupId'] || null
    const groupName = qs['groupName'] || null
    if (usedInClient()) {
      setUrl(
        `//wx.wind.com.cn/Wind.WFC.Enterprise.Web/PC.Front/Company/GroupChart.html?groupId=${groupId}&groupName=${groupName}&notoolbar=1#chart_newgqct`
      )
    } else {
      setUrl(
        `//gel.wind.com.cn/Web/Company/GroupChart.html?groupId=${groupId}&groupName=${groupName}&notoolbar=1#chart_newgqct`
      )
    }
  }

  // ============ 以下为从InnerLinks合并的功能 ============
  // AI对话
  const renderAiChat = () => {
    document.title = INNER_LINK_ENUM_TITLE[INNER_LINK_ENUM.AI_CHAT]
    const initialMsg = getUrlSearchValue(CHAT_PARAM_KEYS.INITIAL_MSG)
    const initialDeepthink = getUrlSearchValue(CHAT_PARAM_KEYS.INITIAL_DEEPTHINK)

    const url = getWebAIChatLink({ initialMsg, initialDeepthink })

    if (is_terminal) {
      setUrl(url)
    } else {
      setUrl(url)
    }
  }

  // 超级名单Alice
  const renderSuper = () => {
    document.title = INNER_LINK_ENUM_TITLE[INNER_LINK_ENUM.SUPER]

    // 统一 super 路由，支持可选 path 参数，例如 super/download, super/chat
    const path = getUrlSearchValue('path')
    const chatId = getUrlSearchValue('id')
    const type = getUrlSearchValue('type')
    const initialMsg = getUrlSearchValue(CHAT_PARAM_KEYS.INITIAL_MSG)
    const initialDeepthink = getUrlSearchValue(CHAT_PARAM_KEYS.INITIAL_DEEPTHINK)

    const url = path
      ? getWebAISuperLink({ subPath: path, chatId, type, initialMsg, initialDeepthink })
      : getWebAISuperListLink()

    if (is_terminal) {
      setUrl(url)
    } else {
      setUrl(url)
    }
  }

  // 超级名单Alice-聊天
  const renderSuperChat = () => {
    document.title = INNER_LINK_ENUM_TITLE[INNER_LINK_ENUM.SUPER_CHAT]
    const chatId = getUrlSearchValue('id')
    const type = getUrlSearchValue('type')
    const initialMsg = getUrlSearchValue(CHAT_PARAM_KEYS.INITIAL_MSG)
    const url = getWebAISuperLink({ chatId, type, subPath: 'super/chat', initialMsg })
    console.log('🚀 ~ renderSuperChat ~ url:', url)
    if (is_terminal) {
      setUrl(url)
    } else {
      setUrl(url)
    }
  }

  // 超级名单Alice-积分
  const renderCredits = () => {
    document.title = INNER_LINK_ENUM_TITLE[INNER_LINK_ENUM.CREDITS]
    const url = getWebAISuperLink({ subPath: 'credits' })
    console.log('🚀 ~ renderCredits ~ url:', url)

    if (is_terminal) {
      setUrl(url)
    } else {
      setUrl(url)
    }
  }

  useEffect(() => {
    if (url && url.length) return

    if (is_terminal) {
      try {
        if (window.external && window.external.ClientFunc) {
          const govSite = window.external.ClientFunc(
            JSON.stringify({
              func: 'serverInfo',
              isGlobal: '1',
              name: 'GOVWebSite',
            })
          ) as string
          govSiteHost = JSON.parse(govSite).serverInfoAddress
        }
      } catch (error) {
        console.error(error)
      }
    }

    switch (target) {
      case LINK_ENUM.AI_FINANCIAL:
        renderAiFinancial('report-analysis')
        break
      case LINK_ENUM.AI_FINANCIAL_PROCESS:
        renderAiFinancial('report-analysis/process')
        break
      case LINK_ENUM.PARK:
        renderParks()
        break
      case LINK_ENUM.CHAIN:
        renderChain()
        break
      case LINK_ENUM.SUPPLY:
        renderSupply()
        break
      case LINK_ENUM.BATCH_OUTPUT:
        renderBatchOutput()
        break
      case LINK_ENUM.NEW_CORP:
        renderNewCorps()
        break
      case LINK_ENUM.GROUP_CHART:
        renderGroupChart()
        break

      // 以下是从InnerLinks合并的功能
      case INNER_LINK_ENUM.AI_CHAT:
        renderAiChat()
        break
      case INNER_LINK_ENUM.SUPER:
        renderSuper()
        break
      case INNER_LINK_ENUM.CREDITS:
        renderCredits()
        break
      case INNER_LINK_ENUM.SUPER_CHAT:
        renderSuperChat()
        break

      default:
        setUrl('404')
        break
    }
  }, [target])

  return (
    <div className={styles['inner-link-container']} style={{ width: '100%', height: '100%' }}>
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
          {t('17235', '暂无数据')}
        </div>
      ) : null}
    </div>
  )
}

export default RelatedLinks
