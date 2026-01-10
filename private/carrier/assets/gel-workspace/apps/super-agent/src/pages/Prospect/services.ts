import { requestToWFC } from '@/api'

/** 获取任务详情 */
export const splAgentTaskDetail = (taskId: number) => 
  requestToWFC('superlist/excel/splAgentTaskDetail', { taskId })

/** 重试挖掘任务 */
export const splAgentTaskRetry = (taskId: number) => 
  requestToWFC('superlist/excel/splAgentTaskRetry', { taskId })

/** 终止任务 */
export const splAgentTaskTerminate = (taskId: number) => 
  requestToWFC('superlist/excel/splAgentTaskTerminate', { taskId })
