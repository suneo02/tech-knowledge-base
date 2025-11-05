import { AxiosRequestConfig } from 'axios'
import { ApiResponseForWFC } from './type'

export interface wfcDownloadApiPath {
  /**
   * 创建表格下载任务
   */
  'download/createtask/superlistexcel': {
    data: {
      tableName: string
    }
    response: ApiResponseForWFC<{
      createDate: number
      id: number
    }>
  }

  /**
   * 查询下载任务状态
   */
  'download/common/listTaskStatus': {
    data: {
      ids: string // 格式如 "[2274,2276]"
    }
    response: ApiResponseForWFC<{
      list: Array<{
        status: number
        taskId: number
      }>
    }>
  }

  /**
   * 信用报告报告下载
   * 其实里面是 后端配置的路径是信用报告路径
   */
  'download/createtask/dueDiligenceReport': {
    data: {
      /**
       * 报告的 隐藏节点
       */
      pattern: string
      lang: string
    }
    response: ApiResponseForWFC<{
      createDate: number
      id: number
    }>
  }
}

export const wfcDownloadApiCfg: Partial<Record<keyof wfcDownloadApiPath, AxiosRequestConfig>> = {
  ['download/createtask/dueDiligenceReport']: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  },
}
