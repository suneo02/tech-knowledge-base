import { getUrlByLinkModule, LinksModule, ScenarioApplicationLinkEnum } from '@/handle/link'
import { wftCommon } from '@/utils/utils'
import { IFuncMenuItem } from '../type'

// 新企发现
export const getNewCompanyDiscoveryItem = (): IFuncMenuItem => ({
  id: '235783',
  zh: '新企发现',
  url: getUrlByLinkModule(LinksModule.SCENARIO_APPLICATION, {
    subModule: ScenarioApplicationLinkEnum.NEW_CORP,
  }),
  icon: 'XQFX',
})

// 供应链探索
export const getSupplyChainExplorationItem = (): IFuncMenuItem => {
  const isOversea = wftCommon.is_overseas_config
  return {
    id: '314444',
    zh: '供应链探索',
    url: getUrlByLinkModule(LinksModule.SCENARIO_APPLICATION, {
      subModule: ScenarioApplicationLinkEnum.SUPPLY,
    }),
    icon: 'GYLTS',
    disabled: isOversea,
  }
}
