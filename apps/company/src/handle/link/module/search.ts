import { getPrefixUrl, handleAppendUrlPath } from '../handle'
import { HomeSearchTabKeys } from '@/views/SearchHome/HomeSearchForm.tsx'

/**
 * 查询结果列表
 * eg http://localhost:3001/SearchHomeList.htm#/searchList
 */
export const SearchLinkEnum = {
  /**
   * 查询结果列表
   */
  Company: 'searchList',
  Person: 'personSearchList',
  Group: 'groupSearchList',
  Bid: 'bidSearchList',
  Intellectual: 'intelluctalSearch',
  OutCompany: 'outCompanySearch',
  BidNew: 'searchBidNew',

  /**
   * 查询首页 不带查询结果
   */
  PatentFront: 'searchPlatform/SearchPatent',
  BrandFront: 'searchPlatform/SearchBrand',
  QualificationFront: 'qualifications',
  JobFront: 'searchJob',
  FeaturedFront: 'searchPlatform/SearchFetured',
  GroupFront: 'searchPlatform/SearchGroupDepartment',

  CompanyHomeFront: HomeSearchTabKeys.Company,
  PeopleHomeFront: HomeSearchTabKeys.People,
  GroupHomeFront: HomeSearchTabKeys.Group,
  RelationHomeFront: HomeSearchTabKeys.Relation,

  OutCompanyFront: 'searchPlatform/GlobalSearch',
}

export const SearchLinkHomeFrontArr = [
  SearchLinkEnum.CompanyHomeFront,
  SearchLinkEnum.PeopleHomeFront,
  SearchLinkEnum.GroupHomeFront,
  SearchLinkEnum.RelationHomeFront,
]

/**
 * 这些链接的查询地址 在 SearchHomeList.html
 */
export const SearchLinkInSearchHomeList = [
  SearchLinkEnum.Company,
  SearchLinkEnum.Person,
  SearchLinkEnum.Group,
  SearchLinkEnum.Bid,
  SearchLinkEnum.Intellectual,
  SearchLinkEnum.OutCompany,
]

/**
 * 拼接综合查询 url 根据 submodule
 */
export const getSearchLinkBySubModule = ({ subModule, params, env }) => {
  if (!subModule) {
    return null
  }
  const baseUrl = new URL(
    getPrefixUrl({
      envParam: env,
    })
  )
  if (SearchLinkInSearchHomeList.includes(subModule)) {
    // 追加新的路径
    baseUrl.pathname = `${baseUrl.pathname.replace(/\/$/, '')}/SearchHomeList.html`
    baseUrl.search = new URLSearchParams(params).toString()
    baseUrl.hash = `#/${subModule}` // 设置哈希值
  } else if (SearchLinkHomeFrontArr.includes(subModule)) {
    baseUrl.pathname = handleAppendUrlPath(baseUrl.pathname)
    baseUrl.hash = `#/SearchHome`
    baseUrl.search = new URLSearchParams({
      ...params,
      type: subModule,
    }).toString()
  } else {
    baseUrl.pathname = handleAppendUrlPath(baseUrl.pathname)
    baseUrl.hash = `#/${subModule}`
    baseUrl.search = new URLSearchParams(params).toString()
  }
  return baseUrl.toString()
}
