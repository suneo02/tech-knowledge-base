import { LinksModule, SearchLinkEnum } from '@/handle/link'

/**
 * @typedef LinksData 综合查询查询结果链接
 * @property {string} title - 链接的标题
 * @property {string} utl - 跳转链接
 * @property {LinksModule} module - 链接所属的模块
 */
export const SearchPageData = [
  {
    title: '查企业',
    subModule: SearchLinkEnum.Company,
  },
  {
    title: '查人物',
    subModule: SearchLinkEnum.Person,
  },
  {
    title: '查集团',
    subModule: SearchLinkEnum.Group,
  },
  {
    title: '查招投标',
    subModule: SearchLinkEnum.Bid,
  },
  {
    title: '查招投标新版',
    subModule: SearchLinkEnum.BidNew,
  },
  {
    title: '查知识产权',
    subModule: SearchLinkEnum.Intellectual,
  },
  {
    title: '查专利',
    subModule: SearchLinkEnum.Intellectual,
    params: {
      type: 'patent_search',
    },
  },
  {
    title: '查商标',
    subModule: SearchLinkEnum.Intellectual,
    params: {
      type: 'trademark_search',
    },
  },
  {
    title: '查全球企业',
    subModule: SearchLinkEnum.OutCompany,
  },
].map((item) => ({
  ...item,
  module: LinksModule.SEARCH,
}))

/**
 *  综合查询首页
 */
export const SearchFrontPageData = [
  {
    title: '专利查询',
    subModule: SearchLinkEnum.PatentFront,
  },
  {
    title: '商标查询',
    subModule: SearchLinkEnum.BrandFront,
  },
  {
    title: '资质大全',
    subModule: SearchLinkEnum.QualificationFront,
  },
  {
    title: '招聘查询',
    subModule: SearchLinkEnum.JobFront,
  },
  {
    title: '企业榜单名录查询',
    subModule: SearchLinkEnum.FeaturedFront,
  },
  {
    title: '集团系查询',
    subModule: SearchLinkEnum.GroupFront,
  },
  {
    title: '查企业首页',
    subModule: SearchLinkEnum.CompanyHomeFront,
  },
  {
    title: '查人物首页',
    subModule: SearchLinkEnum.PeopleHomeFront,
  },
  {
    title: '查集团首页',
    subModule: SearchLinkEnum.GroupHomeFront,
  },
  {
    title: '查关系首页',
    subModule: SearchLinkEnum.RelationHomeFront,
  },
  {
    title: '查全球企业首页',
    subModule: SearchLinkEnum.OutCompanyFront,
  },
].map((item) => ({
  ...item,
  module: LinksModule.SEARCH,
}))
