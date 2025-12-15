import { ReportDetailCustomNodeJson } from 'gel-types'
import ReportDetailCustomNodeJsonSchema from '../schema/ReportDetailCustomNodeJson.schema.json'
import { validateSchema } from './validator'

export const validateReportDetailCustomNodeJson = (instance: any): ReportDetailCustomNodeJson => {
  const validateResult = validateSchema(instance, ReportDetailCustomNodeJsonSchema)
  if (!validateResult.valid) {
    console.error(validateResult.errors)
  }
  return instance
}
