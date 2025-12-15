import { CDEFilterItem } from 'gel-api'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { buildRelationMaps, IRelationMaps } from '../utils/checkBoxSelection'

// For testing purposes
export const isChecked = (itemValue: string, selectedValues: Set<string>, parentMap: Map<string, string>): boolean => {
  if (selectedValues.has(itemValue)) return true
  let parent = parentMap.get(itemValue)
  while (parent) {
    if (selectedValues.has(parent)) return true
    parent = parentMap.get(parent)
  }
  return false
}
/**
 * @function _uncheckItem
 * @description 处理取消勾选一个节点的逻辑。这是最复杂的操作，因为它需要"打散"一个被选中的父节点。
 *
 * @param {string} itemValue - 被用户直接取消勾选的节点的 `value`。
 * @param {Set<string>} currentValues - 当前存储在 state 中的 `selectedValues` 集合。
 * @param {Pick<IRelationMaps, 'parentMap' | 'childrenMap'>} maps - 关系查找表。
 *
 * @returns {Set<string>} 返回一个新的 `Set`，表示更新后的选择状态。
 *
 * @logic
 * 1.  **找到责任祖先 (Find Responsible Ancestor)**:
 *     -   首先确定是哪个节点导致了 `itemValue` 被勾选。这个节点被称为 `anchorValue`。
 *     -   如果 `itemValue` 本身就在 `currentValues` 里，那么它自己就是 `anchorValue`。
 *     -   如果 `itemValue` 不在，就向上遍历其祖先，找到第一个存在于 `currentValues` 中的祖先作为 `anchorValue`。
 *
 * 2.  **移除锚点 (Remove Anchor)**:
 *     -   从 `selectedValues` 集合中将 `anchorValue` 移除。这是取消勾选的核心。
 *
 * 3.  **打散子集 (Break Apart Children)**:
 *     -   获取 `anchorValue` 的所有**直属子节点**。
 *     -   将这些子节点**全部添加**到 `selectedValues` 中，但有一个例外：那个包含了 `itemValue` 的分支需要被排除。
 *     -   例如，如果取消勾选的是 C1.1 (父为C1, 祖父为P)，而 `anchorValue` 是 P，那么 P 的所有子节点（C1, C2, C3）都会被加入，但 C1 不会，因为它在被取消的分支上。
 */
// For testing purposes
export const _uncheckItem = (
  itemValue: string,
  currentValues: Set<string>,
  { parentMap, childrenMap }: Pick<IRelationMaps, 'parentMap' | 'childrenMap'>
) => {
  const newSelectedValues = new Set(currentValues)

  // 1. 找到对 itemValue 选中状态负责的 anchorValue
  let anchorValue = itemValue
  if (!newSelectedValues.has(itemValue)) {
    let parent = parentMap.get(itemValue)
    while (parent) {
      if (newSelectedValues.has(parent)) {
        anchorValue = parent
        break
      }
      parent = parentMap.get(parent)
    }
  }

  // 2. 移除 anchorValue
  newSelectedValues.delete(anchorValue)

  // 3. 仅当取消勾选的节点是由其祖先节点（anchorValue）的勾选状态决定时，才需要"打散"祖先节点
  if (anchorValue !== itemValue) {
    // 从 itemValue 开始向上遍历，直到 anchorValue 的直接子节点。
    // 在每一层，将被取消选中节点的所有同级节点 (siblings) 添加回 selected set 中。
    let nodeOnUncheckPath = itemValue
    let parentOfNode = parentMap.get(nodeOnUncheckPath)

    while (parentOfNode && parentOfNode !== anchorValue) {
      const siblings = childrenMap.get(parentOfNode) || []
      siblings.forEach((sibling) => {
        if (sibling !== nodeOnUncheckPath) {
          newSelectedValues.add(sibling)
        }
      })
      nodeOnUncheckPath = parentOfNode
      parentOfNode = parentMap.get(nodeOnUncheckPath)
    }

    // 最后，处理 anchorValue 的直属子节点，将被取消的分支排除掉。
    const childrenOfAnchor = childrenMap.get(anchorValue) || []
    childrenOfAnchor.forEach((child) => {
      if (child !== nodeOnUncheckPath) {
        newSelectedValues.add(child)
      }
    })
  }

  return newSelectedValues
}
/**
 * @function _checkItem
 * @description 处理勾选一个节点的逻辑，遵循"最高节点优先"原则。
 *
 * @param {string} itemValue - 被用户勾选的节点的 `value`。
 * @param {Set<string>} currentValues - 当前的 `selectedValues` 集合。
 * @param {IRelationMaps} maps - 包含所有关系（父、子、后代）的查找表。
 *
 * @returns {Set<string>} 返回一个新的 `Set`，表示更新后的选择状态。
 *
 * @logic
 * 1.  **清理后代 (Cleanup Descendants)**:
 *     -   为了遵循"最高节点优先"，当一个父节点被勾选时，它的所有后代节点都不能存在于 `selectedValues` 中。
 *     -   因此，首先遍历 `itemValue` 的所有后代，并将它们从 `selectedValues` 中移除。
 *
 * 2.  **添加自身 (Add Self)**:
 *     -   将 `itemValue` 自己的 `value` 添加到 `selectedValues` 集合中。
 *
 * 3.  **向上整理 (Reconcile Ancestors)**:
 *     -   从 `itemValue` 的父节点开始，向上循环检查。
 *     -   在每一层，检查该父节点的所有直属子节点是否都已处于 `checked` 状态。
 *     -   如果一个父节点的所有子节点都满足 `checked` 状态，说明这个父节点现在可以被"完全勾选"。
 *     -   这时，就将它的所有子节点从 `selectedValues` 中移除，并把父节点自己添加进去，从而让状态更简洁。
 *     -   然后继续向上检查其父节点，重复此过程，直到根节点或不再满足条件的父节点。
 */
// For testing purposes
export const _checkItem = (
  itemValue: string,
  currentValues: Set<string>,
  { parentMap, childrenMap, descendantsMap }: IRelationMaps
) => {
  const newSelectedValues = new Set(currentValues)
  const descendants = descendantsMap.get(itemValue) || []
  descendants.forEach((d) => newSelectedValues.delete(d))
  newSelectedValues.add(itemValue)
  let parent = parentMap.get(itemValue)
  while (parent) {
    const siblings = childrenMap.get(parent) || []
    const allSiblingsChecked = siblings.every((s) => isChecked(s, newSelectedValues, parentMap))
    if (allSiblingsChecked) {
      siblings.forEach((s) => newSelectedValues.delete(s))
      newSelectedValues.add(parent)
      parent = parentMap.get(parent)
    } else {
      break
    }
  }
  return newSelectedValues
}

/**
 * @hook useSelection (v3.0 - Minimal State)
 * @description Manages complex selection logic using a minimal state representation.
 */
export const useSelection = (
  optionsFromConfig: CDEFilterItem['itemOption'],
  value: string[],
  onChange: (value: string[]) => void
) => {
  const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set())

  const maps = useMemo(() => buildRelationMaps(optionsFromConfig), [optionsFromConfig])
  const { parentMap, childrenMap, descendantsMap } = maps

  useEffect(() => {
    // Note: The incoming `value` array should already be minimal.
    setSelectedValues(new Set(value))
  }, [value])

  const calculateItemState = useCallback(
    (itemValue: string) => {
      const checked = isChecked(itemValue, selectedValues, parentMap)
      if (checked) return { checked: true, indeterminate: false }

      const descendants = descendantsMap.get(itemValue) || []
      if (descendants.length === 0) return { checked: false, indeterminate: false }

      const checkedDescendants = descendants.filter((d) => isChecked(d, selectedValues, parentMap)).length
      const indeterminate = checkedDescendants > 0 && checkedDescendants < descendants.length

      return { checked: false, indeterminate }
    },
    [selectedValues, parentMap, descendantsMap]
  )

  const handleGroupChange = useCallback(
    (newValuesForGroup: string[], groupParentValue: string) => {
      let intermediateSet = new Set(selectedValues)
      const childrenOfGroup = childrenMap.get(groupParentValue) || []
      const previouslyCheckedValues = new Set(
        childrenOfGroup.filter((child) => isChecked(child, selectedValues, parentMap))
      )
      const newValuesSet = new Set(newValuesForGroup)

      const added = childrenOfGroup.filter((v) => newValuesSet.has(v) && !previouslyCheckedValues.has(v))
      const removed = childrenOfGroup.filter((v) => !newValuesSet.has(v) && previouslyCheckedValues.has(v))

      removed.forEach((itemValue) => {
        intermediateSet = _uncheckItem(itemValue, intermediateSet, maps)
      })

      added.forEach((itemValue) => {
        intermediateSet = _checkItem(itemValue, intermediateSet, maps)
      })

      onChange(Array.from(intermediateSet))
      setSelectedValues(intermediateSet)
    },
    [selectedValues, onChange, maps]
  )

  const getGroupValue = useCallback(
    (groupParentValue: string): string[] => {
      const children = childrenMap.get(groupParentValue) || []
      return children.filter((childValue) => isChecked(childValue, selectedValues, parentMap))
    },
    [selectedValues, parentMap, childrenMap]
  )

  const handleItemChange = useCallback(
    (newChecked: boolean, itemValue: string) => {
      let newSelectedValues: Set<string>
      if (newChecked) {
        newSelectedValues = _checkItem(itemValue, selectedValues, maps)
      } else {
        newSelectedValues = _uncheckItem(itemValue, selectedValues, maps)
      }
      onChange(Array.from(newSelectedValues))
      setSelectedValues(newSelectedValues)
    },
    [selectedValues, onChange, maps]
  )

  return {
    selectedValues,
    calculateItemState,
    handleGroupChange,
    handleItemChange,
    getGroupValue,
  }
}
