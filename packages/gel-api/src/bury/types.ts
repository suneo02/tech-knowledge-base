/**
 * Bury 模块类型定义
 *
 * @description 将类型定义独立出来，避免与实现文件的循环依赖
 */

// 所属页面ID
export enum currentPage {
  HOME = '6521', // 首页
  CHAT = '6522', // 对话
  HISTORY = '6523', // 历史
  DETAIL = '7231', // 详情
}

// 基础功能点配置类型
export type BaseFunctionConfig = {
  opEntity: string
  opActive: string
  currentPage: currentPage
}
