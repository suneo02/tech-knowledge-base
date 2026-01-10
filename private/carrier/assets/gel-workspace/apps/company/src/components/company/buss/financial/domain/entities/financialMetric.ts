/**
 * 指标实体构造器：创建指标的键、标签与按期间的数值字典。
 * @author yxlu.calvin
 * @example
 * const m = createFinancialMetric('_sumBusinessIncome', '营业总收入', { '2024': 123456 })
 */
export const createFinancialMetric = (key: string, label: string, values: Record<string, number>) => {
  return {
    key,
    label,
    values: { ...values },
  }
}
