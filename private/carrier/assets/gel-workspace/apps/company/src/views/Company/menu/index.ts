/**
 * 企业菜单配置模块统一导出
 */

export {
  buildCorpAllMenu,
  buildCorpAllMenuData,
  buildCorpAllMenuDataObj,
  buildSimplifiedCorpMenu,
} from './handleCorpDetailMenu'
export type { CorpMenuData, CorpMenuSimpleData } from './type'
export { useCorpMenuByType } from './useCorpMenuByType'
export { useCorpMenuData } from './useCorpMenuData'
export type { UseCorpMenuDataReturn } from './useCorpMenuData'
