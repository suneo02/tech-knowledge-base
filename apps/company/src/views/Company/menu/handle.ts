import { ICorpMenuModuleCfg, ICorpMenuModuleCfgNew } from './type'

/**
 * 将新版 企业详情 menu 配置转换为 旧版
 *
 */
export const convertCorpDetailNewMenuToOldMenu = (cfg: ICorpMenuModuleCfgNew): ICorpMenuModuleCfg => {
  const numArr = cfg.children.map((t) => t.countKey)
  const showList = cfg.children.map((t) => t.showModule)
  const showName = cfg.children.map((t) => t.showName)
  return {
    title: cfg.title,
    hide: cfg.hide,
    numArr,
    showList,
    showName,
  }
}
