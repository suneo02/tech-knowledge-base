/**
 * 任务状态
 * 1-排队 2-进行中 3-成功 4-失败 5-终止
 */
export const TaskStatus = {
  PENDING: 1,
  RUNNING: 2,
  SUCCESS: 3,
  FAILED: 4,
  TERMINATED: 5,
}
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus]
/**
 * 列表查询 - 请求
 */
export interface GetTaskListRequest {
  status?: TaskStatus
  pageNum: number
  pageSize: number
}

/**
 * 列表查询 - 响应数据项
 */
export interface TaskListItem {
  taskId: number
  taskName: string
  areaCode: string
  status: TaskStatus
  createTime: string
}

/**
 * 列表查询 - 响应
 */
export interface GetTaskListResponse {
  tasks: TaskListItem[]
}

/**
 * 提交任务 - 请求
 */
export interface SubmitTaskRequest {
  companyCode: string
  areaCodes: string[]
  productDesc?: string
}

/**
 * 提交任务 - 响应
 */
export interface SubmitTaskResponse {
  groupId: string
  taskIds: number[]
}

/**
 * 任务详情 - 请求
 */
export interface GetTaskDetailRequest {
  taskId: number
}

/**
 * 任务详情 - 当前任务日志
 */
export interface TaskLogItem {
  time: string
  content: string
}

/**
 * 任务详情 - 当前任务
 */
export interface CurrentTaskDetail {
  taskId: number
  taskName: string
  areaCode: string
  status: TaskStatus
  progress: number
  customerCount: number
  logs: TaskLogItem[]
  createTime: string
  sheetId: number
  pagingRestricted: boolean // 是否限制翻页
  totalCandidateCount: number // 总挖掘客户数
}

/**
 * 任务详情 - 分组任务列表项
 */
export interface GroupTaskItem {
  taskId: number
  taskName: string
  areaCode: string
  status: TaskStatus
  progress: number
  customerCount: number
}

/**
 * 任务详情 - 响应
 */
export interface GetTaskDetailResponse {
  currentTask: CurrentTaskDetail
  groupTasks: GroupTaskItem[]
}

/**
 * 终止任务 - 请求
 */
export interface TerminateTaskRequest {
  taskId: number
}

/**
 * 重试任务 - 请求
 */
export interface RetryTaskRequest {
  taskId: number
}

/**
 * 最新挖掘信息 - 请求
 */
export interface GetLatestMiningInfoRequest {}

/**
 * 最新挖掘信息 - 响应
 * 具体结构由后端返回决定，这里使用 unknown 以保持类型安全
 */
export type GetLatestMiningInfoResponse = unknown

/**
 * 通过企业找地区 - 请求
 */
export interface GetAreaCodeByCompanyCodeRequest {
  companycode: number
}

/**
 * 通过企业找地区 - 响应
 * 具体结构由后端返回决定，这里使用 unknown 以保持类型安全
 */
export interface GetAreaCodeByCompanyCodeResponse {
  data: string
}
