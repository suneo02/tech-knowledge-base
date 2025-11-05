import { ReportDetailNodeJson, ReportDetailTableJson } from 'gel-types'
import { validateReportCrossTable } from './CrossTable'
import { validateReportDetailCustomNodeJson } from './CustomNode'
import { validateReportHorizontalTable } from './HorizontalTable'
import { validateReportDetailNodeWithChildrenJson } from './NodeWithChildren'
import { validateReportVerticalTable } from './VerticalTable'

export const validateReportDetailNodeJson = (instance: any): ReportDetailNodeJson => {
  switch (instance.type) {
    case 'nodeWithChildren':
      return validateReportDetailNodeWithChildrenJson(instance)
    case 'verticalTable':
      return validateReportVerticalTable(instance)
    case 'horizontalTable':
      return validateReportHorizontalTable(instance)
    case 'crossTable':
      return validateReportCrossTable(instance)
    case 'custom':
      return validateReportDetailCustomNodeJson(instance)
    default:
      console.error('Unknown node type:', instance.type, instance)
      return instance
  }
}

export const validateReportDetailTableJson = (instance: any): ReportDetailTableJson => {
  switch (instance.type) {
    case 'horizontalTable':
      return validateReportHorizontalTable(instance)
    case 'verticalTable':
      return validateReportVerticalTable(instance)
    case 'crossTable':
      return validateReportCrossTable(instance)
    default:
      console.error('Unknown table type:', instance.type, instance)
      return instance
  }
}
