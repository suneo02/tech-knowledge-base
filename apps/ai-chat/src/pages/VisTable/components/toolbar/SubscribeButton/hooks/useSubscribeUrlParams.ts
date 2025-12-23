import { getUrlSearchValue } from 'gel-util/common'
import { useEffect } from 'react'

interface UseSubscribeUrlParamsOptions {
  /** 查看订阅预览的回调 */
  onViewNews?: () => void
}

/**
 * 订阅URL参数管理 Hook
 * 专门负责处理订阅相关的URL参数逻辑
 */
export const useSubscribeUrlParams = ({ onViewNews }: UseSubscribeUrlParamsOptions) => {
  const subPush = getUrlSearchValue('subPush')

  useEffect(() => {
    if (subPush === 'true') {
      onViewNews?.()
    }
  }, [subPush])

  return {
    subPush,
  }
}
