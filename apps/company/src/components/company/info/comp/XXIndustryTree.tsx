import React from 'react'
import { Tree } from '@wind/wind-ui'
import { industryToTreeData } from '@/components/company/info/handle/tree.ts'

interface IndustryItem {
  industryName: string
}

/**
 * XXIndustryTreeProps
 * @property data - 产业分类数据
 *   - 当为 IndustryItem[] 时：中文版数据，包含产业名称的对象数组
 *   - 当为 string 时：英文版数据，格式为 "Level1-Level2-Level3"，各层级以连字符分隔
 * @property fromShfic - 是否来自上海金融信息服务平台
 * @property defaultExpandLevel - 默认展开的层级数，从1开始。不传则展开到最后一级
 */
type XXIndustryTreeProps = {
  data: IndustryItem[] | /** @example "New Energy-Solar Energy-Photovoltaic" */ string
  fromShfic?: boolean
  defaultExpandLevel?: number
}

/**
 * 战略性新兴产业分类树形组件
 * @param data - 产业分类数据，可以是数组或字符串
 * @param fromShfic - 是否来自上海金融信息服务平台
 * @param defaultExpandLevel - 默认展开的层级数
 */
export const XXIndustryTree: React.FC<XXIndustryTreeProps> = ({ data, fromShfic = false, defaultExpandLevel }) => {
  if (!data) return <>--</>

  const treeData = industryToTreeData(data)

  // 获取需要展开的节点的 keys
  const getExpandedKeys = (nodes: any[], level = 1, parentKey = ''): string[] => {
    if (!nodes || level > (defaultExpandLevel || Infinity)) return []

    return nodes.reduce((keys: string[], node) => {
      const currentKeys = [node.key]
      if (node.children) {
        currentKeys.push(...getExpandedKeys(node.children, level + 1, node.key))
      }
      return [...keys, ...currentKeys]
    }, [])
  }

  const defaultExpandedKeys = fromShfic ? [] : defaultExpandLevel ? getExpandedKeys(treeData) : [treeData[0]?.key || '']

  return (
    <Tree
      className="corp-industry-tree"
      showLine={true}
      defaultExpandedKeys={defaultExpandedKeys}
      treeData={treeData}
      data-uc-id="IVg84wiIcU"
      data-uc-ct="tree"
    />
  )
}
