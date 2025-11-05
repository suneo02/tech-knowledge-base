import { Checkbox, Divider } from '@wind/wind-ui'
import { CheckboxProps } from '@wind/wind-ui/lib/checkbox/Checkbox'
import { CheckboxGroupProps } from '@wind/wind-ui/lib/checkbox/Group'
import React, { useMemo } from 'react'
import type { SecondLevelCheckboxProps } from './types.ts'
import styles from './style/checkBoxSecond.module.less'
import classNames from 'classnames'
/**
 * 二级复选框组件
 * 负责渲染和管理二级和三级复选框的状态
 *
 * 该组件处理两种情况:
 * 1. 二级选项包含三级选项时，管理所有子选项的选中状态和半选状态
 * 2. 二级选项没有三级选项时，作为简单的单选复选框处理
 */
export const SecondLevelCheckbox: React.FC<SecondLevelCheckboxProps> = ({ subItem, selectedValues, onChange }) => {
  // 获取所有三级选项的值（如果存在）
  const level3Values =
    subItem.itemOption?.map((l3) => (typeof l3.value === 'string' ? l3.value : String(l3.value))) || []

  // 获取当前子项的值，处理可能是字符串或字符串数组的情况
  const subItemValue =
    typeof subItem.value === 'string'
      ? subItem.value
      : Array.isArray(subItem.value) && subItem.value.length > 0
      ? String(subItem.value[0])
      : ''

  // 计算当前选中的三级选项
  const selectedLevel3 = selectedValues.filter((v) => level3Values.includes(v))

  // 计算半选状态：有选中但未全选
  const isIndeterminate = selectedLevel3.length > 0 && selectedLevel3.length < level3Values.length

  // 计算是否全选：对于有三级选项的情况，检查是否所有三级选项都被选中；否则检查当前选项是否被选中
  const isChecked = subItem.itemOption?.length
    ? selectedLevel3.length === level3Values.length && level3Values.length > 0
    : selectedValues.includes(subItemValue)

  /**
   * 处理二级复选框状态变更
   * @param e 复选框变更事件
   */
  const handleChange: CheckboxProps['onChange'] = (e) => {
    let newValues = [...selectedValues]
    if (e.target.checked) {
      // 选中时：如果有三级选项，添加所有三级选项的值；否则添加当前选项的值
      if (subItem.itemOption?.length) {
        // 使用Set去重，确保不会添加重复的值
        newValues = [...new Set([...newValues, ...level3Values])]
      } else {
        // 没有三级选项时，直接添加当前二级选项的值
        if (!newValues.includes(subItemValue)) {
          newValues.push(subItemValue)
        }
      }
    } else {
      // 取消选中时：如果有三级选项，移除所有三级选项的值；否则移除当前选项的值
      newValues = newValues.filter((v) => {
        if (subItem.itemOption?.length) {
          return !level3Values.includes(v)
        }
        return v !== subItemValue
      })
    }
    // 调用父组件传入的onChange回调，更新选中状态
    onChange(newValues)
  }

  /**
   * 处理三级复选框组状态变更
   * 保留不在当前三级选项中的已选值，更新当前三级选项的选中状态
   *
   * @param checkedValues 当前Checkbox.Group选中的值数组
   */
  const handleLevel3Change: CheckboxGroupProps['onChange'] = (checkedValues) => {
    // 过滤出非当前三级选项的已选值
    const otherValues = selectedValues.filter((v) => !level3Values.includes(v))

    // 合并当前选中的三级选项值和其他已选值
    const newValues = [...otherValues, ...checkedValues]

    onChange(newValues.map(String))
  }

  // 为Checkbox.Group准备选项，确保每个选项都有必要的属性
  const checkboxOptions = useMemo(() => {
    if (!subItem.itemOption) return []

    return subItem.itemOption.map((opt) => ({
      label: opt.name || opt.label,
      value: typeof opt.value === 'string' ? opt.value : String(opt.value),
    }))
  }, [subItem.itemOption])

  return (
    <React.Fragment key={typeof subItem.value === 'string' ? subItem.value : String(subItem.value)}>
      <div className={styles['second-checkbox-container']}>
        {/* 二级复选框 */}
        <div
          className={classNames(styles['second-checkbox-option'], {
            [styles.checked]: isChecked,
          })}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()

            // 模拟复选框点击
            const fakeEvent = {
              target: { checked: !isChecked },
            }
            // @ts-expect-error 简化事件处理
            handleChange(fakeEvent)
          }}
        >
          <Checkbox indeterminate={isIndeterminate} checked={isChecked} onChange={handleChange}>
            {subItem.label || subItem.name}
          </Checkbox>
        </div>

        {/* 渲染三级复选框组（如果存在） */}
        {(subItem.itemOption?.length ?? 0) > 0 && (
          <div className={styles['third-level-container']}>
            <Divider dashed />
            {/* @ts-expect-error wind ui */}
            <Checkbox.Group
              className={styles['second-checkbox-group']}
              value={selectedLevel3} // 只传入当前三级选项中被选中的值
              onChange={handleLevel3Change}
            >
              {checkboxOptions.map((option) => (
                <div
                  key={option.value}
                  className={classNames({
                    [styles.checked]: selectedLevel3.includes(option.value),
                  })}
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()

                    // 模拟复选框组点击
                    const newCheckedValues = [...selectedLevel3]
                    const optionIndex = newCheckedValues.indexOf(option.value)

                    if (optionIndex === -1) {
                      // 如果当前项未选中，则添加到选中列表
                      newCheckedValues.push(option.value)
                    } else {
                      // 如果当前项已选中，则从选中列表中移除
                      newCheckedValues.splice(optionIndex, 1)
                    }

                    handleLevel3Change(newCheckedValues)
                  }}
                >
                  <Checkbox value={option.value}>{option.label}</Checkbox>
                </div>
              ))}
            </Checkbox.Group>
          </div>
        )}
      </div>
    </React.Fragment>
  )
}
