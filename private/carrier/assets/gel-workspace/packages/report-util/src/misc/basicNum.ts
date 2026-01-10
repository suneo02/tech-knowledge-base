import {
  CorpBasicNumFront,
  PatentBasicNumData,
  ReportDetailCustomNodeJson,
  ReportDetailTableJson,
  TrademarkBasicNumData,
} from 'gel-types'

/**
 * Computes a number or boolean value based on the input parameters.
 *
 * This function processes the provided `modelNum` and `basicNum` arguments
 * to calculate a sum or return a boolean. If `modelNum` is a boolean or array
 * of keys, it evaluates each key's corresponding value from `basicNum`.
 *
 * @param {CorpTableCfg['modelNum'] | boolean} modelNum - Either a boolean value or the model number(s) to be processed.
 *        If an array, it contains keys referencing values in `basicNum`. Can also include boolean values.
 * @param {CorpBasicNumFront} basicNum - An object containing numeric values corresponding to the keys from `modelNum`.
 * @returns {number | true} - Returns the sum of number values mapped from `modelNum` to `basicNum`.
 *        If the sum is zero and `modelNum` includes `true`, it returns `true`. Otherwise, returns 0 or the computed sum.
 */
export const getCorpModuleNum = (
  modelNum: keyof CorpBasicNumFront | Array<keyof CorpBasicNumFront | boolean> | true,
  basicNum: Partial<CorpBasicNumFront> | undefined
): number | true => {
  try {
    if (!basicNum) {
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

/**
 * 检查 表格 api 配置是否发送
 */
export const checkNodeApiSendable = (
  config: ReportDetailTableJson | ReportDetailCustomNodeJson,
  corpBasicNum: Partial<CorpBasicNumFront>
) => {
  try {
    if (!config) {
      return false
    }
    if (!config.api) {
      return false
    }
    // 根据统计数字 检查该表格数据是否为空
    if (config?.countKey) {
      const count = getCorpModuleNum(config.countKey, corpBasicNum)
      if (!count) {
        return false
      }
    }
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

export const mergeCorpBasicNum = (
  basicNum: Partial<CorpBasicNumFront> | undefined,
  patentBasicNumData: PatentBasicNumData | undefined,
  trademarkBasicNumData: TrademarkBasicNumData | undefined
): Partial<CorpBasicNumFront> => {
  try {
    if (!basicNum) {
      return {}
    }
    const patentNumObj: Partial<CorpBasicNumFront> = {}
    if (patentBasicNumData) {
      patentBasicNumData.forEach((t) => {
        if (t.corpType == '1') {
          patentNumObj.patent_num_kgqy = t.total
        } else if (t.corpType == '2') {
          patentNumObj.patent_num_dwtz = t.total
        } else if (t.corpType == '3') {
          patentNumObj.patent_num_fzjg = t.total
        } else {
          patentNumObj.patent_num_bgs = t.total
        }
      })
    }
    const trademarkNumObj: Partial<CorpBasicNumFront> = {}

    if (
      trademarkBasicNumData &&
      trademarkBasicNumData.aggregations &&
      trademarkBasicNumData.aggregations.aggs_company_type
    ) {
      const aggs = trademarkBasicNumData.aggregations.aggs_company_type
      if (aggs.length) {
        aggs.forEach((t) => {
          if (t.key == '本公司') {
            trademarkNumObj.trademark_num_self = t.doc_count
          }
          if (t.key == '控股企业') {
            trademarkNumObj.trademark_num_kgqy = t.doc_count
          }
          if (t.key == '分支机构') {
            trademarkNumObj.trademark_num_fzjg = t.doc_count
          }
          if (t.key == '对外投资') {
            trademarkNumObj.trademark_num_dwtz = t.doc_count
          }
        })
      }
    }
    return {
      ...basicNum,
      ...patentNumObj,
      ...trademarkNumObj,
    }
  } catch (e) {
    console.error(e)
    return {}
  }
}
