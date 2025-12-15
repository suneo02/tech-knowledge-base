import { Select } from '@wind/wind-ui'
import { t } from 'gel-util/intl'
import React from 'react'
import { CustomComponentProps } from '../../../types'
import styles from './index.module.less'

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
  const handleChange = (newValue: string | string[]) => {
    onChange?.({
      ...value,
      value: newValue,
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
