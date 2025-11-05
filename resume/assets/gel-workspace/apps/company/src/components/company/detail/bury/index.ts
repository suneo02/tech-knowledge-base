import { ICorpDetailModuleWithChildrenCfg } from '@/components/company/type'
import { pointBuriedByModule } from '@/api/pointBuried/bury.ts'
import { isArray } from 'lodash'

export const handleBuryInCorpDetailModuleTab = (
  tableCfg: ICorpDetailModuleWithChildrenCfg,
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
