/**
 * Corporate-specific configurations
 * 所有企业相关的配置都从此模块导出
 */

// Export credit report config (直接导出信用报告相关内容)
export { getCorpInfoConfigByInfo } from './bussInfo'
export * from './creditRP'

// 未来其他模块导出将直接添加到这里，方便统一导入
// export * from './due-diligence'
// export * from './enterprise-details'
// export * from './qualification'
// export * from './risk'
// export * from './businessRisk'
// export * from './bussiness'
// export * from './finance'
// export * from './history'
// export * from './intellectual'
// export * from './privateFund'
// export * from './publicFund'
export * from './corpDetail'
export * from './ddRP'
export * from './IpoBusinessData'
