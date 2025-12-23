import { DataNode } from '@wind/wind-ui/lib/tree'
import { useState } from 'react'
import { updateHiddenTreeNodes } from 'report-util/tree'

export const useTreeHiddenStatus = (treeNodes: DataNode[]) => {
  const [hiddenNodeIds, setHiddenNodeIds] = useState<string[]>([])

  const handleToggleNodeVisibility = (nodeId: string) => {
    setHiddenNodeIds((prevHiddenNodeIds) => {
      const oldIsHidden = prevHiddenNodeIds.includes(nodeId)
      const newIsHidden = !oldIsHidden

      const newHiddenNodeIds = updateHiddenTreeNodes(treeNodes, prevHiddenNodeIds, nodeId, !newIsHidden, {
        getId: (node) => String(node.key),
        getChildren: (node) => node.children,
      })
      return newHiddenNodeIds
    })
  }

  return {
    hiddenNodeIds,
    handleToggleNodeVisibility,
  }
}
