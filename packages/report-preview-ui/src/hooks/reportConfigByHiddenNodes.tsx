import { ReportPageJson } from 'gel-types'
import { useMemo } from 'react'
import { filterReportPageJsonByHiddenKeys } from 'report-util/corpConfigJson'

export const useReportConfigByHiddenNodes = (reportConfig: ReportPageJson, hiddenNodeIds: string[]) => {
  return useMemo(() => {
    return filterReportPageJsonByHiddenKeys(reportConfig, hiddenNodeIds)
  }, [reportConfig, hiddenNodeIds])
}
