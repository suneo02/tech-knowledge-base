import { globalAreaTreeCn } from 'gel-util/config'

type AreaTreeNodeLite = {
  code: string
  name: string
  node?: AreaTreeNodeLite[]
}

let areaCodeToNameMap: Map<string, string> | null = null
/**
 * 构建「地区码 -> 名称」的索引映射。
 * 说明：使用 DFS 链接多层级节点，建立平铺索引，便于运行期快速查询。
 */
const buildAreaCodeToNameMap = (tree: AreaTreeNodeLite[]): Map<string, string> => {
  const map = new Map<string, string>()
  const dfs = (nodes: AreaTreeNodeLite[]) => {
    for (const n of nodes) {
      if (n.code && n.name) map.set(n.code, n.name)
      if (n.node && n.node.length) dfs(n.node)
    }
  }
  dfs(tree)
  return map
}

/**
 * 根据行政区划 `code` 返回地区名称。
 * - 懒加载全量树并缓存为 Map，避免每次查询都做深度遍历。
 * - 当传入空值时返回空字符串；当找不到时回退返回原始 code。
 */
export const getAreaNameByCode = (code: string | undefined | null): string => {
  if (!code) return ''
  if (!areaCodeToNameMap) {
    areaCodeToNameMap = buildAreaCodeToNameMap(globalAreaTreeCn as unknown as AreaTreeNodeLite[])
  }
  return areaCodeToNameMap.get(code) ?? code
}

/**
 * 获取内部缓存的地区映射（只读用途）。
 * 注意：仅用于调试或分析，业务侧不应依赖其存在性。
 */
export const peekAreaCodeToNameMap = (): ReadonlyMap<string, string> => {
  if (!areaCodeToNameMap) {
    areaCodeToNameMap = buildAreaCodeToNameMap(globalAreaTreeCn as unknown as AreaTreeNodeLite[])
  }
  return areaCodeToNameMap
}
