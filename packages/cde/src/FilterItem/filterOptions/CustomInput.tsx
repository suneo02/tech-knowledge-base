/**
 * 自定义输入组件
 * 根据类型提供日期或数字范围的输入功能
 */
import { DateRangeValue } from '@wind/wind-ui/lib/date-picker/index'
import { DatePickerOption } from './DatePickerOption.tsx'
import { NumberRangeOption } from './NumberRangeOption.tsx'

/**
 * 自定义输入组件的属性接口
 * @interface CustomInputProps
 * @property {'date' | 'number'} type - 输入类型，支持日期或数字
 * @property {string} value - 当前输入值
 * @property {Function} onDateChange - 日期变更回调函数
 * @property {Function} onNumberChange - 数字变更回调函数
 * @property {string} [itemRemark] - 可选的备注信息（如单位等）
 */
interface CustomInputProps {
  type: 'date' | 'number'
  value: string
  onDateChange: (dates: DateRangeValue) => void
  onNumberChange: (val: string) => void
  itemRemark?: string
}

export const CustomInput = ({ type, value, onDateChange, onNumberChange, itemRemark }: CustomInputProps) => {
  // 根据类型渲染不同的输入组件
  if (type === 'number') {
    return <NumberRangeOption value={value} onChange={onNumberChange} suffix={itemRemark} />
  }

  return <DatePickerOption value={value} onChange={onDateChange} />
}
