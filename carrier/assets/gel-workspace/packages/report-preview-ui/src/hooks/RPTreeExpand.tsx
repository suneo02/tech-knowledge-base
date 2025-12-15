import { DataNode } from '@wind/wind-ui/lib/tree'
import { useCallback, useEffect, useMemo, useState } from 'react'

const getAllExpandableKeys = (nodes: DataNode[] | undefined): string[] => {
  if (!nodes) {
    return []
  }
  const keys: string[] = []
  const collectKeys = (currentNodes: DataNode[]) => {
    currentNodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        keys.push(String(node.key))
        collectKeys(node.children)
      }
    })
  }
  collectKeys(nodes)
  return keys
}

export const useReportTreeExpand = (treeNodes: DataNode[] | undefined) => {
  const allExpandableKeys = useMemo(() => getAllExpandableKeys(treeNodes), [treeNodes])

  const [expandedKeys, setExpandedKeysInternal] = useState<string[]>(allExpandableKeys)
  const [ifAllExpanded, setIfAllExpanded] = useState<boolean>(true)

  useEffect(() => {
    // Initialize or update when treeNodes change
    const newAllKeys = getAllExpandableKeys(treeNodes)
    setExpandedKeysInternal(newAllKeys)
    setIfAllExpanded(true)
  }, [treeNodes, getAllExpandableKeys])

  useEffect(() => {
    // Update ifAllExpanded based on expandedKeys and allExpandableKeys
    if (allExpandableKeys.length === 0) {
      setIfAllExpanded(true) // No expandable nodes, so effectively all are "expanded"
      return
    }
    const allKeysSet = new Set(allExpandableKeys)
    const expandedKeysSet = new Set(expandedKeys)
    setIfAllExpanded(
      allExpandableKeys.every((key: string) => expandedKeysSet.has(key)) && allKeysSet.size === expandedKeysSet.size
    )
  }, [expandedKeys, allExpandableKeys])

  const setExpandedKeys = useCallback(
    (keys: string[]) => {
      setExpandedKeysInternal(keys)
    },
    [setExpandedKeysInternal]
  )

  const toggleAll = useCallback(() => {
    if (ifAllExpanded) {
      setExpandedKeysInternal([])
    } else {
      setExpandedKeysInternal(allExpandableKeys)
    }
  }, [ifAllExpanded, allExpandableKeys, setExpandedKeysInternal])

  return {
    expandedKeys,
    setExpandedKeys,
    ifAllExpanded,
    toggleAll,
  }
}
