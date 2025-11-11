import { Select } from '@wind/wind-ui'
import { t } from 'gel-util/intl'
import React from 'react'
import { CustomComponentProps } from '../../../types'
import styles from './index.module.less'

const STRINGS = {
  PLACEHOLDER: t('', '请输入关键词，按确认键隔开'),
}

const TagsInput: React.FC<CustomComponentProps> = ({ value, onChange, ...restProps }) => {
  const handleChange = (newValue: string[]) => {
    onChange?.({
      ...value,
      value: newValue,
    })
  }

  return (
    <div className={styles['tags-input-container']}>
      <Select
        size="large"
        mode="tags"
        value={value?.value}
        // @ts-expect-error 类型错误
        onChange={(value) => handleChange(value as string[])}
        tokenSeparators={[',']}
        style={{ width: '100%' }}
        dropdownClassName={styles['select-dropdown-container']}
        placeholder={STRINGS.PLACEHOLDER}
        maxTagCount="responsive"
        {...restProps}
      />
    </div>
  )
}

export default TagsInput
