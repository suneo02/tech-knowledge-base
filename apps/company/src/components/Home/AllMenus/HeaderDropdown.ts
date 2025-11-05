// 综合查询菜单组
import { getUrlByLinkModule, LinksModule } from '@/handle/link'
import { getWebAIChatLink } from '@/handle/link/WebAI'
import { isDeveloper } from '@/utils/common.ts'
import { getEnvParams, IEnvParams } from '@/utils/env'
import { wftCommon } from '@/utils/utils.tsx'
import {
  getSearchCompanyItem,
  getSearchGlobalCompanyItem,
  getSearchGroupItem,
  getSearchPersonItem,
  getSearchRelationItem,
  getSearchRiskItem,
} from './config/ComprehensiveSearch.ts'
import {
  getBatchQueryExportItem,
  getCompanyAtlasPlatformItem,
  getCompanyDataApiItem,
  getCompanyDataBrowserItem,
  getCompanyDynamicsItem,
  getReportPlatformItem,
} from './config/EasyTool.ts'
import {
  getCompetitorAtlasItem,
  getEquityPenetrationItem,
  getFinalBeneficiaryItem,
  getFinancingAtlasItem,
  getMultiToOneReachItem,
  getRelatedPartyAtlasItem,
  getSuspectedControllerItem,
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

export const EasyToolMenus = (envParams: IEnvParams) => ({
  id: '247483',
  zh: '便捷工具',
  list: [
    getBatchQueryExportItem(),
    getReportPlatformItem(),
    getCompanyAtlasPlatformItem(),
    getCompanyDataBrowserItem(),
    getCompanyDataApiItem(envParams),
    getCompanyDynamicsItem(envParams),
    isDeveloper && {
      id: '',
      zh: 'Home AI',
      url: getUrlByLinkModule(LinksModule.HOMEAI),
    },
    isDeveloper && {
      id: '',
      zh: 'CompanyDetail AI',
      url: getUrlByLinkModule(LinksModule.CompanyDetailAI, {
        params: {
          companyCode: '1047934153',
          isSeparate: '1',
        },
      }),
    },
    isDeveloper && {
      id: '',
      zh: 'AI Chat',
      url: getWebAIChatLink(),
    },
  ],
})

// 图谱平台菜单组
export const KGMenus = (envParams: IEnvParams) => ({
  id: '138167',
  zh: '图谱平台',
  list: [
    getEquityPenetrationItem(),
    getRelatedPartyAtlasItem(),
    getSuspectedControllerItem(),
    getFinalBeneficiaryItem(),
    getFinancingAtlasItem(),
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
      id: '',
      zh: '企业图谱平台',
      url: 'index.html#/graph?isSeparate=1&nosearch=1',
    },
  ],
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
