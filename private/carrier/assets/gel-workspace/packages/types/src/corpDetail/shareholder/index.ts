/**
 * 用于股权相关持股比例展示优化 ，

其中固定使用showShareRate字段用于产品端展示，

会存在多种情况，例如 “>1.5” , “1.5”，“<0.005”
 */
export interface ShareRateIdentifier {
  showShareRate: string
}

/**
 * 节点类型枚举
 */
export type NodeType = '1' | '2' | '3' | '4' | '5' // 1:公司 2:合伙企业 3:个人 4:其他 5:政府

/**
 * 股权链路节点
 */
export interface ShareRouteNode {
  /** 子节点列表 */
  childNode: ShareRouteNode[]
  /** 层级 */
  level: number
  /** 节点ID */
  nodeId: string
  /** 节点名称 */
  nodeName: string
  /** 节点类型 */
  nodeType: NodeType
  /** 职位类型名称 */
  typeName?: string
  /** 直接持股比例 */
  directRatioValue?: number
  /** 间接持股比例 */
  indirectRatioValue?: number
}

/**
 * 单条持股路径
 */
export interface SharePath {
  /** 路径层级 */
  level: number
  /** 该路径的最终持股比例 */
  ratio?: number
  /** 路径节点列表 */
  route: ShareRouteNode[]
}

/**
 * 持股链路信息（新版本 - 支持复杂股权结构）
 */
export interface ShareRouteDetail {
  /** 路径层级 */
  level: number
  /** 该路径的最终持股比例 */
  ratio?: number
  /** 完整路径信息 */
  route: ShareRouteNode[]
}
