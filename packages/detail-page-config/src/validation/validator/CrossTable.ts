import { ReportCrossTableJson } from 'gel-types'
import ReportCrossTableJsonSchema from '../schema/ReportCrossTableJson.schema.json'
import { validateSchema } from './validator'

/**
 * 验证 ReportCrossTableJson 实例
 * @param instance 要验证的配置实例
 * @returns 验证结果
 */
export function validateReportCrossTable(instance: any): ReportCrossTableJson {
  const validateResult = validateSchema(instance, ReportCrossTableJsonSchema)
  if (!validateResult.valid) {
    console.error(validateResult.errors)
  }
  return instance
}
