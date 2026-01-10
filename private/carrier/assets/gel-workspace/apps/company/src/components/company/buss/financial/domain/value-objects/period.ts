/**
 * 期间值对象：生成期间键与中文标签，并提供先后比较方法。
 * @author yxlu.calvin
 * @example
 * const p = createPeriod(2024, 2) // key: "2024Q2"
 * const q = createPeriod(2023)
 * p.isAfter(q) // true
 */
export const createPeriod = (year: number, quarter?: number) => {
  const periodKey = quarter ? `${year}Q${quarter}` : `${year}`

  return {
    year,
    quarter,
    key: periodKey,
    label: quarter ? `${year}${STRINGS.YEAR} Q${quarter}` : `${year}${STRINGS.YEAR}`,
    isBefore: (other: ReturnType<typeof createPeriod>) =>
      year < other.year || (year === other.year && (quarter ?? 0) < (other.quarter ?? 0)),
    isAfter: (other: ReturnType<typeof createPeriod>) =>
      year > other.year || (year === other.year && (quarter ?? 0) > (other.quarter ?? 0)),
  }
}
import { t } from 'gel-util/intl'

const STRINGS = {
  YEAR: t('31342', '年'),
} as const
