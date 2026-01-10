import { pointBuriedByModule } from '@/api/pointBuried/bury.ts'
import { CorpDetailModuleWithChildrenCfg } from '@/types/corpDetail'
import { isArray } from 'lodash'

export const handleBuryInCorpDetailModuleTab = (
  tableCfg: CorpDetailModuleWithChildrenCfg,
  idx: number,
  corpId: string
) => {
  try {
    if (!tableCfg || !isArray(tableCfg.children)) {
      return
    }
    const child = tableCfg.children[idx]
    if (!child.bury) {
      return
    }
    pointBuriedByModule(child.bury.id, {
      currentPage: 'company',
      currentId: corpId,
      opId: corpId,
    })
  } catch (e) {
    console.error(e)
    return
  }
}
