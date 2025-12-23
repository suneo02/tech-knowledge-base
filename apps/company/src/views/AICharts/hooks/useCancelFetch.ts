import { useCallback } from 'react'
import { useAIChartData } from './useChartData'

function useCancelFetch() {
  const { abortControllerRef } = useAIChartData()

  const handleStartFetch = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const abortController = new AbortController()
    abortControllerRef.current = abortController
  }, [])

  const handleCancelFetch = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  return {
    handleStartFetch,
    handleCancelFetch,
  }
}

export default useCancelFetch
