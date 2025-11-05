import { validateReportDetailNodeJson } from '@/validation'
import { CorpBasicInfo, ReportDetailNodeJson } from 'gel-types'
import defaultCorpInfoConfigJson from './defaultConfig.json' assert { type: 'json' }
import { getCorpConfigMapByCorpTypeId } from './rowsByCorpTypeId'
import { corpConfigMapByAreaCode, corpInfoConfigCanada } from './rowsByNation'
import { corpConfigMapByConfigType } from './rowsByOrgType'

export const defaultCorpInfoConfig: ReportDetailNodeJson = validateReportDetailNodeJson(defaultCorpInfoConfigJson)

export const getCorpInfoConfigByInfo = (basicInfo?: CorpBasicInfo): ReportDetailNodeJson => {
  if (!basicInfo) {
    return defaultCorpInfoConfig
  }
  const { configType, corp_type_id, areaCode } = basicInfo
  // 优先使用 config type 来匹配
  if (configType && corpConfigMapByConfigType[configType]) {
    return corpConfigMapByConfigType[configType]
  }

  // 其次使用 area code 匹配海外 海外国家 如果没命中，那么用加拿大的
  if (areaCode) {
    if (corpConfigMapByAreaCode[areaCode]) {
      return corpConfigMapByAreaCode[areaCode]
    } else if (areaCode.startsWith('18')) {
      // 如果没命中 且 以 18开始，那么用加拿大的
      return corpInfoConfigCanada
    }
  }

  if (corp_type_id) {
    const corpConfigByCorpTypeId = getCorpConfigMapByCorpTypeId(corp_type_id)
    if (corpConfigByCorpTypeId) {
      return corpConfigByCorpTypeId
    }
  }

  return defaultCorpInfoConfig
}
