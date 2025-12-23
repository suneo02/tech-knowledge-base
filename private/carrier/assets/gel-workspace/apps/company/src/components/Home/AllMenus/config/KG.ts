import { GELSearchParam, getUrlByLinkModule, getWKGUrl, KGLinkEnum, LinksModule, WKGModule } from '@/handle/link'
import { IEnvParams } from '@/utils/env'
import { wftCommon } from '@/utils/utils'
import { IFuncMenuItem } from '../type'
import { t } from 'gel-util/intl'

// 企业图谱平台
export const getCompanyAtlasPlatformItem = (): IFuncMenuItem => {
  const isOversea = wftCommon.is_overseas_config
  return {
    id: '422037',
    zh: t('422037', '企业图谱平台'),
    url: getUrlByLinkModule(LinksModule.KG, {
      subModule: KGLinkEnum.FRONT,
      params: {
        [GELSearchParam.NoSearch]: 1,
      },
    }),
    navigate: (item: IFuncMenuItem) => {
      window.open(item.url)
    },
    desc: t('367613', '洞察企业股权、关联关系'),
    css: 'risk-icon',
    icon: 'QYTPPT',
    disabled: isOversea,
  }
}

// 股权穿透
export const getEquityPenetrationItem = (): IFuncMenuItem => ({
  id: '138279',
  zh: '股权穿透',
  url: getUrlByLinkModule(LinksModule.KG, {
    subModule: KGLinkEnum.chart_gqct,
    params: {
      [GELSearchParam.NoSearch]: 1,
    },
  }),
  css: 'chartplathome-icon',
  icon: 'GQCTT',
})

// 关联方图谱
export const getRelatedPartyAtlasItem = (): IFuncMenuItem => {
  const isOversea = wftCommon.is_overseas_config
  return {
    id: '243685',
    zh: '关联方图谱',
    url: getUrlByLinkModule(LinksModule.KG, {
      subModule: KGLinkEnum.chart_glgx,
      params: {
        [GELSearchParam.NoSearch]: 1,
      },
    }),
    disabled: isOversea,

    css: 'chart-glgx-icon top-func-icon',
    icon: 'GLFTP',
  }
}

// 疑似控制人
export const getSuspectedControllerItem = (): IFuncMenuItem => ({
  id: '138449',
  zh: '疑似控制人',
  url: getUrlByLinkModule(LinksModule.KG, {
    subModule: KGLinkEnum.chart_yskzr,
    params: {
      [GELSearchParam.NoSearch]: 1,
    },
  }),
  css: 'chart-yskzr-icon',
  icon: 'SJKZR',
})

// 最终受益人
export const getFinalBeneficiaryItem = (): IFuncMenuItem => ({
  id: '138180',
  zh: '最终受益人',
  url: getUrlByLinkModule(LinksModule.KG, {
    subModule: KGLinkEnum.chart_qysyr,
    params: {
      [GELSearchParam.NoSearch]: 1,
    },
  }),
  css: 'chart-yskzr-icon',
  icon: 'ZZSYR',
})

// 融资图谱
export const getFinancingAtlasItem = (): IFuncMenuItem => ({
  id: '206370',
  zh: '融资图谱',
  url: getUrlByLinkModule(LinksModule.KG, {
    subModule: KGLinkEnum.chart_rztp,
    params: {
      [GELSearchParam.NoSearch]: 1,
    },
  }),
  css: 'chart-rztp-icon',
  icon: 'RZTP',
})

// 融资历程
export const getFinancingHistoryItem = (): IFuncMenuItem => ({
  id: '138297',
  zh: '融资历程',
  url: getUrlByLinkModule(LinksModule.KG, {
    subModule: KGLinkEnum.chart_rzlc,
    params: {
      [GELSearchParam.NoSearch]: 1,
    },
  }),
  css: 'chart-rztp-icon',
  icon: 'RZTP',
})

// 多对一触达
export const getMultiToOneReachItem = (): IFuncMenuItem => ({
  id: '247485',
  zh: '多对一触达',
  url: getUrlByLinkModule(LinksModule.KG, {
    subModule: KGLinkEnum.chart_ddycd,
    params: {
      [GELSearchParam.NoSearch]: 1,
    },
  }),
  css: 'detach-icon',
  icon: 'DDYCD',
})

// 竞争对手图谱
export const getCompetitorAtlasItem = ({ isTerminal }: IEnvParams): IFuncMenuItem => {
  const isOversea = wftCommon.is_overseas_config
  return {
    id: '396973',
    zh: '竞争对手图谱',
    url: getWKGUrl(WKGModule.COMPETITOR),
    css: 'detach-icon',
    icon: 'JZDS',
    //     new: true,
    disabled: !isTerminal || isOversea,
  }
}

export const getKGPlatformItem = (): IFuncMenuItem => ({
  id: '138167',
  zh: '图谱平台',
  url: getUrlByLinkModule(LinksModule.KG, {
    subModule: KGLinkEnum.FRONT,
    params: {
      [GELSearchParam.NoSearch]: 1,
    },
  }),
})
