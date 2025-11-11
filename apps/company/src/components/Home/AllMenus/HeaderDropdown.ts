import { getUrlByLinkModule, LinksModule } from '@/handle/link'
import { getWebAIChatLinkWithIframe } from '@/handle/link/WebAI'
import { isDeveloper } from '@/utils/common.ts'
import { getEnvParams, IEnvParams, isDev, isStaging } from '@/utils/env'
import { wftCommon } from '@/utils/utils.tsx'
import { usedInClient } from 'gel-util/env'
import { generateUrlByModule, LinkModule, PC_Front, WFC_Enterprise_Web } from 'gel-util/link'
import {
  getSearchCompanyItem,
  getSearchGlobalCompanyItem,
  getSearchGroupItem,
  getSearchPersonItem,
  getSearchRelationItem,
  getSearchRiskItem,
} from './config/ComprehensiveSearch.ts'
import {
  getAiFinancialItem,
  getBatchQueryExportItem,
  // getCompanyAtlasPlatformItem,
  getCompanyDataApiItem,
  getCompanyDataBrowserItem,
  getCompanyDynamicsItem,
  getReportPlatformItem,
  getSuperItem,
} from './config/EasyTool.tsx'
import {
  getCompanyAtlasPlatformItem,
  getCompetitorAtlasItem,
  getEquityPenetrationItem,
  getFinancingAtlasItem,
  getFinancingHistoryItem,
  getMultiToOneReachItem,
  getRelatedPartyAtlasItem,
} from './config/KG.ts'
import {
  getCorporateMarketingWorkbenchItem,
  getKeyParksItem,
  getNewCompanyDiscoveryItem,
  getPrimaryMarketTrackItem,
  getStrategicIndustriesItem,
  getSupplyChainExplorationItem,
  getWanxunMapItem,
} from './config/ScenarioApplication.ts'
import {
  getBondIssuingCompanyItem,
  getCompanyListDirectoryItem,
  getCompanyQualificationItem,
  getFinancialInstitutionItem,
  getListedCompanyItem,
  getPEVCInvestedCompanyItem,
  getStateOwnedCompanyItem,
} from './config/SpecialCompany.ts'
import { getBiddingItem, getPatentItem, getRecruitmentItem, getTrademarkItem } from './config/SpecialData.ts'
import { IFuncMenuGroup, IFuncMenuItem } from './type'

// 便捷工具菜单组

export const EasyToolMenus = (envParams: IEnvParams): IFuncMenuGroup => ({
  id: '247483',
  zh: '便捷工具',
  list: [
    getBatchQueryExportItem(),
    getReportPlatformItem(),
    // getCompanyAtlasPlatformItem(),
    getCompanyDataBrowserItem(),
    getSuperItem(),
    getCompanyDataApiItem(envParams),
    getCompanyDynamicsItem(envParams),
    getAiFinancialItem(envParams),
    isDeveloper && {
      id: '',
      zh: 'Home AI',
      url: getUrlByLinkModule(LinksModule.HOMEAI),
    },
    isDeveloper && {
      id: '',
      zh: 'AI Chat',
      url: getWebAIChatLinkWithIframe(),
    },
    isStaging && {
      id: '',
      zh: '万得征信（开发站）',
      url: `/${WFC_Enterprise_Web}/${PC_Front}/windzx/index.html`,
      navigate: (item) => {
        window.open(item.url, '_blank')
      },
    },
    (isStaging || isDeveloper) && {
      id: '',
      zh: 'AI 报告平台',
      url: generateUrlByModule({ module: LinkModule.AI_REPORT_HOME, isDev }),
      navigate: (item) => {
        window.open(item.url, '_blank')
      },
    },
    isStaging && {
      id: '',
      zh: '智能财报诊断（开发站）',
      url: '/govbusiness/index.html#/report-analysis',
      navigate: (item) => {
        window.open(item.url, '_blank')
      },
    },
  ].filter(Boolean),
})

// 图谱平台菜单组
export const KGMenus = (envParams: IEnvParams) => ({
  id: '138167',
  zh: '图谱平台',
  list: [
    getCompanyAtlasPlatformItem(),
    getEquityPenetrationItem(),
    getRelatedPartyAtlasItem(),
    // getSuspectedControllerItem(),
    // getFinalBeneficiaryItem(),
    usedInClient() ? getFinancingAtlasItem() : getFinancingHistoryItem(),
    getMultiToOneReachItem(),
    getCompetitorAtlasItem(envParams),
  ],
})
// 场景应用菜单组

export const ScenarioApplicationMenus = (envParams: IEnvParams) => ({
  id: '247484',
  zh: '场景应用',
  list: [
    getWanxunMapItem(envParams),
    getKeyParksItem(),
    getNewCompanyDiscoveryItem(),
    getStrategicIndustriesItem(envParams),
    getPrimaryMarketTrackItem(envParams),
    getSupplyChainExplorationItem(envParams),
    getCorporateMarketingWorkbenchItem(envParams),
    isDeveloper && {
      id: '422037',
      zh: '企业图谱平台',
      url: 'index.html#/aigraph?isSeparate=1&nosearch=1',
    },
  ].filter(Boolean),
})

// 特色企业菜单组
export const SpecialCompanyMenus = () => ({
  id: 244162,
  zh: '特色企业',
  list: [
    getCompanyListDirectoryItem(),
    getStateOwnedCompanyItem(),
    getBondIssuingCompanyItem(),
    getFinancialInstitutionItem(),
    getListedCompanyItem(),
    getPEVCInvestedCompanyItem(),
    getCompanyQualificationItem(),
  ],
})
// 专项数据菜单组

export const SpecialDataMenus = () => ({
  id: '223893',
  zh: '专项数据',
  list: [getBiddingItem(), getRecruitmentItem(), getPatentItem(), getTrademarkItem()],
})

export const ComprehensiveSearch = (envParams: IEnvParams) => ({
  id: 223895,
  zh: '综合查询',
  list: [
    getSearchCompanyItem(),
    getSearchGlobalCompanyItem(),
    getSearchPersonItem(),
    getSearchRelationItem(),
    getSearchGroupItem(),
    getSearchRiskItem(envParams),
  ],
})
console.log('🚀 ~ ComprehensiveSearch ~ ComprehensiveSearch:', ComprehensiveSearch(getEnvParams()))

export const overSeaMenus = (envParams: IEnvParams): IFuncMenuGroup[] => [
  ComprehensiveSearch(envParams),
  KGMenus(envParams),
  SpecialDataMenus(),
  {
    id: '247484',
    zh: '场景应用',
    list: [getCompanyListDirectoryItem(), getNewCompanyDiscoveryItem()],
  },
  EasyToolMenus(envParams),
]

// 全部功能下拉菜单配置项
export const getHeaderAllFuncMenus = (): Array<
  Omit<IFuncMenuGroup, 'list'> & {
    list: Array<Omit<IFuncMenuItem, 'disabled'>>
  }
> => {
  const envParams = getEnvParams()
  const isOversea = wftCommon.is_overseas_config

  // 根据环境获取菜单配置
  const menus = isOversea
    ? overSeaMenus(envParams)
    : [
        ComprehensiveSearch(envParams),
        SpecialDataMenus(),
        KGMenus(envParams),
        SpecialCompanyMenus(),
        ScenarioApplicationMenus(envParams),
        EasyToolMenus(envParams),
      ]

  // 过滤掉 disabled 为 true 的菜单项
  const filteredMenus = menus.map((group) => ({
    ...group,
    list: group.list.filter((item) => !item.disabled),
  }))

  return filteredMenus
}
