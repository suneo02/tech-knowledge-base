import { DataNode } from '@wind/wind-ui/lib/tree'
import { useMemo } from 'react'
import { generateCustomTreeNodes } from './TreeNodes'

interface UseReportTreeNodesProps {
  originalTreeNodes: DataNode[] // Consider using a more specific type if available
  hiddenNodeIds: string[]
  handleToggleNodeVisibility: (nodeId: string) => void
}

export const useReportTreeNodeRender = ({
  originalTreeNodes,
  hiddenNodeIds,
  handleToggleNodeVisibility,
}: UseReportTreeNodesProps) => {
  const treeNodes = useMemo(() => {
    return generateCustomTreeNodes({
      nodes: originalTreeNodes,
      hiddenNodeIds,
      onToggleVisibility: handleToggleNodeVisibility,
    })
  }, [originalTreeNodes, hiddenNodeIds, handleToggleNodeVisibility])

  return {
    originalTreeNodes,
    treeNodes,
  }
}
