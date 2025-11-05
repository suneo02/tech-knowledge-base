import { OptionProps } from '@wind/wind-ui/lib/select'
import { DataNode } from '@wind/wind-ui/lib/tree'

// Helper function to flatten tree nodes for the Select component

export function flattenTreeNodesForSelect(nodes: DataNode[], hiddenNodeIds: string[]): OptionProps[] {
  let options: OptionProps[] = []
  for (const node of nodes) {
    const label = node.title
    options.push({
      label: label,
      value: node.key,
      disabled: hiddenNodeIds.includes(String(node.key)),
    })
    if (node.children && node.children.length > 0) {
      options = options.concat(flattenTreeNodesForSelect(node.children, hiddenNodeIds))
    }
  }
  return options
}
