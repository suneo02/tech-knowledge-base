import { getEnvParams, IEnvParams } from '@/utils/env'
import {
  getSearchCompanyItem,
  getSearchGlobalCompanyItem,
  getSearchGroupItem,
  getSearchPersonItem,
  getSearchRelationItem,
  getSearchRiskItem,
} from './config/ComprehensiveSearch'
import {
  getBatchQueryExportItem,
  // getCompanyAtlasPlatformItem,
  getCompanyDataApiItem,
  getCompanyDataBrowserItem,
  getCompanyDynamicsItem,
  getReportPlatformItem,
} from './config/EasyTool'
import {
  getCompanyAtlasPlatformItem,
  getCompetitorAtlasItem,
  getEquityPenetrationItem,
  getFinalBeneficiaryItem,
  getFinancingAtlasItem,
  getMultiToOneReachItem,
  getRelatedPartyAtlasItem,
  getSuspectedControllerItem,
} from './config/KG'
import {
  getCorporateMarketingWorkbenchItem,
  getKeyParksItem,
  getNewCompanyDiscoveryItem,
  getPrimaryMarketTrackItem,
  getStrategicIndustriesItem,
  getSupplyChainExplorationItem,
  getWanxunMapItem,
} from './config/ScenarioApplication'
import {
  getBondIssuingCompanyItem,
  getCompanyListDirectoryItem,
  getCompanyQualificationItem,
  getFinancialInstitutionItem,
  getListedCompanyItem,
  getPEVCInvestedCompanyItem,
  getStateOwnedCompanyItem,
} from './config/SpecialCompany'
import { getBiddingItem, getPatentItem, getRecruitmentItem, getTrademarkItem } from './config/SpecialData'
import { IFuncMenuItem } from './type'

const HomePageAllMenus = (envParams: IEnvParams): IFuncMenuItem[] => {
  return [
    getSearchCompanyItem(),
    getSearchGlobalCompanyItem(),
    getSearchPersonItem(),
    getSearchRelationItem(),
    getSearchGroupItem(),
    getSearchRiskItem(envParams),
    getBiddingItem(),
    getRecruitmentItem(),
    getPatentItem(),
    getTrademarkItem(),
    getEquityPenetrationItem(),
    getRelatedPartyAtlasItem(),
    getSuspectedControllerItem(),
    getFinalBeneficiaryItem(),
    getFinancingAtlasItem(),
    getMultiToOneReachItem(),
    getCompetitorAtlasItem(envParams),
    getCompanyListDirectoryItem(),
    getStateOwnedCompanyItem(),
    getBondIssuingCompanyItem(),
    getFinancialInstitutionItem(),
    getListedCompanyItem(),
    getPEVCInvestedCompanyItem(),
    getCompanyQualificationItem(),
    getWanxunMapItem(envParams),
    getKeyParksItem(),
    getNewCompanyDiscoveryItem(),
    getStrategicIndustriesItem(envParams),
    getPrimaryMarketTrackItem(envParams),
    getSupplyChainExplorationItem(envParams),
    getCorporateMarketingWorkbenchItem(envParams),
    getBatchQueryExportItem(),
    getReportPlatformItem(),
    getCompanyAtlasPlatformItem(),
    getCompanyDataBrowserItem(),
    getCompanyDataApiItem(envParams),
    getCompanyDynamicsItem(envParams),
  ]
}

export const getHomePageAllMenus = (): Array<Omit<IFuncMenuItem, 'disabled'>> => {
  const envParams = getEnvParams()
  return HomePageAllMenus(envParams).filter((item) => !item.disabled)
}

export const getHomePageMAinMenus = (): Array<Omit<IFuncMenuItem, 'disabled'>> => {
  return [
    getCompanyDynamicsItem({}),
    getCompanyAtlasPlatformItem(),
    getCompanyDataBrowserItem(),
    getBatchQueryExportItem(),
  ]
}
