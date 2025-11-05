import { GELSearchParam, getUrlByLinkModule, LinksModule, SearchLinkEnum } from '@/handle/link'
import { IFuncMenuItem } from '../type'

// 招投标
export const getBiddingItem = (): IFuncMenuItem => ({
  id: '271633',
  zh: '招投标',
  url: getUrlByLinkModule(LinksModule.SEARCH, {
    subModule: SearchLinkEnum.BidNew,
    params: {
      [GELSearchParam.NoSearch]: 1,
    },
  }),
  css: 'bid-icon',
  icon: 'CZTB',
})

// 招聘
export const getRecruitmentItem = (): IFuncMenuItem => {
  return {
    id: '138356',
    zh: '招聘',
    url: getUrlByLinkModule(LinksModule.SEARCH, {
      subModule: SearchLinkEnum.JobFront,
      params: {
        [GELSearchParam.NoSearch]: 1,
      },
    }),
    css: 'job-icon',
    icon: 'CZP',
  }
}

// 专利
export const getPatentItem = (): IFuncMenuItem => ({
  id: '124585',
  zh: '专利',
  url: getUrlByLinkModule(LinksModule.SEARCH, {
    subModule: SearchLinkEnum.PatentFront,
    params: {
      [GELSearchParam.NoSearch]: 1,
    },
  }),
  css: 'patent-icon',
  icon: 'CZL',
})

// 商标
export const getTrademarkItem = (): IFuncMenuItem => ({
  id: '138799',
  zh: '商标',
  url: getUrlByLinkModule(LinksModule.SEARCH, {
    subModule: SearchLinkEnum.BrandFront,
    params: {
      [GELSearchParam.NoSearch]: 1,
    },
  }),
  css: 'brand-icon',
  icon: 'CSB',
})
