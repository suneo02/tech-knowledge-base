import { ReportPageJson } from 'gel-types'
import { useIntl } from 'gel-ui'
import { useMemo } from 'react'
import { flattenReportConfig } from 'report-util/corpConfigJson'

export const useFlattenReportConfig = (reportPageJson: ReportPageJson, startLevel: number = 1) => {
  const t = useIntl()
  return useMemo(() => {
    const falttened = flattenReportConfig(reportPageJson, startLevel, t)
    return falttened
  }, [reportPageJson, startLevel])
}
