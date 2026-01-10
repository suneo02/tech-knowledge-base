import { getWebAIChatLinkWithIframe } from '@/handle/link/WebAI'
import { isDeveloper } from '@/utils/common.ts'
import { isDev, isStaging } from '@/utils/env'
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
  getSuperAgentItem,
  getSuperItem,
} from './config/EasyTool.tsx'
import { InvestmentFinancingMenus } from './config/InvestmentFinancing.ts'
import {
  getCompanyAtlasPlatformItem,
  getCompetitorAtlasItem,
  getEquityPenetrationItem,
  getFinancingAtlasItem,
  getFinancingHistoryItem,
  getMultiToOneReachItem,
  getRelatedPartyAtlasItem,
} from './config/KG.ts'
import { MarketingAcquisitionMenus } from './config/MarketingAcquisition.ts'
import { getNewCompanyDiscoveryItem, getSupplyChainExplorationItem } from './config/ScenarioApplication.ts'
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

export const EasyToolMenus = (): IFuncMenuGroup => ({
  id: '247483',
  zh: '便捷工具',
  list: [
    getBatchQueryExportItem(),
    getReportPlatformItem(),
    getCompanyDataBrowserItem(),
    getSuperItem(),
    getCompanyDataApiItem(),
    getCompanyDynamicsItem(),
    getAiFinancialItem(),
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
    isDeveloper && getSuperAgentItem(),
  ].filter(Boolean),
})

// 图谱平台菜单组
export const KGMenus = () => ({
  id: '138167',
  zh: '图谱平台',
  list: [
    getCompanyAtlasPlatformItem(),
    getEquityPenetrationItem(),
    getRelatedPartyAtlasItem(),
    usedInClient() ? getFinancingAtlasItem() : getFinancingHistoryItem(),
    getMultiToOneReachItem(),
    getCompetitorAtlasItem(),
    getSupplyChainExplorationItem(),
  ],
})
// 场景应用菜单组

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
  list: [
    getBiddingItem(),
    getRecruitmentItem(),
    getPatentItem(),
    getTrademarkItem(),
    getCompanyListDirectoryItem(),
    getCompanyQualificationItem(),
  ],
})

export const ComprehensiveSearch = () => ({
  id: 223895,
  zh: '综合查询',
  list: [
    getSearchCompanyItem(),
    getSearchGlobalCompanyItem(),
    getSearchPersonItem(),
    getSearchRelationItem(),
    getSearchGroupItem(),
    getSearchRiskItem(),
  ],
})

export const overSeaMenus = (): IFuncMenuGroup[] => [
  ComprehensiveSearch(),
  KGMenus(),
  SpecialDataMenus(),
  {
    id: '247484',
    zh: '场景应用',
    list: [getCompanyListDirectoryItem(), getNewCompanyDiscoveryItem()],
  },
  EasyToolMenus(),
]

// 全部功能下拉菜单配置项
export const getHeaderAllFuncMenus = (): Array<
  Omit<IFuncMenuGroup, 'list'> & {
    list: Array<Omit<IFuncMenuItem, 'disabled'>>
  }
> => {
  const isOversea = wftCommon.is_overseas_config

  // 根据环境获取菜单配置
  const menus = isOversea
    ? overSeaMenus()
    : [
        ComprehensiveSearch(),
        SpecialDataMenus(),
        KGMenus(),
        InvestmentFinancingMenus(),
        MarketingAcquisitionMenus(),
        EasyToolMenus(),
      ]

  // 过滤掉 disabled 为 true 的菜单项
  const filteredMenus = menus.map((group) => ({
    ...group,
    list: group.list.filter((item) => !item.disabled),
  }))

  return filteredMenus
}
