/**
 * 企业菜单配置模块统一导出
 */

export { getMenuByCorpType } from './getMenuByCorpType'
export { getCorpDetailIndividualMenus } from './individualBusiness'
export { CompanyDetailBaseMenus, corpDetailBaseMenuNumHide } from './menus'
export type { CorpMenuData, ICorpMenuCfg, ICorpMenuModuleCfg } from './type'
export { handleCorpDetailMenu } from './useCorpMenu'
export { useCorpMenuByType } from './useCorpMenuByType'
