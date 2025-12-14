import { ExclamationCircleOutlined } from '@/assets/icons/index.ts'
import { Popover } from '@wind/wind-ui'
import { CDEFilterOption } from 'gel-api'
import React from 'react'
import { DatePickerOption } from '../DatePickerOption'
import { NumberRangeOption } from '../NumberRangeOption'
import styles from './style/checkBoxOption.module.less'
import { CheckboxRenderOptions } from './types'

/**
 * 阻止输入控件的事件冒泡，防止触发Checkbox的onChange
 */
const stopPropagation = (e: React.MouseEvent) => {
  e.stopPropagation()
}

/**
 * 生成Checkbox.Group的options选项
 * 负责复选框选项的渲染逻辑，包括普通选项和自定义选项
 */
export const renderCheckboxOptions = ({
  options,
  customValue,
  info,
  onCustomValueChange,
  onDateChange,
}: CheckboxRenderOptions) => {
  return options.map((item: CDEFilterOption) => {
    const isCustomOption = typeof item.value === 'string' && item.value === 'custom'
    const hoverHint = 'hoverHint' in item && typeof item.hoverHint === 'string' ? item.hoverHint : ''

    return {
      label: (
        <div className={styles.checkLabel}>
          <span>{item.name}</span>
          {isCustomOption && info.selfDefine === 2 && (
            <div onClick={stopPropagation}>
              <NumberRangeOption onChange={onCustomValueChange} value={customValue} suffix={info.itemRemark} />
            </div>
          )}
          {isCustomOption && info.selfDefine !== 2 && (
            <div onClick={stopPropagation}>
              <DatePickerOption value={customValue} onChange={onDateChange} />
            </div>
          )}
          {hoverHint && (
            <Popover content={hoverHint}>
              <ExclamationCircleOutlined style={{ display: 'inline-block', marginLeft: 4 }} />
            </Popover>
          )}
        </div>
      ),
      value: typeof item.value === 'string' ? item.value : String(item.value),
    }
  })
}
