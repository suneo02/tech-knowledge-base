import { GELSearchParam, getUrlByLinkModule, KGLinkEnum, LinksModule, ScenarioApplicationLinkEnum } from '@/handle/link'
import { IEnvParams } from '@/utils/env'
import { wftCommon } from '@/utils/utils'
import { IFuncMenuItem } from '../type'
import { isDeveloper } from '@/utils/common'

// 批量查询导出
export const getBatchQueryExportItem = (): IFuncMenuItem => {
  return {
    id: '422040',
    zh: '批量查询导出',
    url: getUrlByLinkModule(LinksModule.SCENARIO_APPLICATION, {
      subModule: ScenarioApplicationLinkEnum.BATCH_OUTPUT,
    }),
    desc: '工作效能提升好助手',
    css: 'batch-output-icon',
    hot: true,
    icon: 'PLCXDC',
  }
}

// 报告平台
export const getReportPlatformItem = (): IFuncMenuItem => ({
  id: '417591',
  zh: '报告平台',
  url: getUrlByLinkModule(LinksModule.REPORT_HOME, {
    params: {
      [GELSearchParam.NoSearch]: 1,
    },
  }),
  desc: '智能生成企业分析报告',
  css: 'ddPlatform-icon top-beta-icon',
  new: true,
  icon: 'JDPT',
})

// 企业图谱平台
export const getCompanyAtlasPlatformItem = (): IFuncMenuItem => {
  const isOversea = wftCommon.is_overseas_config
  return {
    id: '422037',
    zh: '企业图谱平台',
    url: getUrlByLinkModule(LinksModule.KG, {
      subModule: KGLinkEnum.FRONT,
      params: {
        [GELSearchParam.NoSearch]: 1,
      },
    }),
    navigate: (item: IFuncMenuItem) => {
      window.open(item.url)
    },
    desc: '洞察企业股权、关联关系',
    css: 'risk-icon',
    icon: 'QYTPPT',
    disabled: isOversea,
  }
}

// 企业数据浏览器
export const getCompanyDataBrowserItem = (): IFuncMenuItem => {
  return {
    id: '259750',
    zh: '企业数据浏览器',
    url: getUrlByLinkModule(LinksModule.DATA_BROWSER),
    desc: '200+维度精准识别目标企业',
    css: 'stboard-icon top-func-icon',
    hot: true,
    icon: 'QYSJLLQ',
  }
}

// 企业数据API
export const getCompanyDataApiItem = ({ isTerminal, isEnUS }: IEnvParams): IFuncMenuItem => {
  const isOversea = wftCommon.is_overseas_config
  return {
    id: '396015',
    zh: '企业数据API',
    url: `//wx.wind.com.cn/wind.ent.openapi/index.html`,
    css: 'api-icon',
    icon: 'EAPI',
    navigate: (item: IFuncMenuItem) => {
      window.open(item.url)
    },
    disabled: isEnUS || !isTerminal || isOversea,
  }
}

// 企业动态
export const getCompanyDynamicsItem = ({ isEnUS }: IEnvParams): IFuncMenuItem => {
  const isOversea = wftCommon.is_overseas_config
  return {
    id: '248131',
    zh: '企业动态',
    url: '#/companyDynamic?keyMenu=2&nosearch=1',
    css: 'dynamic-icon',
    hot: true,
    icon: 'QYDT',
    desc: '近况速览，掌握关键动态',
    disabled: isEnUS || isOversea,
  }
}
