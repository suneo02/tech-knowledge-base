import { DatePicker, Radio } from '@wind/wind-ui'
import { Form } from 'antd'
import React, { useEffect, useState } from 'react'
import { CustomComponentProps } from '../../../types'
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
  // 用于存储单选按钮的选中值
  const [selectedValue, setSelectedValue] = useState<string | number>('')
  // 用于存储日期范围的值
  const [dateRange, setDateRange] = useState<DateRangeValue>([null, null])
  // 用于控制日期选择器的显示状态
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<[boolean, boolean]>([false, false])

  // 初始化选中值和日期范围
  useEffect(() => {
    const initialVal = value?.value ?? defaultValue
    if (initialVal === undefined || initialVal === null || initialVal === '') {
      setSelectedValue('')
      setDateRange([null, null])
      return
    }

    const parsedRange = parseDateString(initialVal as string)
    if (parsedRange) {
      setSelectedValue(CUSTOM_VALUE_KEY)
      setDateRange(parsedRange)
    } else {
      setSelectedValue(initialVal as string | number)
      setDateRange([null, null])
    }
  }, [value, defaultValue])

  // 处理单选按钮的点击事件
  const handleRadioChange = (e: any) => {
    const val = e.target.value

    if (val !== CUSTOM_VALUE_KEY) {
      setSelectedValue(val)
      setIsDatePickerOpen([false, false])
      onChange?.({ value: val })
    } else {
      if (dateRange[0] || dateRange[1]) {
        setSelectedValue(CUSTOM_VALUE_KEY)
        onChange?.({ value: formatDateRange(dateRange) })
      } else {
        setIsDatePickerOpen([true, false])
      }
    }
  }

  // 处理日期选择器的日期变化事件
  const handleDateChange = (dates: any, _dateStrings: [string, string]) => {
    const newDates: DateRangeValue = dates || [null, null]
    setDateRange(newDates)

    if (newDates[0] || newDates[1]) {
      setSelectedValue(CUSTOM_VALUE_KEY)
      onChange?.({ value: formatDateRange(newDates) })
    } else {
      if (selectedValue === CUSTOM_VALUE_KEY) {
        setSelectedValue('')
        onChange?.({ value: '' })
      }
    }
  }

  return (
    <Form.Item label={itemName as React.ReactNode} style={{ marginBlockEnd: 16 }}>
      <Radio.Group
        className={styles[`${PREFIX}-container`]}
        onChange={handleRadioChange}
        value={selectedValue}
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
            value={dateRange}
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
