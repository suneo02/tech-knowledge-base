import { InfoCircleButton } from '@/components/icons/InfoCircle'
import { Checkbox, message, Popover } from '@wind/wind-ui'
import { CDEFilterItem } from 'gel-api'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import intl from '../../../../utils/intl'
import { CheckBoxMulti } from './CheckBoxMulti'
import DatePickerOption from './DatePickerOption'
import NumberRangeOption from './NumberRangeOption'

export const CheckBoxOption: React.FC<{
  changeOptionCallback: (value: string | string[]) => void
  value: string[]
  filterItem: CDEFilterItem
}> = ({
  changeOptionCallback = () => null,
  value: valueFromProp = [],
  filterItem, // 筛选项信息即filter
}) => {
  const { itemOption, multiCbx } = filterItem

  const [customValue, setCustomValue] = useState('')

  const valueForCheckBoxGroup = useMemo(() => {
    if (!valueFromProp || !valueFromProp.length) {
      // 清空所有子项的values
      const clearValues = (options) => {
        options.forEach((option) => {
          option.values = []
          delete option.indeterminate
          delete option.checkAll
          if (option.itemOption) {
            clearValues(option.itemOption)
          }
        })
      }
      itemOption?.length && clearValues(itemOption)
    }
    const optionValues = itemOption.map((option) => option.value)
    return valueFromProp.map((item) => {
      if (!optionValues.includes(item)) {
        setCustomValue(item)
        return 'custom'
      }
      return item
    })
  }, [valueFromProp])

  //#region 添加不限和自定义
  const options = useMemo(() => {
    let _options = [...itemOption]

    if (filterItem?.selfDefine !== 0) {
      // 添加自定义

      _options.push({
        name: intl('25405', '自定义'),
        value: 'custom',
      })
    }

    return _options
  }, [itemOption])

  const onChange = (e) => {
    let res = []
    e.forEach((item) => {
      if (item === 'custom') {
        customValue ? res.push(customValue) : message.warning(intl('355820', '请填写自定义内容'))
      } else {
        res.push(item)
      }
    })
    changeOptionCallback(res)
  }

  //#region 处理自定义
  const customValueChange = (val: any, valString?: any) => {
    console.log('🚀 ~ CheckBoxOption customValueChange ~ val,valString:', val, valString)
    // 多选的自定义操作
    if (val === '-' || !val) {
      // 空数据
      setCustomValue('')

      changeOptionCallback(valueFromProp.filter((item) => item !== customValue))
      return
    }
    let value = valueFromProp.filter((item) => item !== customValue) // 清除掉之前的自定义
    value.push(val)
    changeOptionCallback(value)
  }
  //#endregion

  const makeVt = () => {
    return (
      <CheckBoxMulti
        optionsFromConfig={options}
        value={valueFromProp}
        onChange={changeOptionCallback}
        data-uc-id="8wClzkCfh-"
        data-uc-ct="checkboxmulti"
      />
    )
  }

  return (
    <Box>
      {multiCbx ? (
        makeVt()
      ) : (
        <Checkbox.Group value={valueForCheckBoxGroup} onChange={onChange} data-uc-id="WUJr9An1Ff" data-uc-ct="checkbox">
          {options.map((item) => (
            <Checkbox
              key={String(item.value)}
              value={item.value}
              data-uc-id="cxB9q5F7VJ"
              data-uc-ct="checkbox"
              data-uc-x={String(item.value)}
            >
              {item.name}
              {item.value === 'custom' &&
                (filterItem.selfDefine === 2 ? (
                  <div className="ml-6">
                    <NumberRangeOption
                      min={customValue ? customValue.split('-')[0] : ''}
                      max={customValue ? customValue.split('-')[1] : ''}
                      changeOptionCallback={customValueChange}
                      unit={filterItem.itemRemark}
                      data-uc-id="3F4paIKSAq"
                      data-uc-ct="numberrangeoption"
                    />
                  </div>
                ) : (
                  <div className="ml-6">
                    <DatePickerOption
                      value={customValue}
                      changeOptionCallback={customValueChange}
                      data-uc-id="GaBGIZhWZ4"
                      data-uc-ct="datepickeroption"
                    />
                  </div>
                ))}
              {item.hoverHint ? (
                <Popover content={item.hoverHint} style={{ width: 400 }} data-uc-id="MDuhvloHte" data-uc-ct="popover">
                  <InfoCircleButton />
                </Popover>
              ) : null}
            </Checkbox>
          ))}
        </Checkbox.Group>
      )}
    </Box>
  )
}

const Box = styled.div`
  display: flex;
  .ant-checkbox-wrapper,
  .w-checkbox-wrapper {
    margin-right: 25px;
    margin-left: 0;
    span:last-of-type {
      color: #666;
      line-height: 32px;
      display: inline-flex;
    }
    .ant-checkbox-checked,
    .w-checkbox-checked {
      span {
        color: #000 !important;
      }
    }
  }
  .ant-checkbox-wrapper-checked,
  .w-checkbox-wrapper-checked {
    span {
      color: #000 !important;
    }
  }
`
