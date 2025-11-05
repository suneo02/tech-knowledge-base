/**
 * 快捷导航栏 可搭配展示详情页使用
 * Created by Calvin
 *
 * @format
 */
import { Common, Scroll } from '@/utils'
import { intlNoIndex } from '@/utils/intl'
import { AutoComplete, Input, Spin, Tree } from '@wind/wind-ui'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Nodata } from '../../utils/utils.tsx'
import './styles/navMenu.less'
import { isDeveloper } from '../../utils/common.ts'
import { useGroupStore } from '../../store/group.ts'

/**
 * 左侧菜单树
 * 通过treeData驱动，结合store
 * @returns
 */
const LayoutNavMenu = () => {
  const treeRef = useRef(null)
  const navRef = useRef(null)
  const [searchDataSource, setSearchDataSource] = useState([])

  const {
    treeData,
    expandedKeys,
    autoExpandParent,
    selectedKeys,
    setSelectedKeys,
    setExpandedKeys,
    toggleExpanded,
    setPosition,
    pointBuried,
  } = useGroupStore()

  // 使用 useMemo 过滤子节点
  const filteredTreeData = useMemo(() => {
    return treeData
      .filter(
        (node) =>
          node != null &&
          Array.isArray(node.children) &&
          node.children.length > 0 &&
          node.children.some((child) => !child.disabled && child.display !== false)
      )
      .map((node) => ({
        ...node,
        children: node.children!.filter((child) => !child.disabled && child.display !== false),
      }))
  }, [treeData])

  const { scrollToView: scrollContentToview } = Scroll.useScrollUtils()

  const getKeysData = (tree, searchValue, result = []) => {
    tree.forEach((element) => {
      const { title, searchTitle, key, children, disabled, type } = element
      const _title = searchTitle || title
      const index = _title.indexOf(searchValue)
      if (index > -1 && !type) {
        const beforeStr = _title.substr(0, index)
        const afterStr = _title.substr(index + searchValue.length)
        if (!disabled) {
          result.push({
            key,
            title: _title,
            beforeStr,
            afterStr,
            searchValue,
          })
        }
      }
      if (children?.length && !type) {
        getKeysData(children, searchValue, result)
      }
    })
    return result
  }

  const onSearch = (searchValue) => {
    setSearchDataSource(getKeysData(filteredTreeData, searchValue))
  }

  const scrollNavToView = (key, align = 'top') => {
    treeRef.current.scrollTo({ key, align })
  }

  const onSelect = (_, option) => {
    const keyArr = option.key.split('-')
    setExpandedKeys(`${keyArr[0]}-${keyArr[1]}`)
    setSelectedKeys([option.key])
    scrollContentToview(option.key)
    pointBuried({ opActive: 'nav', opEntity: option?.value })
  }

  useEffect(() => {
    if (!selectedKeys.length) return
    scrollNavToView(selectedKeys[0], 'a')
  }, [selectedKeys])

  const renderOption = (res) => {
    return (
      <AutoComplete.Option key={res.key} value={res.title}>
        <span>
          {res.beforeStr}
          <span style={{ color: '#00aec7' }}>{res.searchValue}</span>
          {res.afterStr}
        </span>
      </AutoComplete.Option>
    )
  }

  const NodeTitle = (node) => (
    <span className={`level-${node.level}`}>
      {isDeveloper ? (
        node.isVip ? (
          <div className="nav-vip">V</div>
        ) : node.isSvip ? (
          <div className="nav-vip">S</div>
        ) : null
      ) : null}
      {node.titleId ? intlNoIndex(node.titleId) : node.title || ''}
      {node.num ? <span className="num">{node.num ? `（${Common.formatNumber(node.num)}）` : null}</span> : null}
    </span>
  )

  return (
    <div className="nav-menu-container" ref={navRef}>
      {/*// @ts-expect-error ttt*/}
      <Spin spinning={!(filteredTreeData.length || filteredTreeData.length === 0)}>
        {filteredTreeData.length ? (
          <div>
            <AutoComplete
              style={{ width: '100%', padding: '12px' }}
              onSearch={onSearch}
              onSelect={onSelect}
              dataSource={searchDataSource.map(renderOption)}
            >
              <Input.Search placeholder={intlNoIndex('222764', '搜索菜单')} />
            </AutoComplete>
            <div className="menu-container">
              <Tree
                ref={treeRef}
                // @ts-expect-error ttt
                height={'calc(100vh - 36px - 52px - 24px)'}
                expandedKeys={expandedKeys}
                selectedKeys={selectedKeys}
                autoExpandParent={autoExpandParent}
                onSelect={(keys, record) => {
                  setPosition('menu')
                  // @ts-expect-error ttt
                  setSelectedKeys(keys)
                  scrollContentToview(keys[0]).then(() => setPosition(''))
                  setExpandedKeys(`${keys[0]}`)
                  // @ts-expect-error ttt
                  pointBuried({ opActive: 'nav', opEntity: record?.node?.title?.props?.title })
                }}
                onExpand={toggleExpanded}
              >
                {filteredTreeData.map((node) => {
                  return (
                    <Tree.TreeNode
                      key={node.key}
                      title={<NodeTitle {...node} level="1" />}
                      style={{ fontWeight: 'bold' }}
                    >
                      {node?.children.map((n) => <Tree.TreeNode key={n.key} title={<NodeTitle {...n} level="2" />} />)}
                    </Tree.TreeNode>
                  )
                })}
              </Tree>
            </div>
          </div>
        ) : (
          <Nodata />
        )}
      </Spin>
    </div>
  )
}

export default LayoutNavMenu
