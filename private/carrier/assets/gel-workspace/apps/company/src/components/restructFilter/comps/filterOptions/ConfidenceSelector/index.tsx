import { InfoCircleButton } from '@/components/icons/InfoCircle'
import { Popover, Select } from '@wind/wind-ui'
import { SelectProps } from '@wind/wind-ui/lib/select'
import React from 'react'
import styles from './index.module.less'
import intl from '@/utils/intl'

export enum ConfidenceEnum {
  STRICT = 'strict',
  MODERATE = 'moderate',
  LENIENT = 'lenient',
}

export interface ConfidenceSelectorProps extends SelectProps {
  options: { label: React.ReactNode; value: ConfidenceEnum }[]
  industryTitle?: string // 行业产业标题
}

const PREFIX = 'confidence-selector'

const STRINGS = {
  STRICT: intl('448294', '严（1）'),
  MODERATE: intl('448295', '较严（1+2）'),
  LENIENT: intl('448314', '宽（1+2+3）'),
  ENTERPRISE_INDUSTRY_TOOLTIP_STRICT: intl('448297', '基于标准分类基准直接划分'),
  ENTERPRISE_INDUSTRY_TOOLTIP_MODERATE: intl('448315', '包含标准分类规则及结合企业主营特征关联分类'),
  ENTERPRISE_INDUSTRY_TOOLTIP_LENIENT: intl('448298', '通过多维度数据与产业分类匹配并叠加综合验证，覆盖全等级分类范围'),
  ENTERPRISE_INDUSTRY_TOOLTIP_STRICT_DESC: intl(
    '448299',
    'Wind 大数据基于多源数据计算，将{industryTitle}的置信度划分为以下{length}类：'
  ),
}

const tooltipItemsContent = {
  [ConfidenceEnum.STRICT]: (
    <>
      <strong>{STRINGS.STRICT}</strong>：{STRINGS.ENTERPRISE_INDUSTRY_TOOLTIP_STRICT}；
    </>
  ),
  [ConfidenceEnum.MODERATE]: (
    <>
      <strong>{STRINGS.MODERATE}</strong>：{STRINGS.ENTERPRISE_INDUSTRY_TOOLTIP_MODERATE}；
    </>
  ),
  [ConfidenceEnum.LENIENT]: (
    <>
      <strong>{STRINGS.LENIENT}</strong>：{STRINGS.ENTERPRISE_INDUSTRY_TOOLTIP_LENIENT}。
    </>
  ),
}

const renderTooltipContent = (options: { label: React.ReactNode; value: ConfidenceEnum }[], industryTitle: string) => (
  <div className={styles[`${PREFIX}-tooltip`]}>
    {STRINGS.ENTERPRISE_INDUSTRY_TOOLTIP_STRICT_DESC.replace('{industryTitle}', industryTitle).replace(
      '{length}',
      options.length.toString()
    )}
    <ul>
      {options.map((option) => (
        <li key={option.value}>{tooltipItemsContent[option.value]}</li>
      ))}
    </ul>
  </div>
)

/**
 * 置信度选择器，包含选择框和信息提示
 * @author Calvin
 * @description 置信度选择器组件，用于选择置信度
 */
export const ConfidenceSelector: React.FC<ConfidenceSelectorProps> = (props) => {
  if (!props?.options || props.options.length === 0) return null
  return (
    <div className={styles[`${PREFIX}-container`]}>
      <Select {...props} className={styles[`${PREFIX}-selector`]} data-uc-id="cKNftPl7uT" data-uc-ct="select" />
      <Popover
        content={renderTooltipContent(props.options, props.industryTitle)}
        placement="right"
        overlayStyle={{ width: 500 }}
        data-uc-id="79soxUf4S"
        data-uc-ct="popover"
      >
        <InfoCircleButton />
      </Popover>
    </div>
  )
}
