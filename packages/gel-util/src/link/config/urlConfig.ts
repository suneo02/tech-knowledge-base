/**
 * 链接配置映射
 *
 * 定义所有业务模块的 URL 配置，包括 hash、路径前缀、环境配置等
 *
 * @see ../../docs/link-config-design.md 设计文档
 */

import { GELSearchParam, HTMLPath, WX_WIND_HOST } from '../constant'
import { GELService, generatePrefixUrl } from '../prefixUrl'
import { LinkModule } from './linkModule'
import { BaseModuleConfig } from './type'

// 默认配置
export const DEFAULT_HTML_PATH = HTMLPath.index

// 配置实现 - 使用 const assertion 确保类型推导为字面量类型
export const getLinkConfigMap = (isDev: boolean): Record<LinkModule, BaseModuleConfig> =>
  ({
    [LinkModule.GROUP]: {
      hash: 'newGroup',
      appendParamsToHash: true,
    },
    [LinkModule.CDE_SEARCH]: {
      hash: 'findCustomer',
      envConfig: {
        local: {
          origin: 'https://gel.wind.com.cn',
          prefixPath: generatePrefixUrl({
            envParam: 'web',
            isDev,
          }),
        },
      },
      appendParamsToHash: true,
    },
    [LinkModule.FEATURED_COMPANY]: {
      hash: 'feturedcompany',
      appendParamsToHash: true,
    },
    [LinkModule.USER_CENTER]: {
      hash: 'customer',
      appendParamsToHash: true,
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
    [LinkModule.GQCT_CHART]: {
      hash: 'gqctChart',
      envConfig: {
        local: {
          origin: `https://${WX_WIND_HOST}`,
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
          origin: `https://${WX_WIND_HOST}`,
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
          origin: `https://${WX_WIND_HOST}`,
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
          origin: `https://${WX_WIND_HOST}`,
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
          origin: 'https://gel.wind.com.cn',
          prefixPath: generatePrefixUrl({
            envParam: 'web',
            isDev,
          }),
        },
      },
    },

    [LinkModule.COMPANY_DETAIL]: {
      hash: '',
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
    [LinkModule.VIP_CENTER]: {
      hash: 'versionPrice',
      defaultParams: {
        [GELSearchParam.NoSearch]: '1',
      },
    },
    [LinkModule.AI_CHAT]: {
      hash: 'chat',
      hashPathParam: 'chatId',
      prefixPath: generatePrefixUrl({
        service: GELService.AI,
        isDev,
      }),
    },
    [LinkModule.SUPER_LIST_CHAT]: {
      hash: 'super/chat',
      hashPathParam: 'chatId',
      prefixPath: generatePrefixUrl({
        service: GELService.AI,
        isDev,
      }),
    },
    [LinkModule.SUPER]: {
      hash: 'super',
      prefixPath: generatePrefixUrl({
        service: GELService.AI,
        isDev,
      }),
      envConfig: {
        local: {
          origin: 'https://gel.wind.com.cn',
          prefixPath: generatePrefixUrl({
            envParam: 'web',
            service: GELService.AI,
            isDev,
          }),
        },
      },
    },
    [LinkModule.SUPER_DOWNLOAD]: {
      hash: 'super/my-file',
      prefixPath: generatePrefixUrl({
        service: GELService.AI,
        isDev,
      }),
      envConfig: {
        local: {
          origin: 'https://gel.wind.com.cn',
          prefixPath: generatePrefixUrl({
            envParam: 'web',
            service: GELService.AI,
            isDev,
          }),
        },
      },
    },
    [LinkModule.CREDIT]: {
      hash: 'credits',
      prefixPath: generatePrefixUrl({
        service: GELService.AI,
        isDev,
      }),
      envConfig: {
        local: {
          origin: 'https://gel.wind.com.cn',
          prefixPath: generatePrefixUrl({
            envParam: 'web',
            service: GELService.AI,
            isDev,
          }),
        },
      },
    },
    [LinkModule.AI_REPORT_HOME]: {
      hash: 'home',
      prefixPath: generatePrefixUrl({
        service: GELService.ReportAI,
        isDev,
      }),
    },
    [LinkModule.AI_REPORT_OUTLINE_CHAT]: {
      hash: 'chat',
      hashPathParam: 'chatId',
      prefixPath: generatePrefixUrl({
        service: GELService.ReportAI,
        isDev,
      }),
    },
    [LinkModule.AI_REPORT_DETAIL]: {
      hash: 'reportdetail',
      hashPathParam: 'reportId',
      prefixPath: generatePrefixUrl({
        service: GELService.ReportAI,
        isDev,
      }),
    },
    [LinkModule.SEARCH_HOME]: {
      hash: 'SearchHome',
      envConfig: {
        local: {
          origin: 'https://gel.wind.com.cn',
          prefixPath: generatePrefixUrl({
            envParam: 'web',
            isDev,
          }),
        },
      },
      appendParamsToHash: true,
    },
    [LinkModule.GLOBAL_SEARCH]: {
      hash: 'searchPlatform/GlobalSearch',
    },
    [LinkModule.GROUP_SEARCH]: {
      hash: 'searchPlatform/SearchGroupDepartment',
    },
    [LinkModule.BID_SEARCH]: {
      hash: 'searchBidNew',
    },
    [LinkModule.JOB_SEARCH]: {
      hash: 'searchJob',
    },
    [LinkModule.PATENT_SEARCH]: {
      hash: 'searchPlatform/SearchPatent',
    },
    [LinkModule.TRADEMARK_SEARCH]: {
      hash: 'searchPlatform/SearchBrand',
    },
    [LinkModule.FEATURED_SEARCH]: {
      hash: 'searchPlatform/SearchFetured', // 之前的人拼错了，之后要改 SearchFeatured
    },
    [LinkModule.COMPANY_DYNAMIC]: {
      hash: 'companyDynamic',
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
    [LinkModule.SPECIAL_LIST]: {
      hash: 'specialAppList',
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
    [LinkModule.QUALIFICATIONS]: {
      hash: 'qualifications',
      appendParamsToHash: true,
    },
    [LinkModule.RELATED_LINK]: {
      hash: 'relatedlinks',
      envConfig: {
        local: {
          origin: 'https://gel.wind.com.cn',
          prefixPath: generatePrefixUrl({
            envParam: 'web',
            isDev,
          }),
        },
      },
      appendParamsToHash: true,
    },
    [LinkModule.REPORT_PLATFORM]: {
      hash: 'report',
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
    [LinkModule.INNER_PAGE]: {
      hash: 'innerlinks',
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
    [LinkModule.SEARCH]: {
      hash: 'globalSearch',
      appendParamsToHash: true,
    },
    [LinkModule.WANXUN_MAP]: {
      hash: '',
      // 万寻地图不需要带上 WFC/PC.Front 前缀，直接使用根路径下的 govmap
      prefixPath: GELService.GovMap,
      envConfig: {
        local: {
          origin: `https://${WX_WIND_HOST}`,
          // 本地环境同样保持不带 WFC/PC.Front 前缀
          prefixPath: GELService.GovMap,
        },
      },
    },
    [LinkModule.EAPI]: {
      hash: '',
      prefixPath: GELService.EAPI,
      envConfig: {
        local: {
          origin: 'https://gel.wind.com.cn',
          prefixPath: generatePrefixUrl({
            service: GELService.EAPI,
            envParam: 'web',
            isDev,
          }),
        },
      },
    },
    [LinkModule.SUPER_AGENT]: {
      hash: '',
      prefixPath: generatePrefixUrl({
        service: GELService.Agent,
        isDev,
      }),
      envConfig: {
        local: {
          origin: 'http://10.100.244.96:3088/',
          prefixPath: generatePrefixUrl({
            service: GELService.Agent,
            envParam: 'web',
            isDev,
          }),
        },
      },
    },
  }) as const
