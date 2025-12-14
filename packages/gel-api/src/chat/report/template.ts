import { ApiResponseForWFC } from '@/types'
import { ReportIdIdentifier, ReportTemplateItem } from '../types'

export interface ReportAIReportTemplateApiPathMap {
  'report/template/save': {
    data: {
      templateName: string
    } & ReportIdIdentifier
    response: ApiResponseForWFC<void>
  }
  'report/template/list': {
    data?: Record<string, never>
    response: ApiResponseForWFC<ReportTemplateItem[]>
  }
  'report/template/delete': {
    data?: Record<string, never>
    response: ApiResponseForWFC<number>
  }
  'report/template/use': {
    data: {
      templateId: ReportTemplateItem['id']
      entityCode: string
      entityName: string
      entityType: 1
    }
    response: ApiResponseForWFC<ReportIdIdentifier>
  }
}
