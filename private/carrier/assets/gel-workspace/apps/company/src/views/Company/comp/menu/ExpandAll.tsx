import { DownO, UpO } from '@wind/icons'
import { Button, Dropdown, Menu } from '@wind/wind-ui'
import React, { FC } from 'react'

// 树节点数据结构
interface TreeNode {
  key: string
  title?: React.ReactNode
  children?: TreeNode[]
  hasData?: boolean
}

/**
 * 获取所有树节点非叶子节点的 key（递归获取所有子节点的 key）
 * @param nodes
 */
const getAllKeysNotLeaf = (nodes: TreeNode[]): string[] => {
  let keys: string[] = []
  nodes.forEach((node) => {
    // if leaf node
    if (!node.children || node.children.length === 0) {
      return
    } else {
      keys.push(node.key)
      keys = keys.concat(getAllKeysNotLeaf(node.children))
    }
  })
  return keys
}

/**
 * 获取所有有数据节点的 key（递归）
 * @param nodes
 */
const getAllKeysWithData = (nodes: TreeNode[]): string[] => {
  let keys: string[] = []
  nodes.forEach((node) => {
    if (node.children && node.children.length > 0) {
      // 只有当节点有数据时才展开
      if (node.hasData) {
        keys.push(node.key)
        keys = keys.concat(getAllKeysWithData(node.children))
      }
    }
  })
  return keys
}

/**
 * 一键展开及收起 tree menu ，展示为下拉菜单
 */
export const ToggleCorpDetailMenu: FC<{
  treeDataAll: TreeNode[]
  treeDataDataOnly: TreeNode[]
  expandedKeys: string[]
  setExpandedKeys: React.Dispatch<React.SetStateAction<string[]>>
  setShowDisabled: (show: boolean) => void
}> = ({ treeDataAll, treeDataDataOnly, expandedKeys, setExpandedKeys, setShowDisabled }) => {
  // 展开所有节点
  const expandAll = () => {
    setShowDisabled(true)
    const allKeys = getAllKeysNotLeaf(treeDataAll)
    setExpandedKeys(allKeys)
  }

  // 仅展开有数据菜单
  const expandWithData = () => {
    setShowDisabled(false)
    const keys = getAllKeysNotLeaf(treeDataDataOnly)
    setExpandedKeys(keys)
  }

  // 收起所有节点
  const collapseAll = () => {
    setExpandedKeys([])
  }

  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'all':
        expandAll()
        break
      case 'data':
        expandWithData()
        break
      case 'none':
        collapseAll()
        break
      default:
        break
    }
  }

  const menu = (
    // @ts-ignore
    <Menu onClick={handleMenuClick} data-uc-id="menu_toggle_dropdown" data-uc-ct="menu">
      <Menu.Item key="all" data-uc-id="menu_expand_all" data-uc-ct="menuitem">
        展开全部菜单
      </Menu.Item>
      <Menu.Item key="data" data-uc-id="menu_expand_data" data-uc-ct="menuitem">
        仅展开有数据菜单
      </Menu.Item>
      <Menu.Item key="none" data-uc-id="menu_collapse_all" data-uc-ct="menuitem">
        收起
      </Menu.Item>
    </Menu>
  )

  return (
    <Dropdown overlay={menu} placement="bottomRight" data-uc-id="menu_toggle_dropdown_trigger" data-uc-ct="dropdown">
      <Button
        style={{
          fontSize: '24px',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        icon={
          expandedKeys.length === 0 ? (
            <UpO
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              data-uc-id="menu_toggle_icon"
              data-uc-ct="menufoldo"
            />
          ) : (
            <DownO
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              data-uc-id="menu_toggle_icon"
              data-uc-ct="menuunfoldo"
            />
          )
        }
        data-uc-id="menu_toggle_btn"
        data-uc-ct="button"
      />
    </Dropdown>
  )
}
