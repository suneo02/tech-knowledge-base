import { BaiFenSites, getUrlByLinkModule, LinksModule, ScenarioApplicationLinkEnum } from '@/handle/link'
import { pointClickYhhkgj, pointClickZlxxcy } from '@/lib/pointBuriedGel.tsx'
import { IEnvParams } from '@/utils/env'
import { wftCommon } from '@/utils/utils'
import { IFuncMenuItem } from '../type'

// 万寻地图
export const getWanxunMapItem = ({ isTerminal }: IEnvParams): IFuncMenuItem => {
  const isOversea = wftCommon.is_overseas_config
  return {
    id: '422022',
    zh: '万寻地图',
    url: `${window.location.protocol}//${window.location.host}/govmap/index.html?mode=2&pureMode&title=%E4%B8%87%E5%AF%BB%E5%9C%B0%E5%9B%BE&right=4C203DE15#/`,
    icon: 'WXDT',
    disabled: !isTerminal || isOversea,
  }
}

// 重点园区
export const getKeyParksItem = (): IFuncMenuItem => {
  const isOversea = wftCommon.is_overseas_config
  return {
    id: '294403',
    zh: '重点园区',
    url: getUrlByLinkModule(LinksModule.SCENARIO_APPLICATION, {
      subModule: ScenarioApplicationLinkEnum.PARK,
    }),
    disabled: isOversea,
    icon: 'ZDYQ',
    new: true,
  }
}

// 新企发现
export const getNewCompanyDiscoveryItem = (): IFuncMenuItem => ({
  id: '235783',
  zh: '新企发现',
  url: getUrlByLinkModule(LinksModule.SCENARIO_APPLICATION, {
    subModule: ScenarioApplicationLinkEnum.NEW_CORP,
  }),
  icon: 'XQFX',
})

// 战略性新兴产业
export const getStrategicIndustriesItem = ({ isTerminal }: IEnvParams): IFuncMenuItem => {
  const isOversea = wftCommon.is_overseas_config
  return {
    id: '361813',
    zh: '战略性新兴产业',
    url: BaiFenSites().strategicIndustries,
    buryFunc: pointClickZlxxcy,
    icon: 'ZLXXXCY',
    new: true,
    disabled: !isTerminal || isOversea,
  }
}

// 一级市场来觅赛道
export const getPrimaryMarketTrackItem = ({ isTerminal }: IEnvParams): IFuncMenuItem => {
  const isOversea = wftCommon.is_overseas_config
  return {
    id: '396033',
    zh: '一级市场来觅赛道',
    url: '//RIME/rime/frontend/web/vertical/all',
    icon: 'TZSD',
    new: true,
    disabled: !isTerminal || isOversea,
  }
}

// 供应链探索
export const getSupplyChainExplorationItem = ({ isTerminal }: IEnvParams): IFuncMenuItem => {
  const isOversea = wftCommon.is_overseas_config
  return {
    id: '314444',
    zh: '供应链探索',
    url: getUrlByLinkModule(LinksModule.SCENARIO_APPLICATION, {
      subModule: ScenarioApplicationLinkEnum.SUPPLY,
    }),
    icon: 'GYLTS',
    disabled: !isTerminal || isOversea,
  }
}

// 对公营销工作台
export const getCorporateMarketingWorkbenchItem = ({ isTerminal }: IEnvParams): IFuncMenuItem => {
  const isOversea = wftCommon.is_overseas_config
  return {
    id: '397233',
    zh: '对公营销工作台',
    url: BaiFenSites().home,
    css: 'yhhk-icon',
    buryFunc: pointClickYhhkgj,
    icon: 'CYL',
    disabled: !isTerminal || isOversea,
  }
}
