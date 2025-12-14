import React, { useState, useEffect, useMemo } from 'react'
import { Checkbox } from '@wind/wind-ui'
import { CustomComponentProps, FilterOption } from '../../../types'
import styles from './index.module.less'

const PREFIX = 'tree-checkbox'

const TreeCheckbox: React.FC<CustomComponentProps> = ({ options = [], value, onChange }) => {
  const [checkedValues, setCheckedValues] = useState<Set<string | number>>(new Set())
  const [expandedNodes, setExpandedNodes] = useState<Set<string | number>>(new Set())

  // Memoize flattened options and leaf keys for performance
  const { flatOptions, leafKeys } = useMemo(() => {
    const flat: Record<string | number, FilterOption & { parent?: string | number }> = {}
    const leaves = new Set<string | number>()

    function traverse(option: FilterOption, parent?: string | number) {
      flat[option.value] = { ...option, parent }
      if (option.children && option.children.length > 0) {
        option.children.forEach((child) => traverse(child, option.value))
      } else {
        leaves.add(option.value)
      }
    }

    options.forEach((opt) => traverse(opt))
    return { flatOptions: flat, leafKeys: leaves }
  }, [options])

  // Effect to sync with external value changes
  useEffect(() => {
    const values = Array.isArray(value?.value) ? value.value : []
    const externalValues = new Set(values as string[])
    setCheckedValues(externalValues)
  }, [value])

  const getDescendantLeaves = useMemo(() => {
    const cache = new Map<string | number, (string | number)[]>()

    return (nodeValue: string | number): (string | number)[] => {
      if (cache.has(nodeValue)) {
        return cache.get(nodeValue)!
      }

      const descendants: (string | number)[] = []
      const queue: (string | number)[] = [nodeValue]
      const visited = new Set<string | number>()

      while (queue.length > 0) {
        const current = queue.shift()!
        if (visited.has(current)) continue
        visited.add(current)

        const option = flatOptions[current]

        if (option?.children && option.children.length > 0) {
          option.children.forEach((child) => queue.push(child.value))
        } else if (leafKeys.has(current)) {
          descendants.push(current)
        }
      }
      cache.set(nodeValue, descendants)
      return descendants
    }
  }, [flatOptions, leafKeys])

  useEffect(() => {
    const newExpandedNodes = new Set<string | number>()
    if (checkedValues.size > 0) {
      Object.values(flatOptions).forEach((option) => {
        if (option.children && option.children.length > 0) {
          const descendantLeaves = getDescendantLeaves(option.value)
          const checkedLeafCount = descendantLeaves.filter((leaf) => checkedValues.has(leaf)).length
          if (checkedLeafCount > 0) {
            newExpandedNodes.add(option.value)
          }
        }
      })
    }
    setExpandedNodes(newExpandedNodes)
  }, [checkedValues, flatOptions, getDescendantLeaves])

  const handleCheck = (node: FilterOption, checked: boolean) => {
    const newChecked = new Set(checkedValues)
    const descendantLeaves = getDescendantLeaves(node.value)

    if (descendantLeaves.length === 0 && leafKeys.has(node.value)) {
      descendantLeaves.push(node.value)
    }

    descendantLeaves.forEach((leaf) => {
      if (checked) newChecked.add(leaf)
      else newChecked.delete(leaf)
    })

    if (node.children?.length) {
      setExpandedNodes((prev) => {
        const newExpanded = new Set(prev)
        if (!checked) {
          newExpanded.delete(node.value)
        } else {
          newExpanded.add(node.value)
        }
        return newExpanded
      })
    }

    const finalLeafValues = Array.from(newChecked).filter((v) => leafKeys.has(v))
    setCheckedValues(new Set(finalLeafValues))
    onChange?.({ value: finalLeafValues as string[] })
  }

  const renderNode = (option: FilterOption) => {
    const descendantLeaves = getDescendantLeaves(option.value)
    const checkedLeafCount = descendantLeaves.filter((leaf) => checkedValues.has(leaf)).length

    const isChecked =
      descendantLeaves.length > 0 ? checkedLeafCount === descendantLeaves.length : checkedValues.has(option.value)
    const isIndeterminate = checkedLeafCount > 0 && checkedLeafCount < descendantLeaves.length

    return (
      <Checkbox
        checked={isChecked}
        indeterminate={isIndeterminate}
        // @ts-expect-error wind-ui
        onChange={(e) => handleCheck(option, e.target.checked)}
      >
        <span className={styles[`${PREFIX}-label`]}>{option.label}</span>
      </Checkbox>
    )
  }

  return (
    <div className={styles[`${PREFIX}-container`]}>
      <div className={styles[`${PREFIX}-wrapper`]}>{options.map((option) => renderNode(option))}</div>
      {expandedNodes.size ? (
        <div className={styles[`${PREFIX}-card`]}>
          {Array.from(expandedNodes).map((node) => (
            <div key={node} className={styles[`${PREFIX}-card-item`]}>
              <div className={styles[`${PREFIX}-card-item-title`]}>{flatOptions[node].label}</div>
              <div>{flatOptions[node].children?.map((child) => renderNode(child))}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default TreeCheckbox
