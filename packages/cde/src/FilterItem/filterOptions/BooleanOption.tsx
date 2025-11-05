import { Radio } from '@wind/wind-ui'
import { RadioGroupProps } from '@wind/wind-ui/lib/radio/group'
import classNames from 'classnames'
import { intl } from 'gel-util/intl'
import { FC, useMemo } from 'react'
import styles from './style/hasOrNotOption.module.less'

interface Option {
  name: string
  value: string
}

interface BooleanOptionProps {
  value?: string
  changeOptionCallback?: (values: string) => void
  itemOption?: Option[]
}

/**
 * 布尔选项组件
 * 提供布尔值的选择功能，类似于SingleOption的交互体验
 */
export const BooleanOption: FC<BooleanOptionProps> = ({
  value = '',
  changeOptionCallback = () => null,
  itemOption = [],
}) => {
  // 计算当前选中的值
  const valueParsed = useMemo(() => {
    return value || 'any'
  }, [value])

  // 添加默认的"不限"选项
  const options = useMemo(() => {
    let _options = [...itemOption]
    _options.unshift({
      name: intl('138649', '不限'),
      value: 'any',
    })

    return _options
  }, [itemOption])

  /**
   * 处理选项变更事件
   * @param {RadioChangeEvent} e - 单选框变更事件
   */
  const onChange: RadioGroupProps['onChange'] = (e) => {
    // @ts-expect-error wind ui
    const value = e.target.value
    if (value === 'any') {
      changeOptionCallback('')
      return
    }
    changeOptionCallback(value)
  }

  return (
    <div className={styles.container}>
      <Radio.Group value={valueParsed} onChange={onChange} className={styles.radioGroup}>
        {options.map((item) => (
          <div
            key={item.value}
            className={classNames(styles.radioGroupItem, {
              [styles.checked]: valueParsed === item.value,
            })}
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()

              // 模拟单选框点击事件
              const fakeEvent = {
                target: { value: item.value },
              }
              // @ts-expect-error 简化事件处理
              onChange(fakeEvent)
            }}
          >
            <Radio value={item.value}>
              <span>{item.name}</span>
            </Radio>
          </div>
        ))}
      </Radio.Group>
    </div>
  )
}
