import { DatePicker, Radio } from '@wind/wind-ui'
import { Form } from 'antd'
import React, { useMemo, useState } from 'react'
import { CustomComponentProps } from '../../../types'
import { useSingleValue } from '../../../hooks/useSingleValue'
import { DateRangeValue, formatDateRange, parseDateString } from '../../utils/date'
import styles from './index.module.less'
import { t } from 'gel-util/intl'

const { RangePicker } = DatePicker

const PREFIX = 'radio-with-date-range'
const STRINGS = {
  all: t('138649', '不限'),
}

const CUSTOM_VALUE_KEY = 'custom_date_range'

/**
 * 自定义的带有日期范围选择功能的单选按钮组件
 *
 * 该组件扩展了传统的单选按钮功能，允许用户选择一个日期范围作为其中一个选项
 * 主要用于需要用户选择多个选项中的一项，其中一项可以是一个具体的日期范围
 *
 * @param {CustomComponentProps} props - 组件的属性对象
 * @param {boolean} [hasOwnFormItem] - 是否有自己的表单项
 */
const RadioWithDateRange: React.FC<CustomComponentProps> & {
  hasOwnFormItem?: boolean
} = ({ options, onChange, value, defaultValue, itemName, ...rest }) => {
  // 仅用于控制日期选择器的显示状态
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<[boolean, boolean]>([false, false])

  // 从 props.value 或 props.defaultValue 派生出组件所需的所有状态
  const componentValue = useSingleValue(value?.value ?? defaultValue)
  const parsedDateRange = useMemo(() => parseDateString(componentValue), [componentValue])

  const selectedValueForRadio = parsedDateRange ? CUSTOM_VALUE_KEY : componentValue
  const dateRangeForPicker = (parsedDateRange ?? [null, null]) as DateRangeValue

  // 处理单选按钮的点击事件
  const handleRadioChange = (e: any) => {
    const val = e.target.value
    if (val !== CUSTOM_VALUE_KEY) {
      setIsDatePickerOpen([false, false])
      onChange?.({ value: val })
    } else {
      // 当用户点击 "自定义日期" 选项时
      if (dateRangeForPicker[0] || dateRangeForPicker[1]) {
        // 如果已经有选定的日期范围，则直接使用该值
        onChange?.({ value: formatDateRange(dateRangeForPicker) })
      } else {
        // 否则，打开日期选择器让用户选择
        setIsDatePickerOpen([true, false])
      }
    }
  }

  // 处理日期选择器的日期变化事件
  const handleDateChange = (dates: any, _dateStrings: [string, string]) => {
    const newDates: DateRangeValue = dates || [null, null]

    if (newDates[0] || newDates[1]) {
      // 如果选择了新的日期范围，则更新值为格式化后的日期字符串
      onChange?.({ value: formatDateRange(newDates) })
    } else {
      // 如果清空了日期范围，且当前选中的是自定义日期，则将值重置
      if (selectedValueForRadio === CUSTOM_VALUE_KEY) {
        onChange?.({ value: '' })
      }
    }
  }

  return (
    <Form.Item label={itemName as React.ReactNode} style={{ marginBlockEnd: 16 }}>
      <Radio.Group
        className={styles[`${PREFIX}-container`]}
        onChange={handleRadioChange}
        value={selectedValueForRadio}
        size="small"
        {...rest}
      >
        <Radio key={''} value={''} className={styles[`${PREFIX}-option`]}>
          {STRINGS.all}
        </Radio>
        {options?.map((item) => (
          <Radio key={item.value} value={item.value} className={styles[`${PREFIX}-option`]}>
            {item?.label}
          </Radio>
        ))}
        <Radio key={CUSTOM_VALUE_KEY} value={CUSTOM_VALUE_KEY}>
          <RangePicker
            size="large"
            value={dateRangeForPicker}
            onChange={handleDateChange as any}
            onOpenChange={setIsDatePickerOpen}
            open={isDatePickerOpen}
            placement="bottomLeft"
          />
        </Radio>
      </Radio.Group>
    </Form.Item>
  )
}
RadioWithDateRange.hasOwnFormItem = true
export default RadioWithDateRange
