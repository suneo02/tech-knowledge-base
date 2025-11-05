import { getCorpPatentNum } from '@/api/corp/basicNum'
import { ICorpStoreState } from '@/store/company.ts'

export const getInitCorpPatentNum = async (companyCode: string): Promise<ICorpStoreState['basicNum'] | null> => {
  try {
    const res = await getCorpPatentNum(companyCode)
    if (!(res.ErrorCode == '0' && res.Data && res.Data.length)) {
      return null
    }
    const nums: ICorpStoreState['basicNum'] = {}
    nums.patent_num_kgqy = 0
    nums.patent_num_dwtz = 0
    nums.patent_num_fzjg = 0
    nums.patent_num_bgs = 0
    res.Data.map((t) => {
      if (t.corpType == '1') {
        nums.patent_num_kgqy = t.total
      } else if (t.corpType == '2') {
        nums.patent_num_dwtz = t.total
      } else if (t.corpType == '3') {
        nums.patent_num_fzjg = t.total
      } else {
        nums.patent_num_bgs = t.total
      }
    })
    return nums
  } catch (e) {
    console.error(e)
    return null
  }
}
