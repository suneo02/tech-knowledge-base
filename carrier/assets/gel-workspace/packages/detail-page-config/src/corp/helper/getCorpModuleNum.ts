import { CorpBasicNumFront } from 'gel-types'

/**
 * Computes a number or boolean value based on the input parameters.
 *
 * This function processes the provided `modelNum` and `basicNum` arguments
 * to calculate a sum or return a boolean. If `modelNum` is a boolean or array
 * of keys, it evaluates each key's corresponding value from `basicNum`.
 *
 * @param {ICorpTableCfg['modelNum'] | boolean} modelNum - Either a boolean value or the model number(s) to be processed.
 *        If an array, it contains keys referencing values in `basicNum`. Can also include boolean values.
 * @param {ICorpBasicNumFront} basicNum - An object containing numeric values corresponding to the keys from `modelNum`.
 * @returns {number | true} - Returns the sum of number values mapped from `modelNum` to `basicNum`.
 *        If the sum is zero and `modelNum` includes `true`, it returns `true`. Otherwise, returns 0 or the computed sum.
 */

export const getCorpModuleNum = (
  modelNum: keyof CorpBasicNumFront | Array<keyof CorpBasicNumFront | boolean> | true | undefined,
  basicNum: Partial<CorpBasicNumFront> | undefined
): number | true => {
  try {
    if (!basicNum || !modelNum) {
      return 0
    }
    let modelNumArr: Array<keyof CorpBasicNumFront | boolean>
    if (!Array.isArray(modelNum)) {
      modelNumArr = [modelNum]
    } else {
      modelNumArr = modelNum
    }
    const numParsed = modelNumArr.reduce<number>((previous: number, current) => {
      if (typeof current === 'boolean') {
        // 如果使用 bool 值配置的 model num
        return previous
      }
      if (current in basicNum) {
        const numConverted = Number(basicNum[current])
        if (!isNaN(numConverted)) {
          previous += numConverted
        } else {
          console.error('~ CorpModuleNum: key not a number', current, basicNum[current], basicNum)
        }
      }
      return previous
    }, 0)
    if (numParsed === 0) {
      // 如果 num 值加和为0，那么看数组中是否有 true
      if (modelNumArr.some((item) => item === true)) {
        return true
      }
    }
    return numParsed
  } catch (e) {
    console.error(e)
    return 0
  }
}
