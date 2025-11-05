// @ts-nocheck
import { useEffect, useState, useCallback } from 'react'
// import { Radio, DatePicker, RadioGroupProps } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { Button, DatePicker, Radio } from '@wind/wind-ui'
import { RadioGroupProps } from '@wind/wind-ui/lib/radio/group'
import { RangePickerProps } from '@wind/wind-ui/lib/date-picker'
import { SelectOptionProps } from '../../select/type'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils'

const { RangePicker } = DatePicker

export type CustomRadioProps = Omit<RadioGroupProps, 'options' | 'onChange'> & {
  options: SelectOptionProps[]
  showCustom?: boolean
  onChange?: (value: SelectOptionProps) => void
  label: string
  showAdvanced?: boolean
}

const CustomRadio: React.FC<CustomRadioProps> = ({
  options,
  showCustom,
  onChange,
  label,
  value,
  showAdvanced,
  ...rest
}) => {
  const [selectedValue, setSelectedValue] = useState<string | null>()
  const [customDateRange, setCustomDateRange] = useState<[Dayjs, Dayjs] | null>(null)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  const updateDatePickerState = useCallback((open: boolean) => {
    requestAnimationFrame(() => {
      setIsDatePickerOpen(open)
    })
  }, [])

  const handleRadioChange = (e: any) => {
    const value = e.target.value

    if (value === 'custom') {
      updateDatePickerState(true)
    } else {
      setCustomDateRange(null)
      updateDatePickerState(false)
      setSelectedValue(value)
      const selectedOption = options.find((option) => option.value === value)
      if (selectedOption) {
        onChange?.({
          label: selectedOption.label,
          title: label,
          value: selectedOption.value,
        })
      }
    }
  }

  const handleDateChange: RangePickerProps['onChange'] = (dates) => {
    if (dates && dates[0] && dates[1]) {
      setCustomDateRange([dayjs(dates[0]), dayjs(dates[1])])
      setSelectedValue('custom')
      onChange?.({
        label: `${dayjs(dates[0]).format('YYYY-MM-DD')}~${dayjs(dates[1]).format('YYYY-MM-DD')}`,
        title: label,
        min: dayjs(dates[0]).format('YYYY-MM-DD'),
        max: dayjs(dates[1]).format('YYYY-MM-DD'),
        value: `${dayjs(dates[0]).format('YYYYMMDD')}~${dayjs(dates[1]).format('YYYYMMDD')}`,
        custom: true,
      })
    } else {
      setCustomDateRange(null)
      setSelectedValue(null)
    }
    updateDatePickerState(false)
  }

  useEffect(() => {
    console.log(value)
    if (!value?.custom) {
      setCustomDateRange([null, null])
    }
    if (typeof value === 'string') {
      setSelectedValue(value)
      return
    }
    setSelectedValue(value?.custom ? 'custom' : value?.value || '')
  }, [value])

  return (
    <Radio.Group onChange={handleRadioChange} value={selectedValue} size="small" {...rest}>
      {options
        ?.filter((res) => !res.disabled)
        ?.map((item) => (
          <Radio key={item.value} value={item.value}>
            {item?.label}
          </Radio>
        ))}
      {showCustom && (
        <Radio key={'custom'} value="custom">
          <RangePicker
            size="small"
            value={customDateRange}
            onChange={handleDateChange}
            open={isDatePickerOpen}
            onOpenChange={updateDatePickerState}
            getPopupContainer={(trigger) => trigger.parentElement || document.body}
            dropdownClassName="custom-date-picker-dropdown"
            style={{ width: 'auto' }}
            placement="bottomLeft"
          />
        </Radio>
      )}
      {showAdvanced && (
        <Button type="link" size="small" onClick={() => wftCommon.jumpJqueryPage('AdvancedSearch04.html')}>
          {intl('437294', '高级筛选条件')}
        </Button>
      )}
    </Radio.Group>
  )
}
export default CustomRadio
