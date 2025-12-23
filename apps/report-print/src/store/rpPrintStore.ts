import { ReportPageJson } from 'gel-types'
import { getCreditRPDisclaimer, getRPCoverComment } from 'report-util/constants'
import { filterReportPageJsonByHiddenKeys } from 'report-util/corpConfigJson'
import { TIntl } from 'report-util/types'
import { getUrlParamHiddenNodes } from 'report-util/url'
import { Store, createStore } from './creator/createStore'

// User package information event name
const RP_PRINT_EVENT = 'rp_print_updated'
type RPPrintStoreData = {
  reportTitle: string
  reportConfig: ReportPageJson
  reportConfigAfterApi: ReportPageJson
  getRpDisclaimer: (option: { config: ReportPageJson; isEn: boolean; t: TIntl }) => string[]
  getRpCoverComment: (option: { isEn: boolean }) => string[]
}
// User package store type for TypeScript support
interface RPPrintStore extends Store<RPPrintStoreData> {
  initReportConfig: (reportConfigRaw: ReportPageJson) => void
}

// Create the user package store using ApiStore
const createRPPrintStore = (): RPPrintStore => {
  // Create API store with userPackage configuration
  const apiStore = createStore<RPPrintStoreData>({
    // Event name for user package updates
    eventName: RP_PRINT_EVENT,

    initialData: {
      reportTitle: '',
      reportConfig: [],
      reportConfigAfterApi: [],
      getRpDisclaimer: getCreditRPDisclaimer,
      getRpCoverComment: getRPCoverComment,
    },
  })

  const initReportConfig = (reportConfigRaw: ReportPageJson) => {
    // 获取隐藏的节点
    const hiddenNodeIds: string[] = getUrlParamHiddenNodes()
    console.log(['hiddenNodeIds', hiddenNodeIds].map((i) => JSON.stringify(i)).join('\n'))
    const reportConfigFiltered = filterReportPageJsonByHiddenKeys(reportConfigRaw, hiddenNodeIds)
    apiStore.updateField('reportConfig', reportConfigFiltered)
  }

  // Return extended store with user package specific functionality
  return {
    ...apiStore,
    initReportConfig,
  }
}

// Export singleton instance
export const rpPrintStore = createRPPrintStore()
