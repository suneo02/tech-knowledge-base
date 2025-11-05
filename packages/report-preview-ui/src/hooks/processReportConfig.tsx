import { tForRPPreview } from '@/utils'
import { ReportDetailSectionJson } from 'gel-types'
import { useMemo } from 'react'
import { processAndInitializeSectionsTree } from 'report-util/corpConfigJson'

export const useProcessReportConfig = (reportPageJson: ReportDetailSectionJson[], startLevel: number = 1) => {
  return useMemo(() => {
    const initializationResult = processAndInitializeSectionsTree(reportPageJson, startLevel, tForRPPreview)
    return initializationResult
  }, [reportPageJson, startLevel])
}
