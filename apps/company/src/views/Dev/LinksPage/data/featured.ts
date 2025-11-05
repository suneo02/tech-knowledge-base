import { LinksModule, SpecialCompanyListLinkEnum } from '@/handle/link'

export const FeaturedCompanyListLinkData = [
  {
    title: '上市企业',
    subModule: SpecialCompanyListLinkEnum.IPO,
    module: LinksModule.SPECIAL_CORP,
  },
  {
    title: '发债企业',
    subModule: SpecialCompanyListLinkEnum.DEBT,
    module: LinksModule.SPECIAL_CORP,
  },
  {
    title: '央企国企',
    subModule: SpecialCompanyListLinkEnum.CN_GROUP,
    module: LinksModule.SPECIAL_CORP,
  },
  {
    title: '金融机构',
    subModule: SpecialCompanyListLinkEnum.FINANCIAL_CORP,
    module: LinksModule.SPECIAL_CORP,
  },
  {
    title: 'PEVC 被投企业',
    subModule: SpecialCompanyListLinkEnum.PEVC_INVEST,
    module: LinksModule.SPECIAL_CORP,
  },
]
