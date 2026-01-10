/**
 * 单位缩放值对象：定义统一的单位枚举与数值换算方法（元/千元/万元/百万元/亿元/十亿元）。
 * @author yxlu.calvin
 * @example
 * const scale = createUnitScale('TEN_THOUSAND')
 * scale.convertValue(100000) // 10
 */
import { t } from 'gel-util/intl'

export const UNIT_SCALES = {
  YUAN: { factor: 1, label: t('480000', '元') },
  THOUSAND: { factor: 1e3, label: t('479998', '千元') },
  TEN_THOUSAND: { factor: 1e4, label: t('479999', '万元') },
  MILLION: { factor: 1e6, label: t('479978', '百万元') },
  BILLION: { factor: 1e8, label: t('479979', '亿元') },
  TEN_BILLION: { factor: 1e9, label: t('479977', '十亿元') },
} as const

export const createUnitScale = (scale: keyof typeof UNIT_SCALES) => {
  const config = UNIT_SCALES[scale]

  return {
    scale,
    factor: config.factor,
    label: config.label,
    convertValue: (value: number): number => value / config.factor,
    convertBack: (value: number): number => value * config.factor,
  }
}
