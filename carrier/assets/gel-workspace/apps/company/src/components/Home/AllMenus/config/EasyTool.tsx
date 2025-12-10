import {
  BaiFenSites,
  GELSearchParam,
  getUrlByLinkModule,
  LinksModule,
  ScenarioApplicationLinkEnum,
} from '@/handle/link'
import { getWebAISuperListLinkWithIframe } from '@/handle/link/WebAI'
import { IEnvParams, isDev } from '@/utils/env'
import { wftCommon } from '@/utils/utils'
import { t } from 'gel-util/intl'
import { IFuncMenuItem } from '../type'
import { getGapCompatTransformer } from 'gel-ui'
import { generateUrlByModule, LinkModule } from 'gel-util/link'

// 批量查询导出
export const getBatchQueryExportItem = (): IFuncMenuItem => {
  return {
    id: '422040',
    zh: t('422040', '批量查询导出'),
    url: getUrlByLinkModule(LinksModule.SCENARIO_APPLICATION, {
      subModule: ScenarioApplicationLinkEnum.BATCH_OUTPUT,
    }),
    desc: t('338365', '工作效能提升好助手'),
    css: 'batch-output-icon',
    hot: true,
    icon: 'PLCXDC',
  }
}

// 报告平台
export const getReportPlatformItem = (): IFuncMenuItem => ({
  id: '417591',
  zh: t('417591', '报告平台'),
  url: getUrlByLinkModule(LinksModule.REPORT_HOME, {
    params: {
      [GELSearchParam.NoSearch]: 1,
    },
  }),
  desc: t('422036', '智能生成企业分析报告'),
  css: 'ddPlatform-icon top-beta-icon',
  // new: true,
  icon: 'JDPT',
})

// 企业数据浏览器
export const getCompanyDataBrowserItem = (): IFuncMenuItem => {
  return {
    id: '259750',
    zh: t('259750', '企业数据浏览器'),
    url: getUrlByLinkModule(LinksModule.DATA_BROWSER),
    desc: t('338371', '200+维度精准识别目标企业'),
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
    disabled: !isTerminal || isOversea,
  }
}

// 企业动态
export const getCompanyDynamicsItem = ({ isEnUS }: IEnvParams): IFuncMenuItem => {
  const isOversea = wftCommon.is_overseas_config
  console.log(
    'getCompanyDynamicsItem',
    generateUrlByModule({
      module: LinkModule.COMPANY_DYNAMIC,
      params: { keyMenu: 2, nosearch: 1 },
    })
  )
  return {
    id: '248131',
    zh: t('248131', '企业动态'),
    url: generateUrlByModule({
      module: LinkModule.COMPANY_DYNAMIC,
      params: { keyMenu: 2, nosearch: 1 },
    }),
    css: 'dynamic-icon',
    hot: true,
    icon: 'QYDT',
    desc: t('433795', '近况速览，掌握关键动态'),
    disabled: isEnUS || isOversea,
  }
}

// 智能财报诊断
export const getAiFinancialItem = ({ isEnUS, isTerminal }: IEnvParams): IFuncMenuItem => {
  const isOversea = wftCommon.is_overseas_config
  return {
    id: '',
    zh: t('', '智能财报诊断'),
    url: BaiFenSites().reportAnalysis,
    css: 'ai-financial-icon',
    hot: true,
    icon: 'AIFINANCIAL',
    desc: t('', '智能财报诊断'),
    disabled: !isTerminal || isEnUS || isOversea,
  }
}

// 超级名单
export const getSuperItem = (): IFuncMenuItem => {
  const isOversea = wftCommon.is_overseas_config
  return {
    id: '464234',
    zh: t('464234', '一句话找企业'),
    url: generateUrlByModule({
      module: LinkModule.SUPER,
      isDev,
    }),
    css: 'ai-financial-icon',
    new: true,
    icon: 'SUPER',
    desc: t('464234', '一句话找企业'),
    disabled: isOversea,
  }
}
