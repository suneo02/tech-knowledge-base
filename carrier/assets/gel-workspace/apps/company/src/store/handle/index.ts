import { intlNoIndex } from '@/utils/intl'
import { ICfgDetailNodeCommonJson, IConfigDetailApiJSON, IConfigDetailTitleJSON } from '@/types/configDetail/common.ts'
import { IConfigDetailNodesJSON } from '@/types/configDetail/module.ts'

/**
 * 配置复用
 * @param node
 */
export const handleTreeDataReuse = (node: IConfigDetailNodesJSON) => {
  // 配置复用
  if (!((node.columnsForChild || node.searchOptionsForChild) && node.children)) {
    return
  }
  node.children = node.children.map((child) => {
    let searchOptionsNew
    if ('searchOptions' in child) {
      searchOptionsNew = child.searchOptions
    }
    if (node.searchOptionsForChild) {
      if (searchOptionsNew) {
        searchOptionsNew = [...searchOptionsNew, ...node.searchOptionsForChild]
      } else {
        searchOptionsNew = node.searchOptionsForChild
      }
    }
    return {
      ...child,
      ...(node.columnsForChild
        ? {
            columns: node.columnsForChild,
          }
        : {}),
      ...(searchOptionsNew
        ? {
            searchOptions: searchOptionsNew,
          }
        : {}),
    }
  })
  delete node.columnsForChild
  delete node.searchOptionsForChild
}
export const handleTreeData = (
  tree: (ICfgDetailNodeCommonJson &
    IConfigDetailTitleJSON &
    IConfigDetailApiJSON & {
      children: any[]
    })[],
  parentId?
) => {
  if (!tree || !Array.isArray(tree)) {
    console.error('handleTreeData: tree is undefined or not an array', tree)
    return []
  }
  return tree.map((res, index) => {
    /** key随着子组件的递增会被吞噬 */
    res.treeKey = res.key = parentId ? `${parentId}-${index + 1}` : `1-${index + 1}`
    res.title = res.titleId ? intlNoIndex(res.titleId) : res.title || ''
    handleTreeDataReuse(res)
    if (res.children) {
      if (parentId && !res.countKey) {
        res.countKey = res.children.map((n) => n.countKey || '').join('+')
      }
      res.children = handleTreeData(res.children, res.key)
    }
    return res
  })
}
/**
 * 检测单个组件是否有数据，或者是否 disable
 */
export const checkComponentHidden = (info) => {
  return (!info.num || String(info.num) === '0') && !info.display
}

export const handleConfigDetailNum = (tree, numData) => {
  return tree.map((res) => {
    if (res?.children) {
      const _children = handleConfigDetailNum(res.children, numData)
      res.children = _children
      res.display = _children.some((item) => item.display)
    }
    if (res.component) {
      if (res.component.countKey) {
        res.num = numData[res.component.countKey]
        if (!res.num) res.display = res.component?.display
      } else if (res.component.children) {
        const num = res.component.children.reduce(
          (acc, cur) => acc + (numData[cur?.countKey] ? Number(numData[cur?.countKey]) : 0),
          0
        )
        res.num = num
        if (!num) {
          res.display = res.component.children.some((item) => item.display)
        }
        res.component.children = handleConfigDetailNum(res.component.children, numData)
      }
    }
    if (res.countKey) {
      res.num = numData[res.countKey]
    }
    if (checkComponentHidden(res)) {
      res.disabled = true
    }
    return res
  })
}
