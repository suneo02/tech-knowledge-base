import {
  GELSearchParam,
  getUrlByLinkModule,
  LinksModule,
  SearchLinkEnum,
  SpecialCompanyListLinkEnum,
} from '@/handle/link'
import { wftCommon } from '@/utils/utils'
import { IFuncMenuItem } from '../type'

// 企业榜单名录
export const getCompanyListDirectoryItem = (): IFuncMenuItem => ({
  id: '259148',
  zh: '企业榜单名录',
  url: getUrlByLinkModule(LinksModule.SEARCH, {
    subModule: SearchLinkEnum.FeaturedFront,
    params: {
      [GELSearchParam.NoSearch]: 1,
    },
  }),
  css: 'bjtop-icon top-func-icon',
  icon: 'BDML',
  hot: true,
})

// 央企国企
export const getStateOwnedCompanyItem = (): IFuncMenuItem => {
  const isOversea = wftCommon.is_overseas_config
  return {
    id: '252985',
    zh: '央企国企',
    url: getUrlByLinkModule(LinksModule.SPECIAL_CORP, {
      subModule: SpecialCompanyListLinkEnum.CN_GROUP,
      params: {
        [GELSearchParam.NoSearch]: 1,
      },
    }),
    disabled: isOversea,
    css: 'cngroup-icon',
    icon: 'YQGQ',
  }
}

// 发债企业
export const getBondIssuingCompanyItem = (): IFuncMenuItem => {
  const isOversea = wftCommon.is_overseas_config
  return {
    id: '59563',
    zh: '发债企业',
    url: getUrlByLinkModule(LinksModule.SPECIAL_CORP, {
      subModule: SpecialCompanyListLinkEnum.DEBT,
      params: {
        [GELSearchParam.NoSearch]: 1,
      },
    }),
    disabled: isOversea,
    css: 'debt-icon',
    icon: 'SSFZQY',
  }
}

// 金融机构
export const getFinancialInstitutionItem = (): IFuncMenuItem => {
  const isOversea = wftCommon.is_overseas_config
  return {
    id: '48058',
    zh: '金融机构',
    url: getUrlByLinkModule(LinksModule.SPECIAL_CORP, {
      subModule: SpecialCompanyListLinkEnum.FINANCIAL_CORP,
      params: {
        [GELSearchParam.NoSearch]: 1,
      },
    }),
    disabled: isOversea,
    css: 'financialcorp-icon',
    icon: 'JRJG',
  }
}

// 上市企业
export const getListedCompanyItem = (): IFuncMenuItem => {
  const isOversea = wftCommon.is_overseas_config
  return {
    id: '142006',
    zh: '上市企业',
    icon: 'KCQY',
    url: getUrlByLinkModule(LinksModule.SPECIAL_CORP, {
      subModule: SpecialCompanyListLinkEnum.IPO,
      params: {
        [GELSearchParam.NoSearch]: 1,
      },
    }),
    disabled: isOversea,
  }
}

// PEVC被投企业
export const getPEVCInvestedCompanyItem = (): IFuncMenuItem => {
  const isOversea = wftCommon.is_overseas_config
  return {
    id: '265623',
    zh: 'PEVC被投企业',
    url: getUrlByLinkModule(LinksModule.SPECIAL_CORP, {
      subModule: SpecialCompanyListLinkEnum.PEVC_INVEST,
      params: {
        [GELSearchParam.NoSearch]: 1,
      },
    }),
    disabled: isOversea,
    css: 'pevcinvest-icon',
    icon: 'PEVC_BTQY',
  }
}

// 企业资质大全
export const getCompanyQualificationItem = (): IFuncMenuItem => {
  const isOversea = wftCommon.is_overseas_config
  return {
    id: '395053',
    zh: '企业资质大全',
    url: getUrlByLinkModule(LinksModule.SEARCH, {
      subModule: SearchLinkEnum.QualificationFront,
    }),
    css: 'qualification-icon top-beta-icon',
    icon: 'ZZDQ',
    //     new: true,
    disabled: isOversea,
  }
}
