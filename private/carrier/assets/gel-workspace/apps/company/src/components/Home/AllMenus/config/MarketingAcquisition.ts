import { BaiFenSites, getUrlByLinkModule, LinksModule, ScenarioApplicationLinkEnum } from '@/handle/link'
import { pointClickYhhkgj, pointClickZlxxcy } from '@/lib/pointBuriedGel.tsx'
import { buildBaiFenMapUrl } from 'gel-util/link'
import { IFuncMenuGroup } from '../type'
import { getNewCompanyDiscoveryItem } from './ScenarioApplication'

export const MarketingAcquisitionMenus = (): IFuncMenuGroup => {
  return {
    id: '432909',
    zh: '营销拓客',
    list: [
      {
        id: '391093',
        zh: '授信商机',
        url: BaiFenSites().creditOpportunities,
        icon: 'SXSJ_COLOR',
      },
      {
        id: '294403',
        zh: '重点园区',
        url: getUrlByLinkModule(LinksModule.SCENARIO_APPLICATION, {
          subModule: ScenarioApplicationLinkEnum.PARK,
        }),
        icon: 'ZDYQ',
      },
      getNewCompanyDiscoveryItem(),
      {
        id: '391133',
        zh: '授信挖掘',
        url: BaiFenSites().creditMining,
        icon: 'SXWJ_COLOR',
      },
      {
        id: '422022',
        zh: '万寻地图',
        url: buildBaiFenMapUrl({}),
        icon: 'WXDT',
      },
      {
        id: '361813',
        zh: '战略性新兴产业',
        url: BaiFenSites().strategicIndustries,
        buryFunc: pointClickZlxxcy,
        icon: 'ZLXXXCY',
      },
      {
        id: '397233',
        zh: '对公营销工作台',
        url: BaiFenSites().home,
        css: 'yhhk-icon',
        buryFunc: pointClickYhhkgj,
        icon: 'CYL',
      },
    ].filter(Boolean),
  }
}
