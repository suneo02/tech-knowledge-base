import type { DataNode } from '@wind/wind-ui/lib/tree'
import { globalAreaTreeCn } from 'gel-util/config'
import { isEn, t } from 'gel-util/intl'
import type { AreaTreeNode } from 'node_modules/gel-util/dist/types/config/areaTree/type'

type AreaTreeNodeLite = {
  code: string
  name: string
  node?: AreaTreeNodeLite[]
}

let areaCodeToNameMap: Map<string, string> | null = null
let areaCodeToFullNameMap: Map<string, string> | null = null

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
 * 构建「地区码 -> 全路径名称」的索引映射。
 * 格式：省-市-区
 */
const buildAreaCodeToFullNameMap = (tree: AreaTreeNodeLite[]): Map<string, string> => {
  const map = new Map<string, string>()
  const dfs = (nodes: AreaTreeNodeLite[], parentNames: string[]) => {
    for (const n of nodes) {
      const currentNames = [...parentNames]
      if (n.name) currentNames.push(n.name)

      if (n.code && currentNames.length > 0) {
        map.set(n.code, currentNames.join('-'))
      }

      if (n.node && n.node.length) {
        dfs(n.node, currentNames)
      }
    }
  }
  dfs(tree, [])
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

  // 1. 尝试直接精确匹配
  let name = areaCodeToNameMap.get(code)
  if (name) return name

  // 2. 尝试去除尾部所有 '0' 后再匹配
  // 举例：0301030400 -> 03010304
  const trimmedCode = code.replace(/0+$/, '')
  if (trimmedCode !== code) {
    name = areaCodeToNameMap.get(trimmedCode)
    if (name) return name
  }

  return ''
}

/**
 * 根据行政区划 `code` 返回地区全路径名称（省-市-区）。
 * - 匹配逻辑同 getAreaNameByCode，支持去除尾部 0 的模糊匹配。
 */
export const getFullAreaNameByCode = (code: string | undefined | null): string => {
  if (!code) return ''
  if (!areaCodeToFullNameMap) {
    areaCodeToFullNameMap = buildAreaCodeToFullNameMap(globalAreaTreeCn as unknown as AreaTreeNodeLite[])
  }

  // 1. 尝试直接精确匹配
  let name = areaCodeToFullNameMap.get(code)
  if (name) return name

  // 2. 尝试去除尾部所有 '0' 后再匹配
  const trimmedCode = code.replace(/0+$/, '')
  if (trimmedCode !== code) {
    name = areaCodeToFullNameMap.get(trimmedCode)
    if (name) return name
  }

  return ''
}

/**
 * 格式化任务名称
 * 规则：[地区名称] - [任务名称]
 * - 如果地区名称为空，则不显示地区和连接符
 * - 如果任务名称为空，默认为 t('482259', '挖掘任务')
 */
export const formatTaskName = (
  areaCode: string | number | undefined | null,
  taskName: string | undefined | null
): string => {
  const areaName = getAreaNameByCode(areaCode ? String(areaCode) : undefined)
  const finalTaskName = taskName || t('482259', '挖掘任务')

  if (areaName) {
    return `${areaName} - ${finalTaskName}`
  }
  return finalTaskName
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

/**
 * 判断是否为路径数组
 * @param val 值
 * @returns 是否为路径数组
 */
export const isArrayOfArrays = (val: unknown): val is string[][] => Array.isArray(val) && Array.isArray(val[0])

/**
 * 将路径数组转换为叶子节点数组
 * @param paths 路径数组
 * @returns 叶子节点数组
 */
export const fromCascaderValue = (paths: string[][] | undefined | null): string[] => {
  if (!Array.isArray(paths)) return []
  return paths
    .map((p) => (Array.isArray(p) && p.length > 0 ? p[p.length - 1] : undefined))
    .filter((v): v is string => typeof v === 'string')
}

/**
 * 将叶子节点数组转换为路径数组
 * @param codes 叶子节点数组
 * @param codePathMap 地区码 -> 路径映射
 * @returns 路径数组
 */
export const toCascaderValue = (codes: string[] | string[][], codePathMap: Map<string, string[]>): string[][] => {
  if (isArrayOfArrays(codes)) return codes as string[][]
  const arr = Array.isArray(codes) ? (codes as string[]) : []
  return arr.map((code) => codePathMap.get(String(code)) || [String(code)])
}

/**
 * 获取地区树用于 Cascader 选项
 * @returns DataNode[]
 */
export const getAreaTreeForOptions = () => {
  const loop = (nodes: AreaTreeNode[], depth = 0): DataNode[] => {
    return nodes.map((item) => ({
      key: item.code,
      label: isEn() ? item.nameEn : item.name,
      value: item.code,
      children: item.node && depth < 1 ? loop(item.node, depth + 1) : undefined,
    }))
  }
  return loop(globalAreaTreeCn)
}
