import { message } from '@wind/wind-ui'
import { WindSessionHeader } from 'gel-api'
import { useState } from 'react'
import { loaclDevManager } from '../utils/storage'

export const useEnvConfig = () => {
  const [apiPrefixDev, setApiPrefixDev] = useState<string | undefined>(
    loaclDevManager.get('GEL_API_PREFIX_DEV') ?? undefined
  )
  const [sessionIdDev, setSessionIdDev] = useState<string | undefined>(
    loaclDevManager.get(WindSessionHeader) ?? undefined
  )

  const handleSaveDevConfig = () => {
    if (sessionIdDev && apiPrefixDev) {
      loaclDevManager.set(WindSessionHeader, sessionIdDev)
      loaclDevManager.set('GEL_API_PREFIX_DEV', apiPrefixDev)
      message.success(`会话ID配置已保存，页面将在1秒后刷新...`)
      // 延迟1秒后刷新页面，让用户看到提示信息
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } else {
      if (sessionIdDev) {
        message.warning('请至少选择一个会话ID')
      } else {
        message.warning('请至少选择一个API前缀')
      }
    }
  }

  return {
    apiPrefixDev,
    sessionIdDev,
    setApiPrefixDev,
    setSessionIdDev,
    handleSaveDevConfig,
  }
}
