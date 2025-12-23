import { ReportIdIdentifier } from './common'

export interface ReportTemplateItem extends ReportIdIdentifier {
  templateType: number
  createTime: number
  isSystemTemplate: boolean
  name: string
  id: number
  version: number
}
