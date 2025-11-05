import { Input, Tree } from '@wind/wind-ui'
import { ToggleCorpDetailMenu } from './ExpandAll'
import { CorpDetailMenuSearchSelect } from './SearchSelect'
import intl from '@/utils/intl'
import menuStyles from './index.module.less'
const { Search } = Input
import React, { useState } from 'react'
const { TreeNode } = Tree

const CorpDetailMenu = ({
  onChange,
  selectedKeys,
  searchedMenu,
  setSearchedMenu,
  expandedKeys,
  setExpandedKeys,
  treeDatas,

  treeMenuClick,
  onExpand,
  autoExpandParent,
}: {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  setSearchedMenu: (menu: any[]) => void
  expandedKeys: string[]
  setExpandedKeys: (keys: string[]) => void
  treeDatas: any[]
  searchedMenu: any[]
  treeMenuClick: (menu: any, e: any) => void
  onExpand: (expandedKeys: string[]) => void
  autoExpandParent: boolean
  selectedKeys: string[]
}) => {
  const [searchValue, setSearchValue] = useState('')
  const loop = (data, depth?) =>
    data.map((item, idx) => {
      if (!item.key) return
      const titleStr = item.titleStr || item.title
      const index = titleStr.indexOf(searchValue)
      const beforeStr = titleStr.substr(0, index)
      const afterStr = titleStr.substr(index + searchValue.length)
      const title =
        index > -1 ? (
          <span title={`${beforeStr}${searchValue}${afterStr}`}>
            {beforeStr}
            <span className="menu-highlight-txt">{searchValue}</span>
            {afterStr}
            {item.titleNum}
          </span>
        ) : (
          <span>
            {titleStr}
            {item.titleNum}{' '}
          </span>
        )
      if (item.children && item.children.length) {
        return (
          <TreeNode key={item.key} title={title}>
            {loop(item.children, 1)}
          </TreeNode>
        )
      } else if (!depth) {
        return (
          <TreeNode key={item.key} title={title}>
            <TreeNode className="menu-none" key={item.key + '-' + idx} title={' '}></TreeNode>
          </TreeNode>
        )
      }
      return <TreeNode key={item.key} title={title}></TreeNode>
    })

  const onSearchChange = (e) => {
    const value = e.target.value.trim()
    setSearchValue(value || '')
    onChange(e)
  }
  return (
    <>
      <div className={menuStyles['corp-detail-menu--search-row']} onClick={() => {}}>
        <Search
          placeholder={intl('222764', '搜索菜单')}
          onFocus={onSearchChange}
          onChange={onSearchChange}
          onBlur={() => {
            setTimeout(() => {
              setSearchedMenu([])
            }, 200)
          }}
        />
        <ToggleCorpDetailMenu expandedKeys={expandedKeys} setExpandedKeys={setExpandedKeys} treeData={treeDatas} />
        <CorpDetailMenuSearchSelect
          searchedMenu={searchedMenu}
          treeMenuClick={treeMenuClick}
          className={'searched-menu-div'}
        />
      </div>
      <Tree
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        defaultExpandedKeys={['overview']}
        onSelect={treeMenuClick}
        selectedKeys={selectedKeys}
      >
        {loop(treeDatas)}
      </Tree>
    </>
  )
}

export default CorpDetailMenu
