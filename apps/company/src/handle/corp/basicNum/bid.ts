import { getCorpBidNum, getCorpBidPenetrationNum } from '@/api/corp/basicNum'
import { ICorpStoreState } from '@/store/company.ts'

export const getInitCorpBidNum = async (companyCode: string): Promise<ICorpStoreState['basicNum'] | null> => {
  try {
    const res = await getCorpBidNum(companyCode)
    if (!(res.ErrorCode == '0' && res.Data && res.Data.length)) {
      return null
    }
    const nums: ICorpStoreState['basicNum'] = {}
    res.Data.map((t) => {
      if (t.corpType == '1') {
        nums.bid_num_kgqy = t.total
      } else if (t.corpType == '2') {
        nums.bid_num_dwtz = t.total
      } else if (t.corpType == '3') {
        nums.bid_num_fzjg = t.total
      } else {
        nums.bid_num_bgs = t.total
      }
    })
    return nums
  } catch (e) {
    console.error(e)
    return null
  }
}

export const getInitCorpBidPenetrationNum = async (
  companyCode: string
): Promise<ICorpStoreState['basicNum'] | null> => {
  try {
    const res = await getCorpBidPenetrationNum(companyCode)
    if (!(res.ErrorCode == '0' && res.Data && res.Data.length)) {
      return null
    }
    const nums: ICorpStoreState['basicNum'] = {}
    res.Data.map((t) => {
      if (t.corpType == '1') {
        nums.tid_num_kgqy = t.total
      } else if (t.corpType == '2') {
        nums.tid_num_dwtz = t.total
      } else if (t.corpType == '3') {
        nums.tid_num_fzjg = t.total
      } else {
        nums.tid_num_bgs = t.total
      }
    })
    return nums
  } catch (e) {
    console.error(e)
    return null
  }
}
