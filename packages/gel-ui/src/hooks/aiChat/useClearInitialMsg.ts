import { useEffect } from 'react'
import { initialMessageKeyMap } from './useInitialMsgFromUrl'

export const useClearInitialMsgWithSearchParams = (
  initialMessage: string | null,
  searchParams: URLSearchParams,
  setSearchParams: (
    nextInit?: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams),
    navigateOpts?: {
      replace?: boolean
    }
  ) => void
) => {
  // 立即清除 URL 参数，避免页面刷新导致重复处理
  useEffect(() => {
    if (initialMessage) {
      const newSearchParams = new URLSearchParams(searchParams)
      if (
        newSearchParams.has(initialMessageKeyMap.initialMsg) ||
        newSearchParams.has(initialMessageKeyMap.initialDeepthink) ||
        newSearchParams.has(initialMessageKeyMap.initialFiles) ||
        newSearchParams.has(initialMessageKeyMap.initialRefFiles)
      ) {
        newSearchParams.delete(initialMessageKeyMap.initialMsg)
        newSearchParams.delete(initialMessageKeyMap.initialDeepthink)
        newSearchParams.delete(initialMessageKeyMap.initialFiles)
        newSearchParams.delete(initialMessageKeyMap.initialRefFiles)
        setSearchParams(newSearchParams, { replace: true })
      }
    }
  }, [initialMessage, searchParams, setSearchParams])
}
