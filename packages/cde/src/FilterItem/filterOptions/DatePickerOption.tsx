/**
 * 日期选择器组件
 * 提供日期范围选择功能，支持自定义日期格式和国际化
 */
import { DatePicker } from '@wind/wind-ui'
import { DateRangeValue } from '@wind/wind-ui/lib/date-picker'
import dayjs from 'dayjs'
import { dateFormat } from 'gel-util/format'
import { isEn } from 'gel-util/intl'

/**
 * DatePickerOption 组件的属性接口
 * @interface DatePickerOptionProps
 * @property {string} [className] - 可选的 CSS 类名
 * @property {string | DateRangeValue} [value] - 日期值，可以是以下格式：
 *   - 字符串格式：'YYYYMMDD-YYYYMMDD'
 *   - 空字符串：表示未选择日期
 *   - Dayjs对象数组：表示开始和结束日期
 * @property {Function} [changeOptionCallback] - 日期范围变化时的回调函数
 */
interface DatePickerOptionProps {
  className?: string
  value?: string | DateRangeValue
  onChange?: (date: DateRangeValue, dateString: [string, string]) => void
}

/**
 * 将 YYYYMMDD 格式的日期字符串转换为 YYYY-MM-DD 格式
 * @param {string} dateString - YYYYMMDD 格式的日期字符串
 * @returns {string} YYYY-MM-DD 格式的日期字符串或错误提示
 */
function formatDate(dateString: string): string {
  // 验证输入是否为8位数字的字符串
  if (!/^\d{8}$/.test(dateString)) {
    return '日期格式错误，请输入8位数字'
  }

  // 提取年、月、日
  const year = dateString.substring(0, 4)
  const month = dateString.substring(4, 6)
  const day = dateString.substring(6, 8)

  // 返回格式化后的日期字符串
  return `${year}-${month}-${day}`
}

/**
 * 将字符串格式的日期值转换为 RangeValue 格式
 * @param {string} value - YYYYMMDD-YYYYMMDD 格式的日期字符串
 * @returns {RangeValue} 日期范围值
 */
function parseStringValue(value: string): DateRangeValue {
  if (!value) {
    return [null, null]
  }

  const dates = value.split('-')
  if (dates.length !== 2) {
    return [null, null]
  }

  return dates.map((date) => {
    try {
      return dayjs(formatDate(date), dateFormat)
    } catch {
      return null
    }
  }) as DateRangeValue
}

/**
 * DatePickerOption 组件
 * 日期范围选择器组件，支持字符串格式和 Dayjs 对象格式
 *
 * @component
 * @param {DatePickerOptionProps} props - 组件属性
 * @returns {JSX.Element} 渲染后的日期范围选择器
 */
export const DatePickerOption = ({ className, value, onChange = () => null }: DatePickerOptionProps) => {
  /**
   * 处理日期范围变化事件
   * @param {RangeValue | null} dates - 选择的日期范围（Dayjs对象）
   * @param {[string, string]} dateStrings - 选择的日期范围（字符串格式）
   */
  const handleChange = (dates: DateRangeValue, dateStrings: [string, string]) => {
    onChange(dates || [null, null], dateStrings)
  }

  // 将字符串格式（YYYYMMDD-YYYYMMDD）转换为 RangeValue 格式
  const formattedValue = typeof value === 'string' ? parseStringValue(value) : value

  return (
    <DatePicker.RangePicker
      className={className}
      value={formattedValue}
      format={dateFormat}
      onChange={handleChange}
      placeholder={[isEn() ? 'Start' : '开始时间', isEn() ? 'End' : '截止时间']}
    />
  )
}
