/**
 * SuperAgent 模块相关常量
 */

/**
 * 任务相关 API 路径常量（不带前导斜杠，保持与其它模块一致）
 */
export const SUPER_AGENT_API_PATHS = {
  GET_TASK_LIST: 'operation/get/splAgentTaskList',
  SUBMIT_TASK: 'operation/add/splAgentSubmitTask',
  GET_TASK_DETAIL: 'operation/get/splAgentTaskDetail',
  TERMINATE_TASK: 'operation/update/splAgentTaskTerminate',
  RETRY_TASK: 'operation/update/splAgentTaskRetry',
} as const

