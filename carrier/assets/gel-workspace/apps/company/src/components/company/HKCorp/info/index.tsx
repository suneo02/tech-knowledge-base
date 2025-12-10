import React, { FC, useMemo } from 'react'
import { HKCorpInfoContent } from './content'
import { HKCorpInfoCtxProvider, HKCorpInfoState } from './ctx.tsx'
import styles from './style/container.module.less'

import { CorpBasicInfo } from '@/api/corp/info/basicInfo.ts'
import { CorpPurchaseData } from 'gel-types'

/**
 * 香港代查 table
 * @constructor
 */
export const HKCorpInfoInner: FC = () => {
  return (
    <div className={styles['hk-corp-info-container']} data-custom-id={'HKCorpInfo'}>
      <HKCorpInfoContent />
    </div>
  )
}

export const HKCorpInfo: FC<{
  corpCode: string
  corpName: string
  bussStatusData: CorpPurchaseData
  baseInfo: CorpBasicInfo
  tableReady: boolean
  refreshHKCorpBussStatus: () => void
}> = ({ corpCode, corpName, bussStatusData, baseInfo, refreshHKCorpBussStatus, tableReady }) => {
  const value = useMemo<HKCorpInfoState>(() => {
    let modalType: HKCorpInfoState['modalType']
    const bussStatus = bussStatusData?.processingStatus
    switch (bussStatus) {
      case 0:
        modalType = 'instruction'
        break
      case 1:
      case 3:
        modalType = 'processing'
        break
      case 2:
        modalType = undefined
        break
      default:
        modalType = 'instruction'
    }
    return {
      corpName,
      corpCode,
      bussStatus,
      baseInfo,
      modalType,
      tableReady,
      lastedProcessTime: bussStatusData?.lastedProcessTime,
      refreshBussStatus: refreshHKCorpBussStatus,
    }
  }, [corpCode, corpName, bussStatusData, baseInfo, tableReady])

  return (
    <HKCorpInfoCtxProvider value={value}>
      <HKCorpInfoInner />
    </HKCorpInfoCtxProvider>
  )
}
