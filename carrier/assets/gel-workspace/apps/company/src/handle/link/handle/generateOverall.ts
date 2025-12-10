import {
  generateCommonLink,
  getCompanyLink,
  getCompanyNewLink,
  getDataBrowserLink,
  getIntellectualBySubModule,
  getKgLinkBySubModule,
  getMiscDetailBySubModule,
  getPatentDetailByUrl,
  getPrefixUrl,
  getScenarioApplicationLinkBySubModule,
  getSearchLinkBySubModule,
  getUserLinkBySubModule,
  getVipLinkBySubModule,
  getWebLinkBySubModule,
  LinksModule,
  getAIGraphLink,
} from '@/handle/link'
import { TLinkOptions } from '@/handle/link/handle/type.ts'
import { getBidDetailUrl } from '@/handle/link/module/miscDetail/bid.ts'
import { getStandardDetailByUrl } from '@/handle/link/module/miscDetail/standard.ts'
import { getSpecialCompanyListLinkBySubModule } from '@/handle/link/module/qulification/SpecialCompanyList.ts'

/**
 * 根据链接模块类型生成对应的跳转链接
 *
 * @param {LinksModule} module - 链接模块类型，定义在 linksModule.ts 中
 * @param {TLinkOptions} [optionsProp] - 链接生成选项
 * @param {string} [optionsProp.subModule] - 子模块类型，用于特定模块的子页面跳转
 * @param {string} [optionsProp.id] - 详情页的唯一标识
 * @param {string} [optionsProp.target] - 目标标识，用于特定场景的跳转
 * @param {string} [optionsProp.type] - 类型标识，用于区分不同种类的详情页
 * @param {string} [optionsProp.value] - 值，用于数据浏览器等场景
 * @param {ReactNode} [optionsProp.title] - 标题，用于数据浏览器等场景
 * @param {string} [optionsProp.extraId] - 额外ID，用于特定场景的关联
 * @param {string} [optionsProp.url] - 外部链接地址
 * @param {boolean} [optionsProp.ifOversea] - 是否为海外版本
 * @param {string} [optionsProp.standardLevelCode] - 标准等级代码
 * @param {Record<string, string | number>} [optionsProp.params] - URL参数对象
 * @param {TGelEnv} [optionsProp.env] - 环境标识，用于区分不同环境(web/terminal/local)
 *
 * @returns {string|null} 返回生成的链接字符串，如果没有找到对应的链接或参数无效，则返回null
 *
 * @example
 * // 生成公司详情页链接
 * const companyUrl = getUrlByLinkModule(LinksModule.COMPANY, {
 *   id: '12345',
 *   env: 'web'
 * });
 *
 * // 生成专利详情页链接
 * const patentUrl = getUrlByLinkModule(LinksModule.PATENT, {
 *   id: '67890',
 *   type: 'invention',
 *   env: 'web'
 * });
 *
 * // 生成数据浏览器链接
 * const browserUrl = getUrlByLinkModule(LinksModule.DATA_BROWSER, {
 *   value: '示例公司',
 *   type: 'company',
 *   env: 'web'
 * });
 */
export const getUrlByLinkModule = (module: LinksModule, optionsProp?: TLinkOptions): string => {
  let options: TLinkOptions = optionsProp
  if (options == null) {
    options = {}
  }
  const {
    subModule,
    url,
    id,
    params,
    env,
    target,
    type,
    value,
    title,
    extraId,
    ifOversea,
    standardLevelCode,
    isSeparate,
  } = options
  if (!module) {
    return null
  }
  switch (module) {
    case LinksModule.GROUP:
    case LinksModule.CHARACTER:
    case LinksModule.FEATURED:
    case LinksModule.IC_LAYOUT:
    case LinksModule.QUALIFICATION_DETAIL: {
      if (!id) {
        // 没有 id 则不跳转
        return
      }
      return generateCommonLink({ module, params: { ...params, id }, env })
    }
    case LinksModule.FEATURED_LIST:
      if (!id && !params?.search) {
        // 没有 id 且没有 search 则不跳转
        return
      }
      return generateCommonLink({ module, params, env })
    case LinksModule.SPECIAL_CORP:
      return getSpecialCompanyListLinkBySubModule({ subModule, params, env })
    case LinksModule.COMPANY:
      return getCompanyLink({ id, target, params, env })
    case LinksModule.CompanyNew:
      return getCompanyNewLink({ id, target, params, env })
    case LinksModule.DATA_BROWSER:
      return getDataBrowserLink({ value, title, type, params, env })
    case LinksModule.JOB:
      return generateCommonLink({
        module,
        params: {
          ...params,
          type: 'jobs',
          detailid: id,
          jobComCode: extraId,
        },
        env,
      })
    case LinksModule.PRODUCT:
      return generateCommonLink({
        module,
        params: {
          ...params,
          type: 'product',
          detailid: id,
        },
        env,
      })
    /** 风控 */
    case LinksModule.RISK:
      return id && type ? `${getPrefixUrl()}index.html#/lawdetail?reportName=${type}&id=${id}` : null
    /** 知识产权 */
    case LinksModule.INTELLECTUAL: {
      return getIntellectualBySubModule({ subModule, id, params, standardLevelCode, type, env })
    }
    case LinksModule.STANDARD_DETAIL:
      return getStandardDetailByUrl({ id, params, standardLevelCode, type, env })
    case LinksModule.PATENT:
      return getPatentDetailByUrl({ id, params, type, env })
    case LinksModule.MISC_DETAIL: {
      return getMiscDetailBySubModule({ subModule, id, params, env })
    }
    case LinksModule.BID:
      return getBidDetailUrl({ id, params, env })

    case LinksModule.SEARCH: {
      return getSearchLinkBySubModule({ subModule, params, env })
    }

    case LinksModule.KG: {
      return getKgLinkBySubModule({ subModule, params, env })
    }
    case LinksModule.USER: {
      return getUserLinkBySubModule({ subModule, params, env })
    }
    case LinksModule.SCENARIO_APPLICATION:
      return getScenarioApplicationLinkBySubModule({ subModule, params, env })
    case LinksModule.VIP:
      return getVipLinkBySubModule({ params, ifOversea, env })
    case LinksModule.HOME:
      return generateCommonLink({ module, params: { ...params, isSeparate: isSeparate ? 1 : '' }, env })
    case LinksModule.GRAPH_AI:
      return getAIGraphLink({ params, env })
    case LinksModule.LOGIN:
      return `${getPrefixUrl({ isLoginIn: true, envParam: env })}windLogin.html`
    default:
      return generateCommonLink({ module, params, env })
  }
}
