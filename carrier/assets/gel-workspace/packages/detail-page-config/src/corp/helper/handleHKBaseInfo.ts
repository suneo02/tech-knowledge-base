import { CorpBasicNumFront, CorpOtherInfo } from 'gel-types'
import { corpHKCorpInfo } from '../baseInfo'

/**
 * 处理香港企业信息 如果是香港非上市企业，并且用户购买过香港企业信息，则返回香港企业信息
 * @param basicNum
 * @param otherInfo
 * @returns
 */

export const handleHKBaseInfo = (
  basicNum?: Partial<CorpBasicNumFront>,
  otherInfo?: CorpOtherInfo
): typeof corpHKCorpInfo | undefined => {
  try {
    let hkPurchaseInfo
    if (otherInfo?.userPurchaseInfo) {
      for (let i = 0; i < otherInfo.userPurchaseInfo.length; i++) {
        if (otherInfo.userPurchaseInfo[i].dataModule === 'companyInfo') {
          hkPurchaseInfo = otherInfo.userPurchaseInfo[i]
          break
        }
      }
    }
    if (basicNum?.hkUnlisted && hkPurchaseInfo?.processingStatus === 2) {
      return corpHKCorpInfo
    }
    return undefined
  } catch (error) {
    console.error(error)
    return undefined
  }
}
