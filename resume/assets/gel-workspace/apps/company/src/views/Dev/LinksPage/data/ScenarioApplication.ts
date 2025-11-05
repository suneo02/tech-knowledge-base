import { LinksModule, ScenarioApplicationLinkEnum } from '@/handle/link'

/**
 *  场景应用
 */
export const ScenarioApplicationPageData = [
  {
    title: '重点园区',
    subModule: ScenarioApplicationLinkEnum.PARK,
  },
  {
    title: '新企发现',
    subModule: ScenarioApplicationLinkEnum.NEW_CORP,
  },
  {
    title: '产业链',
    subModule: ScenarioApplicationLinkEnum.CHAIN,
  },
  {
    title: '供应链探索',
    subModule: ScenarioApplicationLinkEnum.SUPPLY,
  },
  {
    title: '批量查询导出',
    subModule: ScenarioApplicationLinkEnum.BATCH_OUTPUT,
  },
].map((item) => ({
  ...item,
  module: LinksModule.SCENARIO_APPLICATION,
}))
