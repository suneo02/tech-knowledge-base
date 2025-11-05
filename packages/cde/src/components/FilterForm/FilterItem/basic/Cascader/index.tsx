import { Cascader as WindCascader } from '@wind/wind-ui'
import { ErrorBoundary } from 'gel-ui'
import React from 'react'
import { CustomComponentProps, PrimitiveValue } from '../../../types'
import styles from './index.module.less'
import { t } from 'gel-util/intl'

const PREFIX = 'cascader'
const STRINGS = {
  PLACEHOLDER: t('', '请输入或者选择对应的的内容'),
}

// Define a new type for the component that can hold a static property
type CascaderComponentType = React.FC<CustomComponentProps & { label?: React.ReactNode }> & {
  hasOwnFormItem?: boolean
}

const Cascader: CascaderComponentType = ({ value, onChange, options, label, ...restProps }) => {
  const handleChange = (newValue: any, _options: any) => {
    console.log('🚀 ~ handleChange ~ newValue:', newValue, _options)
    onChange?.({
      ...(value || {}),
      value: newValue as PrimitiveValue,
    })
  }

  return (
    <div className={styles[`${PREFIX}-container`]}>
      <ErrorBoundary fallback={<div></div>}>
        <WindCascader
          placeholder={STRINGS.PLACEHOLDER}
          size="large"
          style={{ width: '100%' }}
          options={options}
          value={value?.value as (string | number)[]}
          onChange={handleChange}
          {...restProps}
        />
      </ErrorBoundary>
    </div>
  )
}

Cascader.hasOwnFormItem = true

export default Cascader
