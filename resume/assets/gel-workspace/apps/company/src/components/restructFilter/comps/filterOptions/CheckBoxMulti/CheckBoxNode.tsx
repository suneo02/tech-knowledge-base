import { Checkbox } from '@wind/wind-ui'
import { getCheckBoxItemValue, getOptionsByItem, hasGrandChildren } from 'cde'
import { CDEFilterOption } from 'gel-api'
import React, { FC } from 'react'
import { CheckBoxComp } from './comp'
import { useSelectionContext } from './ctx'

/**
 * 这是一个递归组件，用于渲染不确定深度的复选框树。
 * 它为传入的`item`渲染一个主复选框，并在其下根据子节点的结构渲染下一层：
 * 1. 如果子节点是叶子节点（没有更深的层级），则渲染为一个 Checkbox.Group。
 * 2. 如果子节点是分支节点（有更深的层级），则为每个子节点递归渲染一个 CheckBoxNode。
 */
export const CheckBoxNode: FC<{
  item: CDEFilterOption
  level: number
}> = ({ item, level }) => {
  // --- 状态计算 ---
  const { calculateItemState, handleGroupChange, getGroupValue } = useSelectionContext()
  const { checked, indeterminate } = calculateItemState(getCheckBoxItemValue(item))

  // --- 渲染逻辑 ---
  const childrenAreLeaves = !hasGrandChildren(item)
  const nodeTypeClass = childrenAreLeaves ? 'checkbox-node-leaf-parent' : 'checkbox-node-branch'

  const renderChildren = () => {
    /* 根据子节点类型渲染下一层 */

    if (!(checked || indeterminate) || !item.itemOption) {
      return null
    }

    return (
      <div className="checkbox-node-children">
        {childrenAreLeaves ? (
          // 叶子节点：渲染 Checkbox.Group
          <Checkbox.Group
            style={{ display: 'block' }}
            options={getOptionsByItem(item)}
            value={getGroupValue(getCheckBoxItemValue(item))}
            onChange={(newlySelected) => {
              handleGroupChange(newlySelected.map(String), getCheckBoxItemValue(item))
            }}
            data-uc-id="e_efvh95dP"
            data-uc-ct="checkbox"
          />
        ) : (
          // 分支节点：递归渲染 CheckBoxNode
          item.itemOption.map((child) => <CheckBoxNode key={String(child.value)} item={child} level={level + 1} />)
        )}
      </div>
    )
  }

  return (
    <div className={`checkbox-node-level-${level} ${nodeTypeClass}`}>
      <CheckBoxComp item={item} />
      {renderChildren()}
    </div>
  )
}
