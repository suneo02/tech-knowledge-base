import { CompanyDetailBaseMenus } from './menus'
import { ICorpMenuCfg } from './type'

/**
 * 检查配置是否正确
 */
function checkConfigLengths(): void {
  for (const key in CompanyDetailBaseMenus) {
    const item = CompanyDetailBaseMenus[key]
    if (!item) continue

    const numArrLength = item.numArr.length
    const showListLength = item.showList.length
    const showNameLength = item.showName.length

    if (numArrLength !== showListLength || numArrLength !== showNameLength) {
      console.warn(
        `~ Warning: In corp detail menu config item '${item.title}', the lengths of 'numArr', 'showList', and 'showName' are not equal.`
      )
    }
  }
}

/**
 * 个体工商户 menu
 */
export const getCorpDetailIndividualMenus = (): ICorpMenuCfg => {
  // 删除金融行为、资质荣誉、司法风险、经营风险大目录，其余目录没有数据时隐藏
  const menuToDel = ['financing', 'qualifications', 'risk', 'businessRisk']
  const res = { ...CompanyDetailBaseMenus }
  menuToDel.forEach((key) => {
    delete res[key]
  })
  return res
}

checkConfigLengths()
