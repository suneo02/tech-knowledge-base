import { ApiResponse } from '../types'

/**
 * 导出模板实体
 */
export interface ReportTemplate {
  id?: number
  /** 报告名称 */
  name?: string
  /** 设置 */
  setting?: Record<string, string>
  /** 类型：0-尽调报告，1-深度信用报告 */
  type?: ReportTypeEnum
}

export enum ReportTypeEnum {
  /** 尽调报告 */
  Report = 0,
  /** 深度信用报告 */
  Credit = 1,
}

export interface IdParams {
  id: React.Key
}

export interface TaskStatusResult {
  status: TaskStatusEnum
}

/**
 * 任务状态
 */
export enum TaskStatusEnum {
  /** 已创建 */
  Created = 0,
  /** 正在生成 */
  Generating = 1,
  /** 成功 */
  Success = 2,
  /** 失败 */
  Failed = 3,
  /** 已经下载了 */
  Downloaded = 4,
}

export interface DemoFileParams {
  type: 'stockTrackExcelDemo'
}

export type ReportApiPaths = {
  // 保存用户模板
  'download/common/saveReportTemplate': {
    params: ReportTemplate
    response: ApiResponse<ReportTemplate>
  }
  // 查询用户模板
  'download/common/listReportTemplate': {
    params: void
    response: ApiResponse<ReportTemplate[]>
  }
  // 删除用户模板
  'download/common/deleteReportTemplate': {
    params: IdParams
    response: ApiResponse<boolean>
  }
  // 查询导出任务状态
  'download/common/taskStatus': {
    params: IdParams
    response: ApiResponse<TaskStatusResult>
  }
  // 下载演示文件
  'download/createtask/demoFile': {
    params: DemoFileParams
    response: ApiResponse<TaskStatusResult>
  }
}
