import React from 'react'
import { CustomComponentProps, PrimitiveValue } from '../../../types'
import { Select } from '@wind/wind-ui'
import styles from './index.module.less'
import { t } from 'gel-util/intl'

const STRINGS = {
  PLACEHOLDER: t('', '请选择内容'),
}

const BaseSelect: React.FC<CustomComponentProps> = ({
  value,
  onChange,
  placeholder = STRINGS.PLACEHOLDER,
  mode,
  options,
  ...restProps
}) => {
  console.log('BaseSelect initial value', restProps.initialValue)
  const handleChange = (newValue: string | string[], option: any) => {
    onChange?.({
      ...value,
      value: newValue as PrimitiveValue,
    })
  }

  const selectValue =
    mode === 'tags' || mode === 'multiple' ? (value?.value as string[] | undefined) || [] : value?.value

  return (
    <div className={styles['select-container']}>
      <Select
        placeholder={placeholder}
        size="large"
        value={selectValue}
        onChange={handleChange as any}
        style={{ width: '100%' }}
        dropdownClassName={styles['select-dropdown-container']}
        options={options}
        mode={mode as 'multiple' | 'tags'}
        {...restProps}
      />
    </div>
  )
}

export default BaseSelect
