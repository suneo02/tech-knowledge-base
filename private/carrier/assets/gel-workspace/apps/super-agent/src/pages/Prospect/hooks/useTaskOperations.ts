import { useRequest } from 'ahooks'
import { splAgentTaskRetry, splAgentTaskTerminate } from '../services'
import { postPointBuried, SUPER_AGENT_BURY_POINTS } from '@/utils/bury'

export const useTaskOperations = (onRetrySuccess?: () => void) => {
  const {
    loading: retryLoading,
    run: retryRun,
    runAsync: retryRunAsync,
  } = useRequest(splAgentTaskRetry, {
    manual: true,
    onSuccess: (res) => {
      // 只要 Data 字段存在且不是 false/null，或者根据 WFC 接口约定判断成功
      // 通常 requestToWFC 返回的结构中，如果没有异常抛出，一般就是成功的
      // 这里根据实际返回类型做个简单判断，或者直接回调
      if (res) {
        setTimeout(() => {
          onRetrySuccess?.()
        }, 3000)
      }
    },
  })

  const {
    loading: terminateLoading,
    run: terminateRun,
    runAsync: terminateRunAsync,
  } = useRequest(splAgentTaskTerminate, {
    manual: true,
    onSuccess: (res) => {
      // 只要 Data 字段存在且不是 false/null，或者根据 WFC 接口约定判断成功
      // 通常 requestToWFC 返回的结构中，如果没有异常抛出，一般就是成功的
      // 这里根据实际返回类型做个简单判断，或者直接回调
      if (res) {
        setTimeout(() => {
          onRetrySuccess?.()
        }, 3000)
      }
    },
  })

  const handleBuriedAction = (action: string, taskId?: number) => {
    postPointBuried(SUPER_AGENT_BURY_POINTS.DRILLING_OPERATION, {
      action,
      taskId,
    })
  }

  return {
    retryRun,
    retryRunAsync,
    terminateRun,
    terminateRunAsync,
    retryLoading,
    terminateLoading,
    handleBuriedAction,
  }
}
