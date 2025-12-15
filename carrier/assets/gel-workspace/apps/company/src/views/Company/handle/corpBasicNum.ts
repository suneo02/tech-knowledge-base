import { ICorpBasicNumFront } from '../../../handle/corp/basicNum/type.ts'

/**
 * 判断是否是上市企业
 * @param basicNum
 */
export const getIfIPOCorpByBasicNum = (basicNum: Partial<ICorpBasicNumFront>) => {
  try {
    const keys: (keyof ICorpBasicNumFront)[] = ['outputCount', 'salesCount', 'businessCount', 'stockCount']
    return keys.some((key) => Number(basicNum[key]) > 0)
  } catch (e) {
    console.error(e)
    return false
  }
}

/**
 * 判断发债企业  >0就是发债企业，=0就是非发债企业
 */
export const getIfBondCorpByBasicNum = (basicNum: Partial<ICorpBasicNumFront>) => {
  try {
    return Number(basicNum.sharedbonds_num) > 0
  } catch (e) {
    console.error(e)
    return false
  }
}
