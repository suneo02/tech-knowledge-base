import { Integration } from '@/assets/icon'
import { Typography } from 'antd'
import classNames from 'classnames'
import { NumberRange, NumberRangeValue } from 'gel-ui'
import { FC } from 'react'
import styles from './style.module.less'

export interface NumberSelectAndPointsProps {
  className?: string
  rangeValue?: NumberRangeValue
  setRangeValue: (value: NumberRangeValue) => void
  minValue?: number
  maxValue?: number
}

export const NumberSelectAndPoints: FC<NumberSelectAndPointsProps> = ({
  className,
  rangeValue,
  setRangeValue,
  minValue = 1,
  maxValue = 10000,
}) => {
  const handleRangeChange = (value: NumberRangeValue) => {
    setRangeValue(value)
  }

  return (
    <div className={classNames(styles['number-select-points'], className)}>
      <NumberRange
        prefix={'条数选择'}
        min={minValue}
        max={maxValue}
        value={rangeValue}
        onChange={handleRangeChange}
        firstProps={{
          disabled: true,
        }}
      />
      <Typography.Text className={styles['number-select-points__range-text']}>
        消耗积分：{rangeValue?.[0] != null && rangeValue?.[1] != null ? rangeValue?.[1] - rangeValue?.[0] + 1 : '-'}
        <Integration />
      </Typography.Text>
    </div>
  )
}
