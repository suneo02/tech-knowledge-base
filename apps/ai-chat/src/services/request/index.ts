import { isDev } from '@/utils/env'
import { local } from '@/utils/storage'

/**
 * 获取基础请求地址
 */
export const getBaseUrl = () => {
  const ev = local.get('mainEnv')

  return isDev ? `${ev?.proxy}` : ''
}
