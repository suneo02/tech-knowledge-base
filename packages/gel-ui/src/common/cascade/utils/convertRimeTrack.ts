import { CDERankQueryFilterValue } from 'gel-api'
import { IndustryTreeNode } from 'gel-util/config'

/**
 * 递归收集节点及其所有子节点的 code 和 name
 * @param node 当前节点
 * @returns 该节点及其所有子节点的 CDERankQueryFilterValue 数组
 */
const collectAllNodeCodes = (node: IndustryTreeNode): CDERankQueryFilterValue[] => {
  const result: CDERankQueryFilterValue[] = []

  // 添加当前节点
  result.push({
    objectName: node.name,
    objectId: node.code,
  })

  // 递归收集子节点
  if (node.node && node.node.length > 0) {
    node.node.forEach((childNode) => {
      result.push(...collectAllNodeCodes(childNode))
    })
  }

  return result
}

/**
 * 来觅赛道级联
 * 需要将 value 转换为 CDERankQueryFilterValue 存入 search
 *
 * 如果节点被选中，其子节点所有 code 也要平铺加入 结果
 */
export const convertRimeTrackValue = (selectedOptions: IndustryTreeNode[][]): CDERankQueryFilterValue[] => {
  try {
    const result: CDERankQueryFilterValue[] = []

    // 遍历每个选择路径
    selectedOptions.forEach((path) => {
      // 取路径中的最后一个节点（用户实际选择的节点）
      const selectedNode = path[path.length - 1]

      if (selectedNode) {
        // 收集该节点及其所有子节点的 code
        const nodeResults = collectAllNodeCodes(selectedNode)
        result.push(...nodeResults)
      }
    })

    return result
  } catch (error) {
    console.error(error)
    return []
  }
}
