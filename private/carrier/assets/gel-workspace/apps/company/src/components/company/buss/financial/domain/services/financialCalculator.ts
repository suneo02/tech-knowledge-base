/**
 * 财务计算器：提供常见财务指标计算（利润率、债务率、流动比率、增长率）。
 * @author yxlu.calvin
 * @example
 * const margin = FinancialCalculator.calculateProfitMargin(1000, 200) // 20
 * const debtRatio = FinancialCalculator.calculateDebtRatio(300, 900) // 33.33
 */
export const FinancialCalculator = {
  /**
   * 计算销售利润率（%）
   * @param revenue 销售收入（分母），必须为正数
   * @param profit 利润（分子）
   * @returns 百分比数值；当分母为0或任一参数缺失时返回 null
   */
  calculateProfitMargin: (revenue: number, profit: number): number | null => {
    if (revenue === 0 || revenue == null || profit == null) return null
    return (profit / revenue) * 100
  },

  /**
   * 计算资产负债率（%）
   * @param totalLiabilities 负债总额（分子）
   * @param totalAssets 资产总额（分母），必须为正数
   * @returns 百分比数值；当分母为0或任一参数缺失时返回 null
   */
  calculateDebtRatio: (totalLiabilities: number, totalAssets: number): number | null => {
    if (totalAssets === 0 || totalAssets == null || totalLiabilities == null) return null
    return (totalLiabilities / totalAssets) * 100
  },

  /**
   * 计算流动比率
   * @param currentAssets 流动资产（分子）
   * @param currentLiabilities 流动负债（分母），必须为正数
   * @returns 比率；当分母为0或任一参数缺失时返回 null
   */
  calculateCurrentRatio: (currentAssets: number, currentLiabilities: number): number | null => {
    if (currentLiabilities === 0 || currentLiabilities == null || currentAssets == null) return null
    return currentAssets / currentLiabilities
  },

  /**
   * 计算同比增长率（%）
   * @param currentValue 当前值
   * @param previousValue 上期值（分母），必须为正数
   * @returns 百分比数值；当分母为0或任一参数缺失时返回 null
   */
  calculateGrowthRate: (currentValue: number, previousValue: number): number | null => {
    if (previousValue === 0 || previousValue == null || currentValue == null) return null
    return ((currentValue - previousValue) / previousValue) * 100
  },
}
