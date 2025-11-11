import { GELSearchParam, getUrlByLinkModule, KGLinkEnum, LinksModule, SearchLinkEnum } from '@/handle/link'
import { IEnvParams } from '@/utils/env'
import { wftCommon } from '@/utils/utils'
import { IFuncMenuItem } from '../type'

// 查企业
export const getSearchCompanyItem = (): IFuncMenuItem => ({
  id: '421562',
  zh: '查企业',
  url: getUrlByLinkModule(LinksModule.SEARCH, {
    subModule: SearchLinkEnum.CompanyHomeFront,
  }),
  css: 'company-icon',
  icon: 'CGS',
})

// 查全球企业
export const getSearchGlobalCompanyItem = (): IFuncMenuItem => ({
  id: '437235',
  zh: '查全球企业',
  url: getUrlByLinkModule(LinksModule.SEARCH, {
    subModule: SearchLinkEnum.OutCompanyFront,
    params: {
      [GELSearchParam.NoSearch]: 1,
    },
  }),
  css: 'global-icon',
  icon: 'CQQQY',
  // new: true,
})

// 查人物
export const getSearchPersonItem = (): IFuncMenuItem => {
  const isOversea = wftCommon.is_overseas_config
  return {
    id: '138432',
    zh: '查人物',
    url: getUrlByLinkModule(LinksModule.SEARCH, {
      subModule: SearchLinkEnum.PeopleHomeFront,
    }),
    disabled: isOversea,
    css: 'searchperson-icon',
    icon: 'CRW',
  }
}

// 查关系
export const getSearchRelationItem = (): IFuncMenuItem => ({
  id: '422046',
  zh: '查关系',
  url: getUrlByLinkModule(LinksModule.KG, {
    subModule: KGLinkEnum.chart_cgx,
    params: {
      [GELSearchParam.NoSearch]: 1,
    },
  }),
  css: 'relation-icon',
  icon: 'CGX',
})

// 查集团系
export const getSearchGroupItem = (): IFuncMenuItem => ({
  id: '247482',
  zh: '查集团系',
  url: getUrlByLinkModule(LinksModule.SEARCH, {
    subModule: SearchLinkEnum.GroupFront,
    params: {
      [GELSearchParam.NoSearch]: 1,
    },
  }),
  css: 'group-icon',
  icon: 'CJTX',
})

// 查风险
export const getSearchRiskItem = ({ isTerminal }: IEnvParams): IFuncMenuItem => {
  const isOversea = wftCommon.is_overseas_config
  return {
    id: '222404',
    zh: '查风险',
    url: isTerminal
      ? '/wind.risk.platform/index.html#/check/special/judicature'
      : 'https://erm.wind.com.cn/wind.risk.platform/index.html#/login',
    navigate: (item: IFuncMenuItem) => {
      window.open(item.url)
    },
    css: 'quest-risk-icon',
    icon: 'CSF',
    disabled: !isTerminal || isOversea,
  }
}
