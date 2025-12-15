export interface getDocTaskListParams {
  cmd: 'getdoctasklist'
}

export interface getDocTaskListPayload {
  // 可以根据实际需求添加更多字段
  pageno?: number
  pageSize?: number
  status?: string
  keyword?: string
}

export enum DocTaskStatus {
  CREATED = 0,
  GENERATING = 1,
  SUCCESS = 2,
  FAILED = 3,
  DOWNLOADED = 4,
}

export interface DocTaskItem {
  created: number // 创建时间
  displayName: string // 导出任务名称
  downloadFileName: string // 导出文件名
  downloads: number // 下载次数
  id: string // taskid 导出使用
  status: DocTaskStatus // 状态 0 已创建 1: 生成中 2: 导出成功 3: 导出失败 4: 已经下载了
}

export type getDocTaskListResponse = DocTaskItem[]
