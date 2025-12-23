import { localStorageManager } from '@/storage'
import { AxiosInstance } from 'axios'
import { usedInClient } from '../env'
import { formatTime } from '../format'

// 错误日志参数接口
interface ErrorLogParams {
  name: string
  reason: string
}

/**
 * 构建错误原因字符串
 * @param error - 错误对象
 * @param context - 错误上下文信息（可选）
 * @returns 格式化的错误原因字符串
 */
export const buildErrorReason = (error: unknown): string => {
  const timestamp = formatTime(new Date().toString())
  const userPackageInfo = localStorageManager.get('globaluserpackage4gel')

  return `
      页面地址：${window.location.href}    
      时间：${timestamp}
      用户权限包信息：${JSON.stringify(userPackageInfo)}
      系统：${navigator.userAgent}
      报错上下文：${JSON.stringify(error)}    `
}

/**
 * 获取错误日志基础URL
 * @returns 基础URL
 */
const getBaseUrl = (): string => {
  const host = window.location.host
  const isTestEnvironment = host.indexOf('8.173') > -1 || host.indexOf('test.wind.') > -1
  return `https://${isTestEnvironment ? 'test' : 'gel'}.wind.com.cn`
}

/**
 * 主入口异常记录
 * 记录以下信息:
 * 1. 当前报错页面完整地址
 * 2. 用户权限包信息（packageName、region、isForeign、terminalType）
 * 3. 报错的组件上下文
 * 4. 其他系统信息
 */
export const eaglesError = async (axiosEntWeb: AxiosInstance, error: unknown): Promise<void> => {
  try {
    // 非生产环境不记录，否则产生大量日志
    if (process.env.NODE_ENV !== 'production') return

    const is_terminal = usedInClient()
    const name = is_terminal ? 'WFT PC' : 'WEB PC'
    const reason = buildErrorReason(error)
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}/wind.ent.web/openapi/eaglesLog`

    const logParams: ErrorLogParams = {
      name,
      reason,
    }
    await axiosEntWeb.post(url, logParams)
  } catch (e) {
    console.error('Eagles error:', e)
  }
}
