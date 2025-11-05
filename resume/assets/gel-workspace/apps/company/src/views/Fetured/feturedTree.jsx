import { Tree } from '@wind/wind-ui'
import { useState } from 'react'
import { useEffect } from 'react'

/**
 * 一个自定义的树形组件，对antd的Tree组件进行了封装，用于展示树形数据，并在初始化时展开所有父节点，支持父节点的点击展开收起
 * @param {Object} props 组件的属性对象
 * @param {Array} props.treeData 树形数据的数组
 * @param {Function} props.onSelect 选中树节点时的回调函数，只有叶子节点才会触发
 * @param {ReactNode} props.children Tree组件的子节点
 * @returns {ReactNode} 返回一个Tree组件，并添加了onExpand和onSelect的事件处理函数，以及初始化时展开所有父节点的功能
 */

const FeturedTree = (props) => {
  const { treeData = [], onSelect, children } = props
  let { treeData: _, ...newProps } = props // **过滤treeData属性**
  useEffect(() => {
    const initExpandedKeys = []
    const traverse = (arr) => {
      arr.forEach((i) => {
        if (i?.children?.length) {
          initExpandedKeys.push(i.key)
          i?.children?.length && traverse(i.children)
        }
      })
    }
    traverse(treeData)
    setExpandedKeys(initExpandedKeys)
  }, [treeData])

  const [expandedKeys, setExpandedKeys] = useState([])

  const handleExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys)
  }

  const handleSelect = (selectedKeys, e) => {
    const { node } = e
    // 不是叶子节点点击展开收起
    if (node?.children?.length) {
      if (expandedKeys.includes(node.key)) {
        setExpandedKeys((keys) => keys.filter((i) => i !== node.key))
      } else {
        setExpandedKeys((keys) => [...keys, node.key])
      }
    } else {
      // 是叶子节点触发自定义事件
      onSelect(selectedKeys, e)
    }
  }

  return children ? (
    <Tree {...newProps} onExpand={handleExpand} expandedKeys={expandedKeys} onSelect={handleSelect}>
      {children}
    </Tree>
  ) : (
    <Tree {...props} onExpand={handleExpand} expandedKeys={expandedKeys} onSelect={handleSelect}></Tree>
  )
}

export default FeturedTree
