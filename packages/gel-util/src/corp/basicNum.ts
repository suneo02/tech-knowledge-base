import { CorpBasicNumFront, PatentBasicNumData, TrademarkBasicNumData } from 'gel-types'

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
