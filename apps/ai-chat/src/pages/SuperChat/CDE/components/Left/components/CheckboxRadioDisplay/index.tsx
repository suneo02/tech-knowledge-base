import cn from 'classnames'
import styles from './index.module.less'
import { useMemo } from 'react'

const PREFIX = 'checkbox-radio-display'
export const CheckboxRadioDisplay = ({ value, options }: { value: any; options: any }) => {
  const extraValues = useMemo(() => {
    if (!Array.isArray(value) || !Array.isArray(options)) {
      return []
    }
    const optionValues = new Set(options.map((opt) => opt.value))
    return value.filter((v) => !optionValues.has(v))
  }, [value, options])

  return (
    <div className={styles[`${PREFIX}-container`]}>
      {options?.map((option) => (
        <div
          key={option.value}
          className={cn(styles[`${PREFIX}-container-item`], {
            [styles[`${PREFIX}-container-item-active`]]: value?.includes(option.value),
          })}
        >
          {option.name}
        </div>
      ))}
      {extraValues.map((extraValue) => (
        <div
          key={extraValue}
          className={cn(styles[`${PREFIX}-container-item`], styles[`${PREFIX}-container-item-active`])}
        >
          {extraValue}
        </div>
      ))}
    </div>
  )
}
