/**
 * 数据校验器：对原始财务数据进行基础结构验证与数值合法性检查。
 * @author yxlu.calvin
 * @example
 * const ok = DataValidator.validateFinancialData(raw)
 * const isNum = DataValidator.validateMetricValue(123.45)
 */
export const DataValidator = {
  validateFinancialData: (data: unknown): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!data || typeof data !== 'object') {
      return { isValid: false, errors: [STRINGS.DATA_FORMAT_ERROR] }
    }

    const dataObj = data as Record<string, unknown>

    if (!Array.isArray(dataObj.periods)) {
      errors.push(STRINGS.PERIOD_DATA_FORMAT_ERROR)
    }

    if (!dataObj.metrics || typeof dataObj.metrics !== 'object') {
      errors.push(STRINGS.METRIC_DATA_FORMAT_ERROR)
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  },

  validateMetricValue: (value: unknown): value is number => {
    return typeof value === 'number' && isFinite(value) && !isNaN(value)
  },
}
import { t } from 'gel-util/intl'

const STRINGS = {
  DATA_FORMAT_ERROR: t('', '数据格式错误'),
  PERIOD_DATA_FORMAT_ERROR: t('', '期间数据格式错误'),
  METRIC_DATA_FORMAT_ERROR: t('', '指标数据格式错误'),
} as const
