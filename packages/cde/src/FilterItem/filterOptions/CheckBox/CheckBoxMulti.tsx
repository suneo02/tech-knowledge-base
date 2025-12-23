import { CDEFilterOptionFront } from '@/types/filter.ts'
import { Card, Checkbox } from '@wind/wind-ui'
import { CheckboxProps } from '@wind/wind-ui/lib/checkbox/Checkbox'
import classNames from 'classnames'
import React from 'react'
import { FilterLabel } from '../FilterLabel.tsx'
import { SecondLevelCheckbox } from './SecondLevelCheckbox.tsx'
import styles from './style/checkBoxMulti.module.less'
import { CheckBoxMultiProps } from './types.ts'
import { getAllPossibleValues, isCheckAll, isIndeterminate, isVisible } from './utils.ts'

/**
 * 多级复选框组件（纯受控组件）
 * 支持最多三级嵌套的复选框结构，具有全选、半选等状态管理
 *
 * 组件结构:
 * - 顶级复选框: 用于控制整个分组的选中状态
 * - 二级复选框: 使用SecondLevelCheckbox组件渲染，可以包含三级选项
 * - 三级复选框组: 通过Checkbox.Group渲染在二级复选框下
 *
 * 选中状态逻辑:
 * - 当顶级复选框被选中时，所有子选项被选中
 * - 当部分子选项被选中时，顶级复选框呈现半选状态(indeterminate)
 * - 当所有子选项被选中时，顶级复选框呈现全选状态(checked)
 *
 * 作为纯受控组件，状态完全由父组件通过props传入和控制，
 * 组件内部不保存任何状态，只通过回调函数通知父组件状态变更。
 */
export const CheckBoxMulti: React.FC<CheckBoxMultiProps> = ({
  optss,
  value = [],
  onChange = () => null,
  className,
}) => {
  // 计算每个选项的选中值
  const options = React.useMemo(() => {
    return optss.map((opt) => {
      // 获取此选项及其子选项的所有可能值
      const allPossibleValues = getAllPossibleValues(opt)

      // 计算此选项当前选中的值
      const selectedValues = value.filter((v) => allPossibleValues.includes(v))

      return {
        ...opt,
        // 不再存储为 values 属性，而是作为计算得到的临时数据
        _selectedValues: selectedValues,
      }
    })
  }, [optss, value])

  /**
   * 通知父组件值变更
   * @param newValues 新的选中值数组
   */
  const notifyValueChange = (newValues: string[]) => {
    onChange(newValues.join(','))
  }

  /**
   * 处理顶级复选框变更
   * 当顶级复选框状态变化时:
   * - 选中: 选中该分组下的所有子选项
   * - 取消选中: 取消该分组下的所有子选项
   *
   * @param e 复选框变更事件
   * @param item 当前选项数据
   */
  const handleTopLevelChange = (
    e: Parameters<NonNullable<CheckboxProps['onChange']>>[0],
    item: CDEFilterOptionFront
  ) => {
    const allPossibleValues = getAllPossibleValues(item)
    let newValues = [...value]

    if (e.target.checked) {
      // 选中: 添加所有子选项的值
      newValues = [...new Set([...newValues, ...allPossibleValues])]
    } else {
      // 取消选中: 移除所有子选项的值
      newValues = newValues.filter((v) => !allPossibleValues.includes(v))
    }

    notifyValueChange(newValues)
  }

  /**
   * 处理子选项值变更
   * @param values 新的选中值数组
   * @param item 当前选项数据
   */
  const handleValueChange = (values: string[], item: CDEFilterOptionFront) => {
    const allPossibleValues = getAllPossibleValues(item)

    // 从当前值中移除此选项的所有可能值
    let newValues = value.filter((v) => !allPossibleValues.includes(v))

    // 添加新选中的值
    newValues = [...newValues, ...values]

    notifyValueChange(newValues)
  }

  /**
   * 获取指定选项的选中值
   * @param item 选项数据
   * @returns 已选中的值数组
   */
  const getSelectedValues = (item: CDEFilterOptionFront): string[] => {
    const allPossibleValues = getAllPossibleValues(item)
    return value.filter((v) => allPossibleValues.includes(v))
  }

  return (
    <div className={classNames(styles['checkbox-multi'], className)}>
      {/* 顶级复选框组 - 使用与CheckBoxOption相同的样式结构 */}
      <div className={styles['checkbox-multi--horizontal']}>
        {options.map((item) => (
          <div
            key={`top-${item.name}`}
            className={classNames({
              checked: isCheckAll(item, value),
            })}
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()

              // 模拟复选框点击
              const fakeEvent = {
                target: { checked: !isCheckAll(item, value) },
              }
              // @ts-expect-error 简化事件处理
              handleTopLevelChange(fakeEvent, item)
            }}
          >
            <Checkbox
              indeterminate={isIndeterminate(item, value)}
              checked={isCheckAll(item, value)}
              // @ts-expect-error wind-ui
              onChange={(e) => handleTopLevelChange(e, item)}
            >
              {item.name}
            </Checkbox>
          </div>
        ))}
      </div>

      {/* 嵌套选项组 - 仅显示被选中或半选中的分组 */}
      {options.map((item) => {
        // 动态计算是否显示此选项
        if (!isVisible(item, value)) return null

        // 获取当前选项的选中值
        const selectedValues = getSelectedValues(item)

        return item.itemOption?.length ? (
          <div key={`nested-${item.name}`} className={classNames(styles['checkbox-nested'], 'card-container')}>
            <Card bordered title={item.itemOption?.length ? <FilterLabel itemName={item.name} /> : null}>
              {item.itemOption?.map((subItem) => (
                <SecondLevelCheckbox
                  key={typeof subItem.value === 'string' ? subItem.value : String(subItem.value)}
                  item={item}
                  subItem={subItem}
                  selectedValues={selectedValues}
                  onChange={(values) => handleValueChange(values, item)}
                />
              ))}
            </Card>
          </div>
        ) : null
      })}
    </div>
  )
}
