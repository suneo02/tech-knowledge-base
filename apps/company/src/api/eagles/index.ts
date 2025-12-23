import { getWsid } from '@/utils/env'
import { usedInClient } from '@/utils/env/misc'
import axios from 'axios'
import { eaglesError as gelEaglesError } from 'gel-util/errorLogger'

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
 * 主入口异常记录
 * 记录以下信息:
 * 1. 当前报错页面完整地址
 * 2. 用户权限包信息（packageName、region、isForeign、terminalType）
 * 3. 报错的组件上下文
 * 4. 其他系统信息
 * ...
 */
export const eaglesError = async (error: any): Promise<void> => {
  const instance = eaglesAxios()
  gelEaglesError(instance, error)
}
