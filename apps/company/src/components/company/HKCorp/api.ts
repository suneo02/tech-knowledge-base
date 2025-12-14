import { CorpPurchaseData } from 'gel-types'

/**
 * 在用户所有的购买信息中 找到 香港企业基本信息的 购买状态
 * @param data
 */
export const findHKCorpInfoStatus = (data: CorpPurchaseData[]) => {
  try {
    if (data == null) {
      return null
    }
    return data.find((item) => item.dataModule === 'companyInfo')
  } catch (e) {
    console.error(e)
  }
}

/**
 * 详情页中处理香港代查服务的 hook ，目前只有公司信息, 以后可能有其他模块
 */
export const useBuyStatusInDetail = (purchaseData: CorpPurchaseData[]) => {
  const hkCorpInfoBuyData = findHKCorpInfoStatus(purchaseData)

  return {
    hkCorpInfoBuyData,
  }
}
