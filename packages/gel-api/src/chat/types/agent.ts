/**
 * 智能体ID枚举
 */
export enum AgentId {
  /** 尽职调查报告 */
  DueDiligenceReport = '10001',
  /** 深度信用报告 */
  DeepCreditReport = '10002',
  /** 科创能力报告 */
  TechInnovationReport = '10003',
  /** 查关系图谱 */
  RelationshipGraph = '11001',
  /** 多对一触达 */
  MultiToOneReach = '11002',
  /** 股权穿透 */
  EquityPenetrationChart = '11003',
  /** 关联方 */
  RelatedParties = '11004',
}

/**
 * 智能体标识接口
 */
export interface AgentIdentifiers {
  /** 智能体ID */
  agentId?: AgentId
  /** 重写智能体ID */
  reAgentId?: AgentId
}

/**
 * 智能体参数
 */
export interface AgentParam {
  agentId?: AgentId
}
