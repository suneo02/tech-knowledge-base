import { Tree } from '@wind/wind-ui'
import React, { FC, useState } from 'react'
import { CorpMenuData } from '../../menu/type'
import { ToggleCorpDetailMenu } from './ExpandAll'
import menuStyles from './index.module.less'
import { MenuSearch } from './MenuSearch'
const { TreeNode } = Tree

type CorpDetailMenuProps = {
  expandedKeys: string[]
  setExpandedKeys: (keys: string[]) => void
  treeDatas: CorpMenuData[]
  allTreeDatas: CorpMenuData[]
  treeMenuClick: (menu: string[], e: any) => void
  onExpand: (expandedKeys: string[]) => void
  autoExpandParent: boolean
  selectedKeys: string[]
}
const CorpDetailMenu: FC<CorpDetailMenuProps> = ({
  selectedKeys,
  expandedKeys,
  setExpandedKeys,
  treeDatas,
  allTreeDatas,
  treeMenuClick,
  onExpand,
  autoExpandParent,
}) => {
  const [searchValue, setSearchValue] = useState<string | null>(null)
  const loop = (data, depth?) =>
    data.map((item, idx) => {
      try {
        if (!item.key) return
        const titleStr = item.titleStr || item.title
        const index = searchValue ? titleStr.toUpperCase().indexOf(searchValue.toUpperCase()) : -1
        const beforeStr = titleStr.substr(0, index)
        const afterStr = searchValue ? titleStr.substr(index + searchValue.length) : ''
        const title =
          index > -1 ? (
            <span title={`${beforeStr}${searchValue}${afterStr}`}>
              {beforeStr}
              <span className="menu-highlight-txt">{titleStr.substr(index, searchValue.length)}</span>
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
            <TreeNode key={item.key} title={title} data-uc-id="AsUcvftzLc" data-uc-ct="treenode" data-uc-x={item.key}>
              {loop(item.children, 1)}
            </TreeNode>
          )
        } else if (!depth) {
          return (
            <TreeNode key={item.key} title={title} data-uc-id="1dUvF-N1rJ" data-uc-ct="treenode" data-uc-x={item.key}>
              <TreeNode
                className="menu-none"
                key={item.key + '-' + idx}
                title={' '}
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

  return (
    <>
      <div
        className={menuStyles['corp-detail-menu--search-row']}
        onClick={() => {}}
        data-uc-id="6lmwfheVWj"
        data-uc-ct="div"
      >
        <MenuSearch
          allTreeDatas={allTreeDatas}
          treeMenuClick={treeMenuClick}
          setExpandedKeys={setExpandedKeys}
          value={searchValue}
          onChange={setSearchValue}
          data-uc-id="1xGa_eblUT"
          data-uc-ct="menusearch"
        />
        <ToggleCorpDetailMenu expandedKeys={expandedKeys} setExpandedKeys={setExpandedKeys} treeData={treeDatas} />
      </div>
      <Tree
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        defaultExpandedKeys={['overview']}
        onSelect={treeMenuClick}
        selectedKeys={selectedKeys}
        data-uc-id="41JYJH2yGE"
        data-uc-ct="tree"
      >
        {loop(treeDatas)}
      </Tree>
    </>
  )
}

export default CorpDetailMenu
