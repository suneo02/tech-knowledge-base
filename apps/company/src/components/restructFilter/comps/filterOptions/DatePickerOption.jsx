import React from 'react'
import styled from 'styled-components'
import { DatePicker } from '@wind/wind-ui'
import { dateFormat } from '@/locales/constants'
import dayjs from 'dayjs'

function formatDate(dateString) {
  // 检查输入是否为8位数字的字符串
  if (!/^\d{8}$/.test(dateString)) {
    return '输入格式错误'
  }

  // 提取年、月、日
  const year = dateString.substr(0, 4)
  const month = dateString.substr(4, 2)
  const day = dateString.substr(6, 2)

  // 返回格式化后的日期字符串
  return `${year}-${month}-${day}`
}

const DatePickerOption = ({ className, value, changeOptionCallback = () => null }) => {
  // const defaultValue = useMemo(() => {
  //   // console.log(min,max);

  //   if (min && max) return [min, max]
  //   return []
  // }, [min, max])

  const onChange = (date, dateString) => {
    // if (dateString?.some((i) => !i) && dateString?.some((i) => i)) return
    console.log('🚀 ~ onChange ~  date, dateString:', date, dateString)
    changeOptionCallback(date, dateString)
    // moment(item).format('YYYYMMDD'))
  }

  value = typeof value === 'string' ? value.split('-').map((i) => dayjs(formatDate(i), dateFormat)) : value

  return (
    <Box className={className}>
      <DatePicker.RangePicker
        defaultValue={value}
        value={value}
        format={dateFormat}
        onChange={onChange}
        placeholder={[window.en_access_config ? 'Start' : '开始时间', window.en_access_config ? 'End' : '截止时间']}
      />
    </Box>
  )
}

const Box = styled.div`
  display: flex;
  align-items: center;
`

export default DatePickerOption
