import { EyeInvisibleO, EyeO } from '@wind/icons'
import { Button } from '@wind/wind-ui'
import { DataNode } from '@wind/wind-ui/lib/tree'
import classNames from 'classnames'
import React from 'react'
import styles from './index.module.less'

// Props for the generateCustomTreeNodes helper
interface GenerateCustomTreeNodesProps {
  nodes: any[] // Consider using a more specific type if available
  hiddenNodeIds: string[]
  onToggleVisibility: (nodeId: string) => void
}

// Function to recursively transform treeData to add visibility toggle and apply styles
export function generateCustomTreeNodes({
  nodes,
  hiddenNodeIds,
  onToggleVisibility,
}: GenerateCustomTreeNodesProps): DataNode[] {
  return nodes.map((node) => {
    const isHidden = hiddenNodeIds.includes(node.key)
    const originalTitle = node.title || node.key // Fallback to key if title is not present

    return {
      ...node,
      title: (
        <span
          className={classNames(styles['tree-node-title-wrapper'], {
            [styles['tree-node-hidden']]: isHidden,
          })}
        >
          <span className={styles['tree-node-label']}>{originalTitle}</span>
          <Button
            className={styles['visibility-toggle-btn']}
            type="text"
            icon={
              isHidden ? (
                <EyeInvisibleO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
              ) : (
                <EyeO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
              )
            }
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation() // Prevent node selection/expansion
              onToggleVisibility(node.key)
            }}
            size="small"
          />
        </span>
      ),
      className: isHidden ? styles['tree-node-overall-hidden'] : '', // Optional: if Tree supports className per node
      children: node.children
        ? generateCustomTreeNodes({
            nodes: node.children,
            hiddenNodeIds,
            onToggleVisibility,
          })
        : undefined,
      disabled: isHidden,
    }
  })
}
