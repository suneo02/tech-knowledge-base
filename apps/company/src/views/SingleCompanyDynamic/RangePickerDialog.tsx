import { useClickOutside } from '@/utils/hooks'
import intl from '@/utils/intl'
import { Button, DatePicker } from '@wind/wind-ui'
import { Moment } from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import './RangePickerDialog.less'

const { RangePicker } = DatePicker

interface DateObj {
  name: string
  endDate: string
  dateRange: number
}

/**
 * 范围选择器对话框组件。
 * 例如：<RangePickerDialog show={true} onChoose={(dateObj) => console.log(dateObj)} onClose={() => {}} />
 * @param {Object} props - 组件的属性。
 * @param {boolean} props.show - 控制对话框是否显示。例如：true 表示显示，false 表示隐藏。
 * @param {Function} props.onChoose - 当用户选择日期范围时触发的回调函数，接收一个包含日期范围信息的对象作为参数。例如：onChoose({ name: '2023-01-01~2023-01-10', endDate: '20230110', dateRange: 9 })。
 * @param {Function} props.onClose - 当用户关闭对话框时触发的回调函数。例如：onClose()。
 * @returns {JSX.Element} - 返回一个包含范围选择器和操作按钮的对话框组件。
 */

const RangePickerDialog = ({
  show,
  onChoose,
  onClose,
}: {
  show: boolean
  onChoose: (dateObj: DateObj) => void
  onClose: () => void
}): JSX.Element => {
  const pickerRef = useRef<HTMLDivElement | null>(null)
  const [dateRaw, setDateRaw] = useState<[Moment, Moment]>([null, null])

  // 点击其他区域 picker 收起
  useClickOutside(pickerRef, onClose, ['w-picker-dropdown'])

  return show ? (
    <div className="custom-dialog" ref={pickerRef}>
      <RangePicker
        value={dateRaw}
        onChange={(value: [Moment, Moment]) => {
          console.log('🚀 ~ CompanyDynamic ~ value:', value)
          setDateRaw(value)
        }}
      />
      <div className="custom-dialog-footer">
        <Button
          type="primary"
          onClick={() => {
            const value = dateRaw
            let dateObj: DateObj = { name: '', endDate: '', dateRange: 0 }
            if (value[0] && value[1]) {
              const date = `${value[0].format('YYYY-MM-DD')}~${value[1].format('YYYY-MM-DD')}`
              const date1 = value[1].format('YYYY-MM-DD')
              const date2 = value[0].format('YYYY-MM-DD')
              const time1 = new Date(date1)
              const time2 = new Date(date2)
              const diffTime = Math.abs(+time1 - +time2)
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
              dateObj = {
                name: date,
                endDate: value[1].format('YYYYMMDD'),
                dateRange: diffDays,
              }
            }
            onChoose(dateObj)
            onClose()
          }}
        >
          {intl('19482', '确认')}
        </Button>
        <Button style={{ marginRight: '12px' }} onClick={onClose}>
          {intl('19405', '取消')}
        </Button>
      </div>
    </div>
  ) : null
}

export default RangePickerDialog
