import { ApiResponseForWFC } from '@/types'
import { SUPER_AGENT_API_PATHS } from '../../shared/constants'
import {
  GetTaskDetailRequest,
  GetTaskDetailResponse,
  GetTaskListRequest,
  GetTaskListResponse,
  RetryTaskRequest,
  SubmitTaskRequest,
  SubmitTaskResponse,
  TerminateTaskRequest,
} from './types'

/**
 * SuperAgent 任务领域 API 路径映射
 */
export interface SuperAgentTaskApiPathMap {
  [SUPER_AGENT_API_PATHS.GET_TASK_LIST]: {
    data: GetTaskListRequest
    response: ApiResponseForWFC<GetTaskListResponse>
  }
  [SUPER_AGENT_API_PATHS.SUBMIT_TASK]: {
    data: SubmitTaskRequest
    response: ApiResponseForWFC<SubmitTaskResponse>
  }
  [SUPER_AGENT_API_PATHS.GET_TASK_DETAIL]: {
    data: GetTaskDetailRequest
    response: ApiResponseForWFC<GetTaskDetailResponse>
  }
  [SUPER_AGENT_API_PATHS.TERMINATE_TASK]: {
    data: TerminateTaskRequest
    response: ApiResponseForWFC<Record<string, never>>
  }
  [SUPER_AGENT_API_PATHS.RETRY_TASK]: {
    data: RetryTaskRequest
    response: ApiResponseForWFC<Record<string, never>>
  }
}
