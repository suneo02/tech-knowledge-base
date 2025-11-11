import { ReportTemplate } from '@/api/paths'
import { CommonResponse, IframeModuleMessage } from '..'

export const ReportHomeIframeAction = {
  // 获取报告模板列表
  GET_REPORT_TEMPLATE_DATA: 'getReportTemplateData',
  // 保存报告模板
  SAVE_REPORT_TEMPLATE_DATA: 'saveReportTemplateData',
  // 删除报告模板
  DELETE_REPORT_TEMPLATE_DATA: 'deleteReportTemplateData',
}

export type ReportHomeIframeActionPaths = {
  // 保存用户模板
  saveReportTemplateData: {
    params: ReportTemplate
    response: CommonResponse<any>
  }
  // 查询用户模板
  getReportTemplateData: {
    params: void
    response: CommonResponse<any>
  }
  // // 删除用户模板
  // 'deleteReportTemplateData': {
  //   params: IdParams
  //   response: CommonRespose<boolean>
  // }
}

export const handleReportHomeMessage: IframeModuleMessage = ({ action, payload }) => {
  if (action === ReportHomeIframeAction.SAVE_REPORT_TEMPLATE_DATA) {
    return { action, payload, data: '' }
  }
}
