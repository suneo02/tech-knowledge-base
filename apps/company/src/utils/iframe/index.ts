import { LinksModule } from '@/handle/link'
import { handleReportHomeMessage, ReportHomeIframeActionPaths } from './paths/report'
import { ReportTemplate } from '@/api/paths'

export interface IframeMessageProps<T extends keyof IframeActionPaths = keyof IframeActionPaths> {
  module: LinksModule
  action: T // 传输的动作类型
  payload: ReportTemplate // 传输的数据
}

export type IframeActionPaths = ReportHomeIframeActionPaths
export const getIframeActionPaths = <T extends keyof IframeActionPaths>(url: T) => url

export type IframeCommonResponse<T extends keyof IframeActionPaths> = {
  action: T
  payload: IframeActionPaths[T]['params']
  data?: IframeActionPaths[T]['response']['data']
}

export type CommonResponse<T> = {
  data: T
}

type IframeMessage = <T extends keyof IframeActionPaths = keyof IframeActionPaths>(
  res: IframeMessageProps<T>
) => IframeCommonResponse<T>

export const handleIframeMessage: IframeMessage = ({ module, action, payload }) => {
  //   if (messageOnChange) {
  //     messageOnChange({ module, action, payload })
  //     return
  //   }
  if (module === LinksModule.REPORT_HOME) {
    return handleReportHomeMessage({ action, payload })
  }
  return {
    action,
    payload,
    data: undefined,
  }
}

/** 处理具体模块的类型 */
export type IframeModuleMessage = <T extends keyof IframeActionPaths = keyof IframeActionPaths>(
  res: Omit<IframeMessageProps<T>, 'module'>
) => IframeCommonResponse<T>
