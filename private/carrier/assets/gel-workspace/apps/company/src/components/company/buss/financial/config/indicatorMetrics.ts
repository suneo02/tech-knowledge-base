/**
 * 指标型度量配置：国内/海外通用展示指标与文案说明。
 * @author yxlu.calvin
 * @example
 * const metrics = domesticIndicatorMetrics
 */
import { t } from 'gel-util/intl'

export type IndicatorMetric = { key: string; label: string; tooltip?: string }

export const domesticIndicatorMetrics: IndicatorMetric[] = [
  { key: '_assentDebtRate', label: t('452477', '资产负债率(%)') },
  {
    key: '_netProfitGrowthRate',
    label: t('437679', '净利润增长率') + '(%)',
    tooltip: t('417697', '净利润增长率指单季度净利润同比增长率'),
  }, // 替换为标准字段_netProfitGrowthRate
  { key: '_rawProfitOfSaling', label: t('452474', '销售毛利率(%)') },
  {
    key: '_yearNetAssetProfitRate',
    label: t('437694', '净资产收益率') + '(%)',
    tooltip: t('478581', '净资产收益率指净资产收益率（年化）'),
  },
  {
    key: '_totalAssetReturnRate',
    label: t('437695', '总资产回报率') + '(%)',
    tooltip: t('478582', '总资产报酬率指总资产报酬率（年化）'),
  }, // 替换为标准字段_totalAssetReturnRate
  { key: '_floatingProporting', label: t('437696', '流动比率') },
  { key: '_speedProportiong', label: t('437697', '速动比率') },
]

export const overseasIndicatorMetrics: IndicatorMetric[] = [
  { key: '_assentDebtRate', label: t('452477', '资产负债率(%)') },
  { key: '_rawProfitOfSaling', label: t('452474', '销售毛利率(%)') },
  { key: '_operatingProfitMargin', label: t('452475', '营业利润率(%)') }, // 替换为标准字段_operatingProfitMargin
  { key: '_singQuarterNetProfitGrowth', label: t('452494', '净利润率(%)') }, // 替换为标准字段_singQuarterNetProfitGrowth
  {
    key: '_yearNetAssetProfitRate',
    label: t('437694', '净资产收益率') + '(%)',
    tooltip: t('478581', '净资产收益率指净资产收益率（年化）'),
  },
  {
    key: '_yearNetAssetGuerdonRate',
    label: t('452476', '投入资本回报率(%)'),
    tooltip: t('453174', '投入资本回报率指投入资本回报率（年化）'),
  }, // 替换为标准字段_yearNetAssetGuerdonRate
  { key: '_floatingProporting', label: t('437696', '流动比率') },
  { key: '_speedProportiong', label: t('437697', '速动比率') },
]
