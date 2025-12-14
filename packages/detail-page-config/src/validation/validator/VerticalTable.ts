import { ReportVerticalTableJson } from 'gel-types'
import ReportVerticalTableJsonSchema from '../schema/ReportVerticalTableJson.schema.json'
import { validateSchema } from './validator'

/**
 * 验证 ReportVerticalTableJson 实例
 * @param instance 要验证的配置实例
 * @returns 验证结果
 */
export function validateReportVerticalTable(instance: any): ReportVerticalTableJson {
  const validateResult = validateSchema(instance, ReportVerticalTableJsonSchema)
  if (!validateResult.valid) {
    console.error(validateResult.errors)
  }
  return instance
}
