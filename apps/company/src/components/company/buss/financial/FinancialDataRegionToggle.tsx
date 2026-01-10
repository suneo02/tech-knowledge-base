/**
 * 境内/境外数据切换组件：广播 `financial:variantChanged` 事件。
 * @author yxlu.calvin
 * @example
 * <FinancialDataRegionToggle companycode="600000" />
 */
import React, { useEffect, useMemo, useState } from 'react'
import { Radio } from '@wind/wind-ui'
import { t } from 'gel-util/intl'
import { CorpBasicNumFront } from '@/types/corpDetail/basicNum'

export const FinancialDataRegion = {
  DOMESTIC: 'domestic',
  OVERSEAS: 'overseas',
} as const
export type FinancialDataRegion = (typeof FinancialDataRegion)[keyof typeof FinancialDataRegion]

export const FinancialDataRegionToggle: React.FC<{
  companycode: string
  style?: React.CSSProperties
  basicNum?: CorpBasicNumFront
}> = ({ companycode, style, basicNum }) => {
  const [value, setValue] = useState<FinancialDataRegion>(() => {
    if (basicNum?.domesticFinancialReportNum === 0 && basicNum?.overseasFinancialReportNum > 0) {
      return FinancialDataRegion.OVERSEAS
    }
    return FinancialDataRegion.DOMESTIC
  })
  const options = useMemo(
    () => [
      { label: t('472874', '境内财报'), value: FinancialDataRegion.DOMESTIC },
      { label: t('472878', '境外财报'), value: FinancialDataRegion.OVERSEAS },
    ],
    []
  )

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('financial:variantChanged', { detail: { variant: value, companycode } }))
  }, [value, companycode])

  return (
    <Radio.Group
      size="small"
      value={value}
      onChange={(e: any) => setValue(e?.target?.value)}
      data-uc-id="mU6s8m0oRg"
      data-uc-ct="radio"
      style={style}
    >
      {options.map((i) => (
        <Radio.Button key={i.value} value={i.value} data-uc-id={`P5mJcQZQ_${i.value}`} data-uc-ct="radio">
          {i.label}
        </Radio.Button>
      ))}
    </Radio.Group>
  )
}

export default FinancialDataRegionToggle
