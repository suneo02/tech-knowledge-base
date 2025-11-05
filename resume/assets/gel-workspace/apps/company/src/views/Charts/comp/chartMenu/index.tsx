import React, { useState, useEffect } from 'react'
import { Layout, Divider, Tree } from '@wind/wind-ui'
const { Header, Sider } = Layout
import { ToggleCorpDetailMenu } from '@/views/Company/comp/menu/ExpandAll'
import { getDefaultExpandedKeys } from './altasMenus'
import intl from '@/utils/intl'
import './index.less'

const TreeNode = Tree.TreeNode

interface ChartMenuProps {
  treeData: any
  defaultActiveKey: any
  onChangeMenu: any
  companyCode: any
  companyName: any
  onCollapse?: (collapsed: boolean) => void
}

/**
 * @description 新版图谱平台菜单
 */
const ChartMenu: React.FC<ChartMenuProps> = ({
  treeData,
  defaultActiveKey,
  onChangeMenu,
  companyCode,
  companyName,
  onCollapse,
}) => {
  const expandedAllKeys = ['gqltp', 'gxltp', 'chart_glgx', 'rzltp', 'cgx', 'chart_qysyr']
  // 寻找默认展开的菜单
  // const defaultExpanded =
  //   defaultActiveKey && defaultActiveKey !== 'atlasplatform'
  //     ? getDefaultExpandedKeys(treeData, defaultActiveKey) || expandedAllKeys
  //     : expandedAllKeys

  const defaultExpanded = expandedAllKeys

  const [expandedKeys, setExpandedKeys] = useState(defaultExpanded)
  const [selectedKeys, setSelectedKeys] = useState([defaultActiveKey])

  // 监听外部传入的菜单选中
  useEffect(() => {
    if (defaultActiveKey) {
      setSelectedKeys([defaultActiveKey])
      // 如果是新的菜单项，需要确保其父节点是展开的
      const newExpandedKeys = getDefaultExpandedKeys(treeData, defaultActiveKey) || []
      setExpandedKeys((prevKeys) => {
        const mergedKeys = [...new Set([...prevKeys, ...newExpandedKeys])]
        return mergedKeys
      })
    }
  }, [defaultActiveKey, treeData])

  // 选中菜单
  const onSelect = (selectedKeys, info) => {
    const key = info.node.key
    if (selectedKeys.length > 0) {
      if (key === 'chart_jztp') {
        window.open(`/windkg/index.html#/competitors?companyname=${companyName}&id=${companyCode}`)
        return
      }
      // 选中节点
      if (info.node?.children?.length > 0) {
        if (expandedKeys.includes(key)) {
          setExpandedKeys(expandedKeys.filter((key) => key !== selectedKeys[0]))
        } else {
          setExpandedKeys([...expandedKeys, selectedKeys[0]])
        }
        return
      }
      if (expandedKeys.includes(key)) {
        setExpandedKeys(expandedKeys.filter((key) => key !== selectedKeys[0]))
      } else {
        setExpandedKeys([...expandedKeys, selectedKeys[0]])
      }
      setSelectedKeys([key])
      onChangeMenu && onChangeMenu(key)
    } else {
      // 取消选中
      if (expandedKeys.includes(key)) {
        setExpandedKeys(expandedKeys.filter((item) => item !== key))
      }
      setSelectedKeys([key])
      onChangeMenu && onChangeMenu(key)
    }
  }

  // 展开菜单
  const onExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys)
  }

  // 渲染完整菜单
  const loop = (data) =>
    data.map((item) => {
      if (item?.children?.length > 0) {
        return (
          <TreeNode title={item.title} key={item.key}>
            {loop(item.children)}
          </TreeNode>
        )
      } else {
        return <TreeNode title={item.title} key={item.key} />
      }
    })

  return (
    // @ts-ignore
    <Sider
      width={208}
      collapsible={true}
      onCollapse={onCollapse}
      collapsedContent={
        // @ts-ignore
        <Header size="small" className="f-wm-vr f-bg-none">
          {intl('138167', '图谱平台')}
        </Header>
      }
    >
      {/* @ts-ignore */}
      <Header size="small" className="charts-menu-header">
        <div className="charts-menu-header-title">{intl('138167', '图谱平台')}</div>
        <ToggleCorpDetailMenu expandedKeys={expandedKeys} setExpandedKeys={setExpandedKeys} treeData={treeData} />
      </Header>
      <Divider className="f-m0" />

      <Tree
        size="small"
        className="f-oya"
        onSelect={onSelect}
        onExpand={onExpand}
        selectedKeys={selectedKeys}
        expandedKeys={expandedKeys}
      >
        {loop(treeData)}
      </Tree>
    </Sider>
  )
}

export default ChartMenu
