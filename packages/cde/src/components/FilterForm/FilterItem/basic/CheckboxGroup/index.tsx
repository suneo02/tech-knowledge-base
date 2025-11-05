import { Checkbox } from '@wind/wind-ui'
import { Form } from 'antd'
import React, { ChangeEventHandler } from 'react'
import { CustomComponentProps, PrimitiveValue } from '../../../types'

import styles from './index.module.less'

const PREFIX = 'base-checkbox-group'
const STRINGS = {
  selectAll: '全选',
}

type CheckboxGroupComponentType = React.FC<CustomComponentProps> & {
  hasOwnFormItem?: boolean
}

const BaseCheckboxGroup: CheckboxGroupComponentType = ({
  value,
  onChange,
  options,
  itemName,
  itemId,
  ...restProps
}) => {
  console.log('BaseCheckboxGroup value', value)
  const form = Form.useFormInstance()

  const handleChange = (checkedValues: (string | number)[]) => {
    onChange?.({
      ...(value || {}),
      value: checkedValues as PrimitiveValue,
    })
  }

  const renderLabel = () => {
    const allValues = options?.map((opt) => opt.value) || []
    const currentValue = Array.isArray(value?.value) ? value.value : []
    const isAllSelected = allValues.length > 0 && currentValue.length === allValues.length

    const isIndeterminate = currentValue.length > 0 && currentValue.length < allValues.length
    const onCheckAllChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      e.stopPropagation()
      if (!itemId) {
        console.error('[BaseCheckboxGroup] Missing `itemId` prop, cannot perform check all.')
        return
      }
      form.setFieldValue(itemId, { value: e.target.checked ? allValues : [] })
    }

    return (
      <div className={styles[`${PREFIX}-label`]}>
        <div>{itemName as React.ReactNode}</div>
        <Checkbox
          className={styles[`${PREFIX}-label-checkbox`]}
          indeterminate={isIndeterminate}
          onChange={onCheckAllChange}
          checked={isAllSelected}
        >
          {STRINGS.selectAll}
        </Checkbox>
      </div>
    )
  }

  return (
    <Form.Item label={renderLabel()} style={{ marginBlockEnd: 16 }}>
      <Checkbox.Group
        className={styles[`${PREFIX}-container`]}
        options={options}
        value={Array.isArray(value?.value) ? value.value : []}
        onChange={handleChange}
        {...restProps}
      />
    </Form.Item>
  )
}

BaseCheckboxGroup.hasOwnFormItem = true

export default BaseCheckboxGroup
