import { getWsid, usedInClient } from '@/utils/env/index.ts'
import { SearchHomeItemData } from '@/views/HomeAI/comp/RecommendFunc/config/type.ts'
import { message } from '@wind/wind-ui'
import { CHART_HASH } from '../../company/intro/charts'

const is_terminal = usedInClient()
const wsidStr = getWsid()

export const handleSearchHomeNavigation = (k: SearchHomeItemData['key'], url?: SearchHomeItemData['url']) => {
  if (url) {
    window.open(url)
    return
  }

  const className = `icon-topic-${k}`
  switch (className) {
    case 'icon-topic-newcorps':
      window.open('NewCorps.html?')
      break
    case 'icon-topic-safari':
      window.open('AdvancedSearch04.html?')
      break
    case 'icon-topic-bid':
      window.open('index.html#/searchPlatform/SearchFetured?nosearch=1')
      break
    case 'icon-topic-searchmap':
      if (!is_terminal) {
        window.open(
          'http://dgov.wind.com.cn/govmap/index.html?mode=2&pureMode&title=万寻地图&right=4C203DE15&wind.sessionid=' +
            wsidStr
        )
      } else {
        window.open('https://GOVWebSite/govmap/index.html?mode=2&pureMode&title=万寻地图&right=4C203DE15#/')
      }
      break
    case 'icon-topic-super':
      //换成股权穿透图
      window.open(`index.html?isSeparate=1&nosearch=1&activeKey=chart_gqct#/${CHART_HASH}`)
      break
    case 'icon-topic-detach':
      window.open(`index.html?isSeparate=1&nosearch=1&activeKey=chart_ddycd#/${CHART_HASH}`)
      break
    case 'icon-topic-netcomper':
      window.open('//RIME/rime/frontend/web/vertical/all')
      break
    case 'icon-topic-chain':
      if (is_terminal) {
        window.open(window.location.protocol + '//pdbwebserver/pdb.web/index.html')
      }
      break
    case 'icon-topic-relation':
      window.open(`index.html?isSeparate=1&nosearch=1&activeKey=chart_cgx#/${CHART_HASH}`)
      break
    case 'icon-topic-ipos':
      window.open('ChartIpo.html?')
      break
    case 'icon-topic-batch-search':
      //改为疑似关系图
      window.open(`index.html?isSeparate=1&nosearch=1&activeKey=chart_ysgx#/${CHART_HASH}`)
      break
    case 'icon-topic-batch-output':
      window.open('BatchOutput02.html')
      break
    case 'icon-topic-chartplathome':
      window.open(`index.html?isSeparate=1&nosearch=1#/${CHART_HASH}`)
      break
    case 'icon-topic-policy':
      window.open('//riskwebserver/wind.risk.platform/index.html#/check/special/newlaws')
      break
    case 'icon-topic-api':
      if (!is_terminal) {
        message.warning('该功能需登录Wind金融终端。')
      } else {
        window.open('//gelserver/wind.ent.openapi/index.html')
      }
      break
    case 'icon-topic-bidding-query':
      window.open('SearchBid.html')
      break
    case 'icon-topic-key-parks':
      window.open('Parks.html')
      break
    case 'icon-topic-oversea-com':
      window.open('index.html#/searchPlatform/GlobalSearch?nosearch=1')
      break
    case 'icon-topic-diligence-platf':
      window.open(window.location.origin + '/Wind.WFC.Enterprise.Web/PC.Front/DDreport/platform.html')
      break
    case 'icon-topic-group-search':
      window.open('index.html#/searchPlatform/SearchGroupDepartment?nosearch=1')
      break
    case 'icon-topic-gjzdxm':
      if (window.external && window.external.ClientFunc) {
        window.open('http://GOVWebSite/govbusiness/#/dashboard/projects')
      } else {
        window.open('https://dgov.wind.com.cn/govbusiness/?wind.sessionid=' + wsidStr + '/#/dashboard/projects')
      }
      break
    case 'icon-topic-thck':
      if (window.external && window.external.ClientFunc) {
        window.open('https://GOVWebSite/govbusiness/#/dashboard/key-customer')
      } else {
        window.open('http://dgov.wind.com.cn/govbusiness/?wind.sessionid=' + wsidStr + '/#/dashboard/key-customer')
      }
      break
    case 'icon-topic-wdtk':
      if (window.external && window.external.ClientFunc) {
        window.open('https://GOVWebSite/govbusiness/#/dashboard/map')
      } else {
        window.open('http://dgov.wind.com.cn/govbusiness/?wind.sessionid=' + wsidStr + '/#/dashboard/map')
      }
      break
    case 'icon-topic-sxwj':
      if (window.external && window.external.ClientFunc) {
        window.open('https://GOVWebSite/govbusiness/#/dashboard/creditdig')
      } else {
        window.open('http://dgov.wind.com.cn/govbusiness/?wind.sessionid=' + wsidStr + '/#/dashboard/creditdig')
      }
      break
    case 'icon-topic-sxsj':
      if (window.external && window.external.ClientFunc) {
        window.open('https://GOVWebSite/govbusiness/#/dashboard/business0?menu=0')
      } else {
        window.open('http://dgov.wind.com.cn/govbusiness/?wind.sessionid=' + wsidStr + '/#/dashboard/business0?menu=0')
      }
      break
    case 'icon-topic-cksj':
      if (window.external && window.external.ClientFunc) {
        window.open('https://GOVWebSite/govbusiness/#/dashboard/business3?menu=3')
      } else {
        window.open('http://dgov.wind.com.cn/govbusiness/?wind.sessionid=' + wsidStr + '/#/dashboard/business3?menu=3')
      }
      break
    case 'icon-topic-zxcy':
      if (window.external && window.external.ClientFunc) {
        window.open('https://GOVWebSite/govbusiness/#/dashboard/strategy')
      } else {
        window.open('http://dgov.wind.com.cn/govbusiness/?wind.sessionid=' + wsidStr + '/#/dashboard/strategy')
      }
      break
    default:
      window.open('SearchBid.html')
      break
  }
}
