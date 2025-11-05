import { LinksModule, TLinkOptions } from '@/handle/link'
import { FeaturedCompanyListLinkData } from './featured'
import { KGPageData } from './KG'
import { ScenarioApplicationPageData } from './ScenarioApplication'
import { SearchFrontPageData, SearchPageData } from './search'
import { UserPageData } from './user'
import qualificationCodeMap from './qualifficationCodeMap.json'
import { LinksOtherData } from '@/views/Dev/LinksPage/data/misc.ts'
import { QualificationLinkData } from '@/views/Dev/LinksPage/data/qualification.ts'
import { LinksDetailData } from '@/views/Dev/LinksPage/data/detail.ts'

export * from './KG'
export * from './featured'
export * from './search'
export * from './user'
export * from './ScenarioApplication'

interface LinkItem extends TLinkOptions {
  title: string
  module: LinksModule
}

/**
 * 获取所有链接配置数据
 * @returns {LinkItem[]} 链接配置数组
 */
export const getLinksDataList = (): LinkItem[] => {
  // 从资质代码映射中生成资质链接配置
  const qualificationLinks: LinkItem[] = Object.entries(qualificationCodeMap).map(([key, value]) => ({
    title: value.name || value[1],
    module: LinksModule.QUALIFICATION_DETAIL,
    id: value.code || value[0],
    params: {
      code: value.code || value[0],
    },
  }))

  // @ts-expect-error ttt
  return [
    ...LinksDetailData,
    ...LinksOtherData,
    ...FeaturedCompanyListLinkData,
    ...KGPageData,
    ...ScenarioApplicationPageData,
    ...SearchFrontPageData,
    ...UserPageData,
    ...QualificationLinkData,
    ...qualificationLinks,
  ]
}
export const LinkGroupsData = [
  {
    title: '其他',
    data: LinksOtherData,
  },
  {
    title: '详情页',
    data: LinksDetailData,
  },

  {
    title: '资质大全及榜单名录',
    data: QualificationLinkData,
  },

  {
    title: '综合查询（带查询结果）',
    data: SearchPageData,
  },
  {
    title: '查询首页（不带搜索结果）',
    data: SearchFrontPageData,
  },
  {
    title: '图谱平台',
    data: KGPageData,
  },
  {
    title: '特色企业列表',
    data: FeaturedCompanyListLinkData,
  },
  {
    title: '场景应用',
    data: ScenarioApplicationPageData,
  },
  {
    title: '用户中心',
    data: UserPageData,
  },
]
