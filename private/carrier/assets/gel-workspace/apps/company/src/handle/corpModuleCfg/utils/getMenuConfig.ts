import { isDev } from '@/utils/env'
import { message } from '@wind/wind-ui'
import { TCorpDetailSubModule } from 'gel-types'

/**
 * 创建菜单配置获取函数
 * @param menuMap - showModule 到配置的映射
 * @param moduleName - 模块名称（用于错误提示）
 * @returns 获取菜单配置的函数
 */
export const createGetMenuConfig = <T>(menuMap: Map<TCorpDetailSubModule, T>, moduleName: string) => {
  return (showModule: TCorpDetailSubModule): T => {
    const config = menuMap.get(showModule)

    if (!config) {
      const errorMsg = `${moduleName} menu config not found for showModule: ${showModule}`

      // 始终输出 console error
      console.error(errorMsg)

      // 在开发模式下显示 message error
      if (isDev) {
        message.error(errorMsg)
      }

      // 返回一个空对象，避免程序崩溃
      return {} as T
    }

    return config
  }
}
