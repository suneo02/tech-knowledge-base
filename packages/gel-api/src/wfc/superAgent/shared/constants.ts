/**
 * SuperAgent 模块相关常量
 */

/**
 * 任务相关 API 路径常量（不带前导斜杠，保持与其它模块一致）
 */
export const SUPER_AGENT_API_PATHS = {
  GET_TASK_LIST: 'superlist/excel/splAgentTaskList',
  SUBMIT_TASK: 'superlist/excel/splAgentSubmitTask',
  GET_TASK_DETAIL: 'superlist/excel/splAgentTaskDetail',
  TERMINATE_TASK: 'superlist/excel/splAgentTaskTerminate',
  RETRY_TASK: 'superlist/excel/splAgentTaskRetry',
  GET_LATEST_MINING_INFO: 'superlist/excel/splAgentLatestMiningInfo',
  GET_AREA_CODE_BY_COMPANY_CODE: 'superlist/excel/splAgentGetAreaCodeByCompanyCode',
} as const
