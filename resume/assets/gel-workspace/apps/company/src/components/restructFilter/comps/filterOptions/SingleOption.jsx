import { message, Radio } from '@wind/wind-ui'
// import { message, Radio } from '@wind/wind-ui'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import DatePickerOption from './DatePickerOption'
import NumberRangeOption from './NumberRangeOption'
import intl from '../../../../utils/intl'
import { dateFormat } from '../../../../locales/constants'

const SingleOption = ({
  itemOption = [],
  changeOptionCallback = () => null,
  defaultValue = '',
  info, // 筛选项信息即filter
}) => {
  // 默认值
  const value = useMemo(() => {
    const optionValues = itemOption.map((option) => option.value)
    if (defaultValue && !optionValues.includes(defaultValue)) {
      return 'custom'
    }
    return defaultValue || 'any'
  }, [defaultValue])

  //#region 添加不限和自定义
  const options = useMemo(() => {
    let _options = [...itemOption]
    _options.unshift({
      name: intl('138649', '不限'),
      value: 'any',
    })
    if (info?.selfDefine !== 0) {
      // 添加自定义

      _options.push({
        name: intl('25405', '自定义'),
        value: 'custom',
      })
    }
    return _options
  }, [itemOption])
  //#endregion

  const onChange = (e) => {
    const value = e.target.value
    if (value === 'any') {
      changeOptionCallback([])
      return
    }
    if (value === 'custom') {
      !customValue && message.warning(intl('355820', '请填写自定义内容'))
      changeOptionCallback(customValue ? [customValue] : [])
      return
    }
    changeOptionCallback([value])
  }

  //#region 处理自定义
  const [customValue, setCustomValue] = useState(
    () => (itemOption.find((option) => option.value === defaultValue) ? '' : defaultValue) // 在itemOption找到就不是自定义内容
  )
  // console.log(customValue);
  const customValueChange = (date, dateString) => {
    console.log('🚀 ~ customValueChange ~ date, dateString:', date, dateString)
    // 单选的自定义操作
    setCustomValue(date)
    let value = [date?.map((i) => i?.format('YYYYMMDD')).join('-')]
    console.log("🚀 ~ customValueChange ~ value:", value)
    changeOptionCallback(value)
  }

  const customNumberValueChange = (val) => {
    // 单选的自定义操作
    if (val === '-' || !val) {
      // 空数据
      setCustomValue('')
      changeOptionCallback([])
      return
    }
    setCustomValue(val)
    changeOptionCallback([val])
  }

  useEffect(() => {
    return () => {
      console.log('destory')
    }
  }, [])
  console.log('🚀 ~ customValue:', customValue)
  //#endregion
  return (
    <Box>
      <Radio.Group value={value} onChange={onChange}>
        {options.map((item) => (
          <Radio key={item.value} value={item.value}>
            {item.name}
            {item.value === 'custom' &&
              (info.seolifDefine === 2 ? (
                <div className="ml-6">
                  <NumberRangeOption
                    min={customValue ? customValue.split('-')[0] : ''}
                    max={customValue ? customValue.split('-')[1] : ''}
                    changeOptionCallback={customNumberValueChange}
                    unit={info.itemRemark}
                  />
                </div>
              ) : (
                <div className="ml-6">
                  <DatePickerOption value={customValue} changeOptionCallback={customValueChange} />
                </div>
              ))}
          </Radio>
        ))}
      </Radio.Group>
    </Box>
  )
}

const Box = styled.div`
  display: flex;
  .ant-radio-wrapper,
  .w-radio-wrapper {
    margin-right: 16px;
    span {
      color: #666;
      line-height: 32px;
      display: inline-flex;
    }
    .ant-radio-checked,
    .w-radio-checked {
      span {
        color: #000 !important;
      }
    }
  }
  .ant-radio-wrapper-checked,
  .w-radio-wrapper-checked {
    .ant-radio-inner,
    .w-radio-inner {
      &:after {
        background-color: #00aec7;
      }
    }
  }
`
export default SingleOption
