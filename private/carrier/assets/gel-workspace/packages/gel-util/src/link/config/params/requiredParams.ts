/**
 * 必填参数配置与校验
 *
 * 定义各模块的必填参数，并提供运行时校验函数
 *
 * @see ../../../docs/link-config-design.md 设计文档
 */

import { GetLinkParams } from '@/link/type'
import { LinkModule } from '../linkModule'
import { LinkParams } from './facade'

/**
 * 定义每个模块必须包含的参数
 * 如果模块没有必须的参数，则设置为空数组
 */
export const requiredParamsConfig: Partial<{
  [K in LinkModule]: Array<K extends keyof LinkParams ? keyof LinkParams[K] : string>
}> = {
  [LinkModule.GROUP]: ['id'],
  [LinkModule.GROUP_SEARCH]: [],
  [LinkModule.CDE_SEARCH]: [],
  [LinkModule.FEATURED_COMPANY]: ['id'],
  [LinkModule.COMPANY_DETAIL]: ['companycode'],
}

/**
 * 检查参数是否包含必须的字段
 * @param module 链接模块
 * @param params 参数对象
 * @returns 是否包含所有必须的参数
 */
export function checkRequiredParams<T extends LinkModule>(module: T, params: GetLinkParams<T> | undefined): boolean {
  try {
    // 如果 module 没有该配置
    if (!requiredParamsConfig[module]) {
      return true
    }

    if (!params) {
      // 如果没有参数，但模块有必须参数，则返回 false
      return requiredParamsConfig[module].length === 0
    }

    // 检查所有必须的参数是否存在且有值
    return requiredParamsConfig[module].every((param) => {
      const key = param as keyof typeof params
      return params[key] !== undefined && params[key] !== null && params[key] !== ''
    })
  } catch (e) {
    console.error(e)
    return false
  }
}
