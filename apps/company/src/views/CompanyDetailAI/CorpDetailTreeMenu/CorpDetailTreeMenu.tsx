import { Input, Tree } from '@wind/wind-ui'
import React, { FC } from 'react'
import { ToggleCorpDetailMenu } from '@/views/Company/comp/menu/ExpandAll.tsx'
import { CorpDetailMenuSearchSelect } from '@/views/Company/comp/menu/SearchSelect.tsx'
import styles from './CorpDetailTreeMenu.module.less'
import intl from '@/utils/intl/index.ts'

const { Search } = Input
const TreeNode = Tree.TreeNode

/**
 * 企业详情树形菜单组件的属性接口
 */
interface CorpDetailTreeMenuProps {
    /** 树形菜单数据 */
    treeDatas: any[]
    /** 当前展开的节点key数组 */
    expandedKeys: string[]
    /** 设置展开节点的回调函数 */
    setExpandedKeys: (keys: string[]) => void
    /** 是否自动展开父节点 */
    autoExpandParent: boolean
    /** 当前选中的节点key数组 */
    selectedKeys: string[]
    /** 搜索框的值 */
    searchValue: string
    /** 搜索结果菜单项数组 */
    searchedMenu: any[]
    /** 搜索框值变化的回调函数 */
    onSearchChange: (e: any) => void
    /** 搜索框失焦的回调函数 */
    onSearchBlur: () => void
    /** 节点展开/收起时的回调函数 */
    onExpand: (keys: string[]) => void
    /** 节点选中时的回调函数 */
    onSelect: (menuData: any, e: any) => void
}

/**
 * 企业详情树形菜单组件
 * 
 * @component
 * @example
 * ```tsx
 * <CorpDetailTreeMenu
 *   treeDatas={treeDatas}
 *   expandedKeys={expandedKeys}
 *   setExpandedKeys={setExpandedKeys}
 *   autoExpandParent={autoExpandParent}
 *   selectedKeys={selectedKeys}
 *   searchValue={searchValue}
 *   searchedMenu={searchedMenu}
 *   onSearchChange={handleSearchChange}
 *   onSearchBlur={handleSearchBlur}
 *   onExpand={handleExpand}
 *   onSelect={handleSelect}
 * />
 * ```
 */
const CorpDetailTreeMenu: FC<CorpDetailTreeMenuProps> = ({
    treeDatas,
    expandedKeys,
    setExpandedKeys,
    autoExpandParent,
    selectedKeys,
    searchValue,
    searchedMenu,
    onSearchChange,
    onSearchBlur,
    onExpand,
    onSelect,
}) => {
    /**
     * 递归渲染树形菜单节点
     * @param data - 节点数据数组
     * @param depth - 当前节点深度
     * @returns 渲染的树节点数组
     */
    const loop = (data: any[], depth?: number) =>
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
                        <span className={styles['menu-highlight-txt']}>{searchValue}</span>
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

    return (
        <div className={styles['tree-menu-container']}>
            {treeDatas.length ? (
                <div className={styles['corp-detail-menu--search-row']} onClick={(e) => { }}>
                    <Search
                        placeholder={intl('222764', '搜索菜单')}
                        onFocus={onSearchChange}
                        onChange={onSearchChange}
                        onBlur={onSearchBlur}
                    />
                    <ToggleCorpDetailMenu
                        expandedKeys={expandedKeys}
                        setExpandedKeys={setExpandedKeys}
                        treeData={treeDatas}
                    />
                    <CorpDetailMenuSearchSelect
                        searchedMenu={searchedMenu}
                        treeMenuClick={onSelect}
                        className={styles['searched-menu-div']}
                    />
                </div>
            ) : null}
            {treeDatas.length ? (
                <Tree
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    defaultExpandedKeys={['overview']}
                    onSelect={onSelect}
                    selectedKeys={selectedKeys}
                >
                    {loop(treeDatas)}
                </Tree>
            ) : null}
        </div>
    )
}

export default CorpDetailTreeMenu 