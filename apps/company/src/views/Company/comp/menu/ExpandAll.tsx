import React, { FC, useMemo } from 'react'
import { ToggleBtn } from '@/components/common/btn/toogleBtn.tsx'

// 树节点数据结构
interface TreeNode {
  key: string
  title: string
  children?: TreeNode[]
}

/**
 * 获取所有树节点非叶子节点的 key（递归获取所有子节点的 key）
 * @param nodes
 */
const getAllKeysNotLeaf = (nodes: TreeNode[]): string[] => {
  let keys: string[] = []
  nodes.forEach((node) => {
    // if leaf node
    if (!node.children) {
      return
    } else {
      keys.push(node.key)
      keys = keys.concat(getAllKeysNotLeaf(node.children))
    }
  })
  return keys
}
/**
 * 一键展开及收起 tree menu ，展示为图标
 */
export const ToggleCorpDetailMenu: FC<{
  treeData: TreeNode[] // 树形数据
  expandedKeys: string[] // 当前展开的节点 keys
  setExpandedKeys: React.Dispatch<React.SetStateAction<string[]>> // 更新展开的节点
}> = ({ treeData, expandedKeys, setExpandedKeys }) => {
  const ifExpanded = useMemo(() => expandedKeys.length > 0, [expandedKeys])

  // 切换展开或收起所有节点
  const toggleAll = () => {
    if (ifExpanded) {
      // 收起所有节点
      setExpandedKeys([])
    } else {
      // 展开所有节点
      const allKeys = getAllKeysNotLeaf(treeData)
      setExpandedKeys(allKeys)
    }
  }

  return <ToggleBtn ifExpanded={ifExpanded} toggle={toggleAll} />
}
