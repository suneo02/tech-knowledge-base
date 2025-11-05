import { HTMLPath } from '../constant'
import { GELService, generatePrefixUrl } from '../handle/prefixUrl'
import { LinkModule } from './linkModule'
import { BaseModuleConfig } from './type'

// 默认配置
export const DEFAULT_HTML_PATH = HTMLPath.index

// 配置实现 - 使用 const assertion 确保类型推导为字面量类型
export const getLinkConfigMap = (isDev: boolean): Record<LinkModule, BaseModuleConfig> =>
  ({
    [LinkModule.USER_CENTER]: {
      hash: 'customer',
      appendParamsToHash: true,
    },
    [LinkModule.GQCT_CHART]: {
      hash: 'gqctChart',
      envConfig: {
        local: {
          origin: 'https://wx.wind.com.cn',
          prefixPath: generatePrefixUrl({
            envParam: 'terminal',
            isDev,
          }),
        },
      },
    },
    [LinkModule.BENEFICIAL_CHART]: {
      hash: 'beneficialChart',
      envConfig: {
        local: {
          origin: 'https://wx.wind.com.cn',
          prefixPath: generatePrefixUrl({
            envParam: 'terminal',
            isDev,
          }),
        },
      },
    },
    [LinkModule.CORRELATION_CHART]: {
      hash: 'glgxChart',
      envConfig: {
        local: {
          origin: 'https://wx.wind.com.cn',
          prefixPath: generatePrefixUrl({
            envParam: 'terminal',
            isDev,
          }),
        },
      },
    },
    [LinkModule.ACTUAL_CONTROLLER_CHART]: {
      hash: 'actCtrlChart',
      envConfig: {
        local: {
          origin: 'https://wx.wind.com.cn',
          prefixPath: generatePrefixUrl({
            envParam: 'terminal',
            isDev,
          }),
        },
      },
    },
    [LinkModule.KG_PLATFORM]: {
      hash: 'graph',
      envConfig: {
        local: {
          origin: 'https://wx.wind.com.cn',
          prefixPath: generatePrefixUrl({
            envParam: 'terminal',
            isDev,
          }),
        },
      },
    },

    [LinkModule.COMPANY_DETAIL]: {
      hash: '',
      envConfig: {
        local: {
          origin: 'https://gel.wind.com.cn',
          prefixPath: generatePrefixUrl({
            envParam: 'web',
            isDev,
          }),
        },
      },
    },
    [LinkModule.WINDCODE_2_F9]: {
      hash: '',
    },
    [LinkModule.DDRP_PREVIEW]: {
      hash: 'ddrp',
      prefixPath: generatePrefixUrl({
        service: GELService.ReportPreview,
        isDev,
      }),
    },
    [LinkModule.DDRP_PRINT]: {
      hash: 'ddrp',
      prefixPath: generatePrefixUrl({
        service: GELService.ReportPrint,
        isDev,
      }),
    },
    [LinkModule.CREDIT_RP_PREVIEW]: {
      hash: 'creditrp',
      prefixPath: generatePrefixUrl({
        service: GELService.ReportPreview,
        isDev,
      }),
    },
    [LinkModule.CREDIT_RP_PRINT]: {
      hash: 'creditrp',
      prefixPath: generatePrefixUrl({
        service: GELService.ReportPrint,
        isDev,
      }),
    },
  }) as const
