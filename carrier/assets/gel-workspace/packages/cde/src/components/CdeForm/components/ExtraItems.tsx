import { Form } from 'antd'
import React from 'react'
import { CDEFormConfigItem } from '../types'

/**
 * 检查是否应该显示额外的筛选器。
 * @param fieldValue - 表单字段的值，格式通常为 { value: any }。
 * @returns {boolean}
 */
const shouldShowExtra = (fieldValue: { value: unknown }): boolean => {
  if (!fieldValue?.value) {
    return false
  }
  const { value } = fieldValue
  // hasExtra 的值可能是字符串 'true' 或数组 ['true']
  return value === 'true' || (Array.isArray(value) && value[0] === 'true')
}

/**
 * 一个独立的子组件，专门用于根据父组件的值来渲染额外的筛选器。
 * 使用 Form.useWatch 来响应式地监听值的变化。
 */
export const ExtraItems: React.FC<{
  parentItem: CDEFormConfigItem
  renderFilterItem: (item: CDEFormConfigItem) => React.ReactNode
}> = ({ parentItem, renderFilterItem }) => {
  const fieldValue = Form.useWatch(parentItem.itemId)

  if (shouldShowExtra(fieldValue) && parentItem.extraConfig?.length) {
    return (
      <>
        {parentItem.extraConfig.map((extraItem) => (
          <div key={extraItem.itemId}>{renderFilterItem(extraItem)}</div>
        ))}
      </>
    )
  }

  return null
}
