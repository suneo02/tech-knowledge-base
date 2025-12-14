import {
  BaiFenSites,
  GELSearchParam,
  getUrlByLinkModule,
  LinksModule,
  ScenarioApplicationLinkEnum,
  SearchLinkEnum,
} from '@/handle/link'
import { getWebAIChatLinkWithIframe } from '@/handle/link/WebAI'
import { getWsid, isDev } from '@/utils/env'

import { CHART_HASH } from '@/components/company/intro/charts'
import { usedInClient } from 'gel-util/env'
import { t } from 'gel-util/intl'
import { generateUrlByModule, LinkModule } from 'gel-util/link'
import { HomeFuncItemKey, SearchHomeItemData } from './type'

const isTerminal = usedInClient()
const wsidStr = getWsid()

// Common configuration items that can be shared between domestic and oversea
export const getSharedItems = (extendData: {
  corpCount?: number // 新企发现
  featuredCount?: number // 榜单名录
}): Partial<Record<HomeFuncItemKey, Omit<SearchHomeItemData, 'key'>>> => ({
  alice: {
    title: t('', 'Alice'),
    desc: t('436174', '您的商业查询智能助手'),
    fIcon: 'QYK_Alice',
    url: getWebAIChatLinkWithIframe(),
  },
  yjhzqy: {
    title: t('464234', '一句话找企业'),
    desc: t('466774', '摆脱筛选，目标企业秒显'),
    fIcon: 'YJHZQY',
    url: generateUrlByModule({
      module: LinkModule.SUPER,
      isDev,
    }),
  },
  newcorps: {
    title: t('235783', '新企发现'),
    desc: t('422030', '近日新增注册企业%家').replace(
      '%',
      extendData.corpCount && extendData.corpCount > 0 ? extendData.corpCount.toString() : '%'
    ),
    fIcon: 'XQFX_line',
    url: getUrlByLinkModule(LinksModule.SCENARIO_APPLICATION, {
      subModule: ScenarioApplicationLinkEnum.NEW_CORP,
    }),
    hot: true,
  },
  chartplathome: {
    title: t('365067', '企业图谱平台'),
    desc: t('367613', '洞察企业股权、关联关系'),
    fIcon: 'QYTPPT_L',
    url: `index.html?isSeparate=1&nosearch=1#/${CHART_HASH}`,
  },
  bid: {
    title: t('252965', '榜单名录'),
    desc:
      extendData.featuredCount && extendData.featuredCount > 0
        ? extendData.featuredCount + t('338369', '个榜单和科技类企业名录')
        : t('338369', '榜单和科技类企业名录'),
    fIcon: 'BDML_L',
    url: 'index.html#/searchPlatform/SearchFetured?nosearch=1',
  },
  'bidding-query': {
    title: t('228333', '招投标查询'),
    desc: t('338393', '商机尽在掌握'),
    fIcon: 'CZTB_L',
    url: getUrlByLinkModule(LinksModule.SEARCH, {
      subModule: SearchLinkEnum.BidNew,
      params: {
        [GELSearchParam.NoSearch]: 1,
      },
    }),
    hot: true,
  },
  super: {
    title: t('138279', '股权穿透图'),
    desc: t('422062', '一键穿透、应穿尽穿'),
    fIcon: 'GQCTT_L',
    url: `index.html?isSeparate=1&nosearch=1&activeKey=chart_gqct#/${CHART_HASH}`,
  },
  detach: {
    title: t('247485', '多对一触达'),
    desc: t('422020', '精准查找最短触达路径'),
    fIcon: 'DDYCD_L',
    url: `index.html?isSeparate=1&nosearch=1&activeKey=chart_ddycd#/${CHART_HASH}`,
  },
  relation: {
    title: t('422046', '查关系'),
    desc: t('338364', '多视角透查企业关系'),
    fIcon: 'CGX_L',
    url: `index.html?isSeparate=1&nosearch=1&activeKey=chart_cgx#/${CHART_HASH}`,
  },
  trademark: {
    title: t('203988', '查商标'),
    desc: t('438454', '100W+商标数据'),
    fIcon: 'CQQQY_L',
    url: 'index.html#/searchPlatform/SearchBrand?nosearch=1',
  },
  patent: {
    title: t('203989', '查专利'),
    desc: t('438455', '100W+专利数据'),
    fIcon: 'CQQQY_L',
    url: 'index.html#/searchPlatform/SearchPatent?nosearch=1',
  },
  recruit: {
    title: t('379753', '查招聘'),
    desc: t('438474', '100W+招聘数据'),
    fIcon: 'CQQQY_L',
    url: 'index.html#/searchJob?nosearch=1',
  },
  'oversea-com': {
    title: t('437235', '查全球企业'),
    desc: t('338366', '涵盖全球100+国家企业数据'),
    fIcon: 'CQQQY_L',
    url: 'index.html#/searchPlatform/GlobalSearch?nosearch=1',
  },
  'group-search': {
    title: t('247482', '查集团'),
    desc: t('338372', '企业集团布局一目了然'),
    fIcon: 'CJTX_L',
    url: 'index.html#/searchPlatform/SearchGroupDepartment?nosearch=1',
  },
  safari: {
    title: t('259750', '企业数据浏览器'),
    desc: t('338371', '200+维度精准识别目标企业'),
    fIcon: 'QYSJLLQ_line',
    url: getUrlByLinkModule(LinksModule.DATA_BROWSER),
  },
  searchmap: {
    title: t('223901', '万寻地图'),
    desc: t('456565', '周边企业一搜即得'),
    fIcon: 'WXDT_L',
    url: isTerminal
      ? 'https://GOVWebSite/govmap/index.html?mode=2&pureMode&title=万寻地图&right=4C203DE15#/'
      : 'http://dgov.wind.com.cn/govmap/index.html?mode=2&pureMode&title=万寻地图&right=4C203DE15&wind.sessionid=' +
        wsidStr,
  },
  'batch-output': {
    title: t('208389', '批量查询导出'),
    desc: t('338365', '工作效能提升好助手'),
    fIcon: 'PLCXDC_L',
    url: getUrlByLinkModule(LinksModule.SCENARIO_APPLICATION, {
      subModule: ScenarioApplicationLinkEnum.BATCH_OUTPUT,
    }),
  },
  gjzdxm: {
    title: t('422041', '地区重点项目'),
    desc: t('436154', '10万+国家重点项目和参与企业'),
    fIcon: 'DQZDXM',
    url: BaiFenSites().regionalKey,
    //     new: true,
  },
  thck: {
    title: t('391096', '他行存客'),
    desc: t('422019', '4000+商业银行的海量企业客户'),
    fIcon: 'THCK',
    url: BaiFenSites().otherBankCustomers,
  },
  wdtk: {
    title: t('422021', '网点拓客'),
    desc: t('422048', '发现银行网点周边商机'),
    fIcon: 'WDTK',
    url: BaiFenSites().branchCustomers,
  },
  sxwj: {
    title: t('391133', '授信挖掘'),
    desc: t('422024', '多维度查找融资到期企业'),
    fIcon: 'SXWJ',
    url: BaiFenSites().creditMining,
  },
  'key-parks': {
    title: t('294403', '重点园区'),
    desc: t('338394', '全国6万+重点园区查找优质企业'),
    fIcon: 'ZDYQ_L',
    url: getUrlByLinkModule(LinksModule.SCENARIO_APPLICATION, {
      subModule: ScenarioApplicationLinkEnum.PARK,
    }),
  },
  // 根据条件添加 sxsj 项
  ...(isTerminal
    ? {
        sxsj: {
          title: t('391093', '授信商机'),
          desc: t('422058', '大数据模型推荐潜在融资需求企业'),
          fIcon: 'SXSJ',
          url: BaiFenSites().creditOpportunities,
        },
      }
    : {}),
  cksj: {
    title: t('422059', '存款商机'),
    desc: t('422060', '大数据模型推荐潜在存款需求企业'),
    fIcon: 'CKSJ',
    url: BaiFenSites().depositOpportunities,
  },
  zxcy: {
    title: t('391099', '战新产业'),
    desc: t('437324', '100W+战略性新兴产业'),
    fIcon: 'ZLXXXCY_L',
    url: BaiFenSites().strategicIndustries,
  },
  'invest-track': {
    title: t('223898', '投资赛道'),
    desc: t('', '100W+投资赛道企业'),
    fIcon: 'TZCX_L',
    url: '//RIME/rime/frontend/web/vertical/all',
  },
})

// Helper function to get a dynamic item with updated counts
export const createItem = (
  key: HomeFuncItemKey,
  extendData?: {
    corpCount?: number
    featuredCount?: number
  },
  overrides: Partial<Omit<SearchHomeItemData, 'key'>> = {}
): SearchHomeItemData | null => {
  const dynamicItems = getSharedItems({
    corpCount: extendData?.corpCount || 0,
    featuredCount: extendData?.featuredCount || 0,
  })

  const baseItem = dynamicItems[key]
  if (!baseItem) {
    // 对于不存在的项，返回 null 而不是抛出错误
    return null
  }

  return {
    key,
    ...baseItem,
    ...overrides,
  }
}
