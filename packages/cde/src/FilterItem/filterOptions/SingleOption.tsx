/**
 * 单选选项组件
 * 提供单选项的选择功能，支持自定义输入和预设选项
 */
import { CDEFilterOptionFront } from '@/types/filter.ts'
import { Radio } from '@wind/wind-ui'
import { RadioGroupProps } from '@wind/wind-ui/lib/radio/group'
import classNames from 'classnames'
import { CDEFilterItem, isSingleCDEFilterOption } from 'gel-api'
import { FC, useMemo } from 'react'
import { CustomInput } from './CustomInput.tsx'
import { useCustomValue } from './hooks/useCustomValue.ts'
import { useOptionItems } from './hooks/useOptionItems.ts'
import styles from './style/singleOption.module.less'

/**
 * 单选选项组件的属性接口
 * @interface SingleOptionProps
 * @property {CDEFilterOptionFront[]} [itemOption] - 选项列表
 * @property {Function} [changeOptionCallback] - 选项变更回调函数
 * @property {string} [value] - 当前选中的值
 * @property {Partial<CDEFilterItem>} [info] - 过滤器项的附加信息
 */
interface SingleOptionProps {
  itemOption?: CDEFilterOptionFront[]
  changeOptionCallback?: (value: string) => void
  value?: string
  info?: Partial<CDEFilterItem>
}

export const SingleOption: FC<SingleOptionProps> = ({
  itemOption = [],
  changeOptionCallback = () => null,
  value = '',
  info,
}) => {
  // 验证选项格式是否为单选类型
  if (!isSingleCDEFilterOption(itemOption)) {
    console.error('itemOption is not single option', itemOption)
    return null
  }

  // 获取处理后的选项列表
  const { options } = useOptionItems({
    itemOption,
    selfDefine: info?.selfDefine,
  })

  // 使用自定义值处理钩子
  const { customValue, handleDateValueChange, handleNumberValueChange, validateCustomValue } = useCustomValue({
    defaultValue: value,
    itemOption,
    onValueChange: (newValue: string) => {
      // 如果自定义值为空，则设置为 'any'
      if (newValue === '') {
        changeOptionCallback('')
        return
      }
      changeOptionCallback(newValue)
    },
  })

  // 计算当前选中的值
  const valueParsed = useMemo(() => {
    const optionValues = itemOption.map((option) => option.value)
    if (value && !optionValues.includes(value)) {
      return 'custom'
    }
    return value || 'any'
  }, [value, itemOption])

  /**
   * 处理选项变更事件
   * @param {RadioChangeEvent} e - 单选框变更事件
   */
  const onChange: RadioGroupProps['onChange'] = (e) => {
    // @ts-expect-error wind ui
    const value = e.target.value
    // 处理"不限"选项
    if (value === 'any') {
      changeOptionCallback('')
      return
    }
    // 处理自定义选项
    if (value === 'custom') {
      if (!validateCustomValue()) {
        return
      }
      changeOptionCallback(customValue || '')
      return
    }
    // 处理普通选项
    changeOptionCallback(value)
  }

  return (
    <Radio.Group value={valueParsed} onChange={onChange} className={styles.radioGroup}>
      {options.map((item) => (
        <div
          key={String(item.value)}
          className={classNames(styles.radioGroupItem, {
            [styles.checked]: valueParsed === String(item.value),
          })}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()

            // 模拟单选框点击事件
            const fakeEvent = {
              target: { value: String(item.value) },
            }
            // @ts-expect-error 简化事件处理
            onChange(fakeEvent)
          }}
        >
          <Radio
            value={String(item.value)}
            className={classNames({ [styles['custom-radio']]: item.value === 'custom' })}
          >
            <span>{item.name}</span>
            {/* 渲染自定义输入组件 */}
            {item.value === 'custom' && (
              <CustomInput
                type={info?.selfDefine === 2 ? 'number' : 'date'}
                value={customValue}
                onDateChange={handleDateValueChange}
                onNumberChange={handleNumberValueChange}
                itemRemark={info?.itemRemark}
              />
            )}
          </Radio>
        </div>
      ))}
    </Radio.Group>
  )
}
