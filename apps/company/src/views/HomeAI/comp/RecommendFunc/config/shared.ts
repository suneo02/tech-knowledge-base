import { BaiFenSites } from '@/handle/link'
import { getWebAIChatLink } from '@/handle/link/WebAI'
import { getWsid } from '@/utils/env'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import { HomeFuncItemKey, SearchHomeItemData } from './type'
import { CHART_HASH } from '@/components/company/intro/charts'

const is_terminal = wftCommon.usedInClient()
const wsidStr = getWsid()

// Common configuration items that can be shared between domestic and oversea
export const getSharedItems = (extendData: {
  corpCount?: number // 新企发现
  featuredCount?: number // 榜单名录
}): Record<HomeFuncItemKey, Omit<SearchHomeItemData, 'key'>> => ({
  alice: {
    title: intl(0, 'Alice'),
    desc: intl('436174', '您的商业查询智能助手'),
    fIcon: 'QYK_Alice',
    url: getWebAIChatLink(),
  },
  newcorps: {
    title: intl('235783', '新企发现'),
    desc: intl('422030', '近日新增注册企业%家').replace(
      '%',
      extendData.corpCount && extendData.corpCount > 0 ? extendData.corpCount.toString() : '%'
    ),
    fIcon: 'XQFX_line',
    url: 'NewCorps.html?',
    hot: true,
  },
  chartplathome: {
    title: intl('365067', '企业图谱平台'),
    desc: intl('367613', '洞察企业股权、关联关系'),
    fIcon: 'QYTPPT_L',
    url: `index.html?isSeparate=1&nosearch=1#/${CHART_HASH}`,
  },
  bid: {
    title: intl('252965', '榜单名录'),
    desc:
      extendData.featuredCount && extendData.featuredCount > 0
        ? extendData.featuredCount + (window.en_access_config ? ' ' : '个') + intl('338369', '榜单和科技类企业名录')
        : intl('338369', '榜单和科技类企业名录'),
    fIcon: 'BDML_L',
    url: 'index.html#/searchPlatform/SearchFetured?nosearch=1',
  },
  'bidding-query': {
    title: intl('228333', '招投标查询'),
    desc: intl('338393', '商机尽在掌握'),
    fIcon: 'CZTB_L',
    url: 'SearchBid.html',
    hot: true,
  },
  super: {
    title: intl('138279', '股权穿透图'),
    desc: intl('422062', '一键穿透、应穿尽穿'),
    fIcon: 'GQCTT_L',
    url: `index.html?isSeparate=1&nosearch=1&activeKey=chart_gqct#/${CHART_HASH}`,
  },
  detach: {
    title: intl('247485', '多对一触达'),
    desc: intl('422020', '精准查找最短触达路径'),
    fIcon: 'DDYCD_L',
    url: `index.html?isSeparate=1&nosearch=1&activeKey=chart_ddycd#/${CHART_HASH}`,
  },
  relation: {
    title: intl('422046', '查关系'),
    desc: intl('338364', '多视角透查企业关系'),
    fIcon: 'CGX_L',
    url: `index.html?isSeparate=1&nosearch=1&activeKey=chart_cgx#/${CHART_HASH}`,
  },
  trademark: {
    title: intl('203988', '查商标'),
    desc: intl('438454', '100W+商标数据'),
    fIcon: 'CQQQY_L',
    url: 'index.html#/searchPlatform/SearchBrand?nosearch=1',
  },
  patent: {
    title: intl('203989', '查专利'),
    desc: intl('438455', '100W+专利数据'),
    fIcon: 'CQQQY_L',
    url: 'index.html#/searchPlatform/SearchPatent?nosearch=1',
  },
  recruit: {
    title: intl('379753', '查招聘'),
    desc: intl('438474', '100W+招聘数据'),
    fIcon: 'CQQQY_L',
    url: 'index.html#/searchJob?nosearch=1',
  },
  'oversea-com': {
    title: intl('223896', '查海外企业'),
    desc: intl('338366', '涵盖全球100+国家企业数据'),
    fIcon: 'CQQQY_L',
    url: 'index.html#/searchPlatform/GlobalSearch?nosearch=1',
  },
  'diligence-platf': {
    title: intl('331913', '尽调平台'),
    desc: intl('338368', '一站式完成企业尽职调查'),
    fIcon: 'JDPT_L',
    url: window.location.origin + '/Wind.WFC.Enterprise.Web/PC.Front/DDreport/platform.html',
  },
  'group-search': {
    title: intl('247482', '查集团'),
    desc: intl('338372', '企业集团布局一目了然'),
    fIcon: 'CJTX_L',
    url: 'index.html#/searchPlatform/SearchGroupDepartment?nosearch=1',
  },
  safari: {
    title: intl('259750', '企业数据浏览器'),
    desc: intl('338371', '200+维度精准识别目标企业'),
    fIcon: 'QYSJLLQ_line',
    url: 'AdvancedSearch04.html?',
  },
  searchmap: {
    title: intl('223901', '万寻地图'),
    desc: intl('260982'),
    fIcon: 'WXDT_L',
    url: is_terminal
      ? 'https://GOVWebSite/govmap/index.html?mode=2&pureMode&title=万寻地图&right=4C203DE15#/'
      : 'http://dgov.wind.com.cn/govmap/index.html?mode=2&pureMode&title=万寻地图&right=4C203DE15&wind.sessionid=' +
        wsidStr,
  },
  'batch-output': {
    title: intl('208389', '批量查询导出'),
    desc: intl('338365', '工作效能提升好助手'),
    fIcon: 'PLCXDC_L',
    url: 'BatchOutput02.html',
  },
  gjzdxm: {
    title: intl('422041', '地区重点项目'),
    desc: intl('436154', '10万+国家重点项目和参与企业'),
    fIcon: 'DQZDXM',
    url: BaiFenSites().regionalKey,
    new: true,
  },
  thck: {
    title: intl('391096', '他行存客'),
    desc: intl('422019', '4000+商业银行的海量企业客户'),
    fIcon: 'THCK',
    url: BaiFenSites().otherBankCustomers,
  },
  wdtk: {
    title: intl('422021', '网点拓客'),
    desc: intl('422048', '发现银行网点周边商机'),
    fIcon: 'WDTK',
    url: BaiFenSites().branchCustomers,
  },
  sxwj: {
    title: intl('391133', '授信挖掘'),
    desc: intl('422024', '多维度查找融资到期企业'),
    fIcon: 'SXWJ',
    url: BaiFenSites().creditMining,
  },
  'key-parks': {
    title: intl('294403', '重点园区'),
    desc: intl('338394', '全国6万+重点园区查找优质企业'),
    fIcon: 'ZDYQ_L',
    url: 'Parks.html',
  },
  sxsj: {
    title: intl('391093', '授信商机'),
    desc: intl('422058', '大数据模型推荐潜在融资需求企业'),
    fIcon: 'SXSJ',
    url: BaiFenSites().creditOpportunities,
  },
  cksj: {
    title: intl('422059', '存款商机'),
    desc: intl('422060', '大数据模型推荐潜在存款需求企业'),
    fIcon: 'CKSJ',
    url: BaiFenSites().depositOpportunities,
  },
  zxcy: {
    title: intl('391099', '战新产业'),
    desc: intl('437324', '100W+战略性新兴产业'),
    fIcon: 'ZLXXXCY_L',
    url: BaiFenSites().strategicIndustries,
  },
  'invest-track': {
    title: intl('223898', '投资赛道'),
    desc: intl('', '100W+投资赛道企业'),
    fIcon: 'TZCX_L',
    url: '//RIME/rime/frontend/web/vertical/all',
  },
})

// Export the shared items with default values for use in other files
export const homeFuncItemsDefault: Record<string, Omit<SearchHomeItemData, 'key'>> = getSharedItems({
  corpCount: 0,
  featuredCount: 0,
})

// Helper function to get a dynamic item with updated counts
export const createItem = (
  key: HomeFuncItemKey,
  extendData?: {
    corpCount?: number
    featuredCount?: number
  },
  overrides: Partial<Omit<SearchHomeItemData, 'key'>> = {}
): SearchHomeItemData => {
  const dynamicItems = getSharedItems({
    corpCount: extendData?.corpCount || 0,
    featuredCount: extendData?.featuredCount || 0,
  })

  const baseItem = dynamicItems[key]
  if (!baseItem) {
    throw new Error(`Item with key "${key}" not found in dynamic items`)
  }

  return {
    key,
    ...baseItem,
    ...overrides,
  }
}
