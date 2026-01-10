import { Tree } from '@wind/wind-ui'
import React from 'react'
import { CorpMenuData } from '../../menu/type'

const { TreeNode } = Tree

const MenuNodeTitle = ({ item, searchValue }: { item: CorpMenuData; searchValue: string | null }) => {
  const titleStr = (item.titleStr || (typeof item.title === 'string' ? item.title : '')) as string
  const titleClass = item.disabled ? 'menu-disabled' : undefined

  // 阻止点击事件冒泡，防止触发选中跳转，但允许展开
  const handleClick = (e: React.MouseEvent) => {
    if (item.disabled) {
      e.stopPropagation()
      e.preventDefault()
    }
  }

  const index =
    !item.disabled && searchValue && titleStr ? titleStr.toUpperCase().indexOf(searchValue.toUpperCase()) : -1
  const beforeStr = titleStr && index > -1 ? titleStr.substring(0, index) : ''
  const afterStr =
    !item.disabled && searchValue && titleStr && index > -1 ? titleStr.substring(index + searchValue.length) : ''

  if (index > -1 && searchValue) {
    return (
      <span className={titleClass} title={`${beforeStr}${searchValue}${afterStr}`} onClick={handleClick}>
        {beforeStr}
        <span className="menu-highlight-txt">{titleStr.substring(index, index + searchValue.length)}</span>
        {afterStr}
        {item.titleNum}
      </span>
    )
  }

  return (
    <span className={titleClass} onClick={handleClick}>
      {titleStr || item.title}
      {item.titleNum}{' '}
    </span>
  )
}

export const renderMenuTreeNodes = (data: CorpMenuData[], searchValue: string | null, depth?: number) => {
  return data.map((item, idx) => {
    try {
      if (!item.key) return null

      const title = <MenuNodeTitle item={item} searchValue={searchValue} />

      if (item.children && item.children.length) {
        return (
          <TreeNode
            key={item.key}
            title={title}
            disabled={false}
            selectable={!item.disabled}
            data-uc-id="AsUcvftzLc"
            data-uc-ct="treenode"
            data-uc-x={item.key}
          >
            {renderMenuTreeNodes(item.children, searchValue, 1)}
          </TreeNode>
        )
      } else if (!depth) {
        return (
          <TreeNode
            key={item.key}
            title={title}
            disabled={false}
            selectable={!item.disabled}
            data-uc-id="1dUvF-N1rJ"
            data-uc-ct="treenode"
            data-uc-x={item.key}
          >
            <TreeNode
              className="menu-none"
              key={item.key + '-' + idx}
              title={' '}
              disabled
              data-uc-id="_HEUTadKLO"
              data-uc-ct="treenode"
              data-uc-x={item.key + '-' + idx}
            ></TreeNode>
          </TreeNode>
        )
      }
      return (
        <TreeNode
          key={item.key}
          title={title}
          disabled={item.disabled}
          data-uc-id="D18iuyqaAU"
          data-uc-ct="treenode"
          data-uc-x={item.key}
        ></TreeNode>
      )
    } catch (error) {
      console.error(error)
      return null
    }
  })
}
