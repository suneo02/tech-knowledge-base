/**
 * 快捷导航栏 可搭配展示详情页使用
 * Created by Calvin
 *
 * @format
 */
// @ts-nocheck
import { SearchO } from '@wind/icons'
import { AutoComplete, Button, Skeleton, Tree } from '@wind/wind-ui'
import { Input } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useGroupStore } from '@/store/group'
import { debounce } from 'lodash'
import { useScrollUtils } from '@/utils/scroll'
import { intlNoIndex } from '@/utils/intl'
import { formatNumber } from '@/utils/common'

/** @deprecated */
const GroupNavMenuNew = () => {
  const treeRef = useRef(null)
  const navRef = useRef(null)
  const [height, setHeight] = useState(null)
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
  } = useGroupStore()

  const { scrollToView: scrollContentToview } = useScrollUtils()

  const getKeysData = (tree, searchValue, result = []) => {
    tree.forEach((element) => {
      const { title, key, children, disabled } = element
      const index = title.indexOf(searchValue)
      if (index > -1) {
        const beforeStr = title.substr(0, index)
        const afterStr = title.substr(index + searchValue.length)
        if (!disabled) {
          result.push({
            key,
            title,
            beforeStr,
            afterStr,
            searchValue,
          })
        }
      }
      if (children?.length) {
        getKeysData(children, searchValue, result)
      }
    })
    return result
  }

  const onSearch = (searchValue) => {
    setSearchDataSource(getKeysData(treeData, searchValue))
  }

  const scrollNavToView = (key, align = 'top') => {
    treeRef.current.scrollTo({ key, align })
  }

  const onSelect = (_, option) => {
    const keyArr = option.key.split('-')
    setExpandedKeys(`${keyArr[0]}-${keyArr[1]}`)
    setSelectedKeys([option.key])
    scrollContentToview(option.key)
  }

  const getTreeHeight = () => {
    const { height } = navRef.current.getBoundingClientRect()
    setHeight(height)
  }

  const handleResize = debounce(() => getTreeHeight(), 500)

  useEffect(() => {
    getTreeHeight()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize')
    }
  }, [])

  useEffect(() => {
    if (!selectedKeys.length) return
    scrollNavToView(selectedKeys[0], 'a')
  }, [selectedKeys])

  function renderOption(res) {
    return (
      <AutoComplete.Option
        key={res.key}
        value={res.title}
        data-uc-id="rzOsE3Mcx"
        data-uc-ct="autocomplete"
        data-uc-x={res.key}
      >
        <span>
          {res.beforeStr}
          <span style={{ color: '#f50' }}>{res.searchValue}</span>
          {res.afterStr}
        </span>
      </AutoComplete.Option>
    )
  }

  const NodeTitle = (node) => (
    <span>
      {node.isVip ? <div className="nav-vip">V</div> : null}
      {node.titleId ? intlNoIndex(node.titleId) : node.title || ''}
      {node.num ? (
        <small className="num">
          {node.num ? formatNumber(node.num) : null}
          {/* {n.num > 99 ? "99+" : n.num} */}
        </small>
      ) : null}
    </span>
  )

  return (
    <div className="navMenu" ref={navRef}>
      {treeData.length ? (
        <div>
          <AutoComplete
            style={{ width: '100%', padding: '10px' }}
            onSearch={onSearch}
            onSelect={onSelect}
            dataSource={searchDataSource.map(renderOption)}
            data-uc-id="TRw_hpCrHn"
            data-uc-ct="autocomplete"
          >
            <Input
              placeholder={intlNoIndex('222764', '搜索菜单')}
              suffix={
                <Button
                  icon={
                    <SearchO
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                      data-uc-id="O6cBw62k0T"
                      data-uc-ct="searcho"
                    />
                  }
                  type="text"
                  data-uc-id="t7xVPR1OD0"
                  data-uc-ct="button"
                ></Button>
              }
            />
          </AutoComplete>
          <Tree
            ref={treeRef}
            height={height}
            expandedKeys={expandedKeys}
            selectedKeys={selectedKeys}
            autoExpandParent={autoExpandParent}
            onSelect={(keys) => {
              setPosition('menu')
              setSelectedKeys(keys)
              scrollContentToview(keys[0]).then(() => setPosition(''))
            }}
            onExpand={toggleExpanded}
            data-uc-id="JhXrZR8MNj"
            data-uc-ct="tree"
          >
            {treeData.map((node) => (
              <Tree.TreeNode
                key={node.key}
                title={<NodeTitle {...node} level="1" />}
                style={{ fontWeight: 'bold' }}
                data-uc-id="FHI_tmykCK"
                data-uc-ct="tree"
                data-uc-x={node.key}
              >
                {node?.children.map(
                  (n) =>
                    !n.disabled && (
                      <Tree.TreeNode
                        key={n.key}
                        title={<NodeTitle {...n} />}
                        level="2"
                        data-uc-id="cWMmb7xYFo"
                        data-uc-ct="tree"
                        data-uc-x={n.key}
                      />
                    )
                )}
              </Tree.TreeNode>
            ))}
          </Tree>
        </div>
      ) : (
        <Skeleton loading animation></Skeleton>
      )}
    </div>
  )
}

GroupNavMenuNew.displayName = 'GroupNav'
export default GroupNavMenuNew
