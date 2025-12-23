import { Checkbox, message } from '@wind/wind-ui'
import { CheckboxGroupProps } from '@wind/wind-ui/lib/checkbox/Group'
import { useControllableValue } from 'ahooks'
import { intl } from 'gel-util/intl'
import { FC } from 'react'
import { CheckBoxMulti } from './CheckBoxMulti'
import { renderCheckboxOptions } from './renderCheckboxOptions'
import styles from './style/checkBoxOption.module.less'
import { CheckBoxOptionProps } from './types'
import { useCustomValueHandler } from './useCustomValueHandler'
import { getCustomValueFromSelectedValues, useOptionsTransformer } from './useOptionsTransformer'

/**
 * 复选框选项组件 (支持受控和非受控两种模式)
 *
 * 该组件支持两种模式：
 * 1. 多级复选框模式(multiCbx=true)：使用CheckBoxMulti组件渲染多级嵌套的复选框
 * 2. 普通复选框组模式(multiCbx=false)：使用Checkbox.Group渲染平铺的复选框组
 *
 * 此外，组件还支持自定义值输入：
 * - 数字范围输入(selfDefine=2)
 * - 日期选择(selfDefine=1)
 *
 * 可以作为受控组件使用（通过value和onChange控制）或非受控组件（通过defaultValue提供初始值）
 */
export const CheckBoxOption: FC<CheckBoxOptionProps> = ({
  itemOption = [],
  defaultValue = [],
  info,
  multiCbx,
  ...props
}) => {
  // 使用 ahooks 的 useControllableValue 处理受控/非受控状态
  const [selectedValues, setSelectedValues] = useControllableValue<string[]>(props, {
    defaultValue,
  })

  // 使用选项转换器，处理选项数据和自定义值计算
  const { options, customValue, multiOptions, checkboxGroupValue } = useOptionsTransformer(
    itemOption,
    selectedValues,
    info
  )

  // 使用自定义值处理器，处理自定义值变更逻辑
  const { handleCustomValueChange, handleDateChange } = useCustomValueHandler({
    selectedValues,
    itemOption,
    setSelectedValues,
  })

  // 处理CheckBoxMulti的选中值变更
  const handleMultiValueChange = (commaSeparatedValues: string) => {
    const values = commaSeparatedValues.split(',').filter(Boolean)
    setSelectedValues(values)
  }

  /**
   * 处理复选框组的选中状态变更
   *
   * 特殊处理：
   * - 如果选中了"自定义"选项但未填写自定义值，显示警告
   * - 将"custom"标识替换为实际的自定义值
   *
   * @param checkedValues 当前选中的值数组
   */
  const handleChange: CheckboxGroupProps['onChange'] = (checkedValues) => {
    // 检查是否选中了自定义选项
    const hasCustomMarkNow = checkedValues.includes('custom')

    setSelectedValues((prev) => {
      // 获取之前存在的自定义值
      const customVal = getCustomValueFromSelectedValues(prev, itemOption)
      // 获取非自定义值的选项
      const next = checkedValues.filter((v) => v !== 'custom').map(String)

      if (hasCustomMarkNow) {
        // 用户本次勾选了 custom
        if (customVal) {
          // 如果已有自定义值，继续保留
          next.push(customVal)
        } else {
          // 如果没有自定义值，提示用户填写
          message.warning(intl('355820', '请填写自定义内容'))
          // 不阻止选中自定义选项，让用户有机会填写
        }
      } else {
        // 用户取消了自定义选项，无需额外处理
      }
      console.log('handleChange', checkedValues, next)
      return next
    })
  }

  // 生成复选框选项
  const checkboxOptions = renderCheckboxOptions({
    options,
    customValue,
    info,
    checkboxGroupValue,
    onCustomValueChange: handleCustomValueChange,
    onDateChange: handleDateChange,
  })

  return multiCbx ? (
    // 多级复选框模式
    <CheckBoxMulti
      className={styles.box}
      optss={multiOptions}
      value={selectedValues}
      onChange={handleMultiValueChange}
    />
  ) : (
    // 普通复选框组模式
    <Checkbox.Group
      className={styles.checkboxGroupNormal}
      // options={checkboxOptions}
      value={checkboxGroupValue}
      onChange={handleChange}
    >
      {checkboxOptions.map((option) => (
        <div
          className={styles.checkboxGroupNormalItem}
          key={option.value}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()

            // 修复: 保持多选功能而不是只选中当前项
            const newCheckedValues = [...checkboxGroupValue]
            const optionIndex = newCheckedValues.indexOf(option.value)

            if (optionIndex === -1) {
              // 如果当前项未选中，则添加到选中列表
              newCheckedValues.push(option.value)
            } else {
              // 如果当前项已选中，则从选中列表中移除
              newCheckedValues.splice(optionIndex, 1)
            }

            handleChange(newCheckedValues)
          }}
        >
          <Checkbox key={option.value} value={option.value}>
            {option.label}
          </Checkbox>
        </div>
      ))}
    </Checkbox.Group>
  )
}
