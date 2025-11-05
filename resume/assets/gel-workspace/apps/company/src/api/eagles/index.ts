import { getWsid } from '@/utils/env'
import { NODE_ENV, usedInClient } from '@/utils/env/misc'
import { localStorageManager } from '@/utils/storage'
import { wftCommon } from '@/utils/utils'
import axios from 'axios'

// 错误日志参数接口
interface ErrorLogParams {
  name: string
  reason: string
}

// 创建专用的 axios 实例
const eaglesAxios = () => {
  return axios.create({
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      ...(!usedInClient() && {
        'wind.sessionid': getWsid(),
      }),
    },
  })
}

/**
 * 获取错误日志基础URL
 * @returns {stri ng} 基础URL
 */
const getBaseUrl = (): string => {
  const host = window.location.host
  const isTestEnvironment = host.indexOf('8.173') > -1 || host.indexOf('test.wind.') > -1
  return `https://${isTestEnvironment ? 'test' : 'gel'}.wind.com.cn`
}

/**
 * 构建错误原因字符串
 * @param {any} error - 错误对象
 * @returns {string} 格式化的错误原因字符串
 */
const buildErrorReason = (error: any): string => {
  const timestamp = wftCommon.formatTime(new Date()).toString()
  const userPackageInfo = localStorageManager.get('globaluserpackage4gel')

  return `
    页面地址：${window.location.href}    
    时间：${timestamp}
    用户权限包信息：${JSON.stringify(userPackageInfo)}
    系统：${navigator.userAgent}
    报错上下文：${JSON.stringify(error)}    `
}

/**
 * 主入口异常记录
 * 记录以下信息:
 * 1. 当前报错页面完整地址
 * 2. 用户权限包信息（packageName、region、isForeign、terminalType）
 * 3. 报错的组件上下文
 * 4. 其他系统信息
 * ...
 */
export const eaglesError = async (error: any): Promise<void> => {
  try {
    // 非生产环境不记录，否则产生大量日志
    if (NODE_ENV !== 'production') return

    const is_terminal = usedInClient()
    const name = is_terminal ? 'WFT PC' : 'WEB PC'
    const reason = buildErrorReason(error)
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}/wind.ent.web/openapi/eaglesLog`

    const logParams: ErrorLogParams = {
      name,
      reason,
    }
    const instance = eaglesAxios()
    await instance.post(url, logParams)
  } catch (e) {
    console.error('Eagles error:', e)
  }
}
