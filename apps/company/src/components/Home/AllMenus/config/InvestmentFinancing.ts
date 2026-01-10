import { isDev } from '@/utils/env'
import { getRimeLink, RimeLinkModule } from 'gel-util/link'
import { IFuncMenuGroup } from '../type'

const RIME_MENU_ITEMS = [
  {
    id: '478374',
    zh: '一级市场投融数据',
    module: RimeLinkModule.PEVC_EVENT,
    icon: 'PEVC_BTQY',
  },
  {
    id: '396033',
    zh: '一级市场来觅赛道',
    module: RimeLinkModule.VERTICAL_ALL,
    icon: 'TZSD',
  },
  {
    id: '440458',
    zh: '私募股权基金',
    module: RimeLinkModule.PEVC_FUND,
    icon: 'SSFZQY',
  },
  {
    id: '451231',
    zh: '投资机构',
    module: RimeLinkModule.PEVC_INSTITUTION,
    icon: 'JRJG',
  },
  {
    id: '429083',
    zh: '政府出资平台',
    module: RimeLinkModule.GOV_FUNDED_PLATFORM_INSTITUTION,
    icon: 'YQGQ',
  },
  {
    id: '437608',
    zh: 'AI商业计划书分析',
    module: RimeLinkModule.BP_ANALYSIS,
    icon: 'KCQY',
  },
] as const

export const InvestmentFinancingMenus = (): IFuncMenuGroup => {
  return {
    id: '100525',
    zh: '投融资',
    list: RIME_MENU_ITEMS.map(({ module, ...rest }) => ({
      ...rest,
      url: getRimeLink(module, undefined, isDev),
    })),
  }
}
