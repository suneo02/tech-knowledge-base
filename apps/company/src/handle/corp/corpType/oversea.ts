import { pointBuriedNew } from '@/api/configApi'
import { BuryCfgList } from '@/api/pointBuried'
import { pointBuriedByModule } from '@/api/pointBuried/bury.ts'
import { CorpBuryIdMap } from '@/api/pointBuried/config/company.ts'
import { areaTreeMapOversea } from 'gel-util/config'
import { useEffect } from 'react'

export const getIfOverseaCorp = (code) => {
  try {
    return Boolean(areaTreeMapOversea.find((item) => item.code === code))
  } catch (e) {
    console.error(e)
    return false
  }
}

export const useHandleOverseaCorp = (corpBaseInfoCard) => {
  useEffect(() => {
    if (getIfOverseaCorp(corpBaseInfoCard?.typeCode)) {
      pointBuriedNew(
        CorpBuryIdMap.OverseaCorp,
        BuryCfgList.company.find((item) => item.moduleId === CorpBuryIdMap.OverseaCorp)
      )
      pointBuriedByModule(922602101020)
    }
  }, [corpBaseInfoCard])
}
