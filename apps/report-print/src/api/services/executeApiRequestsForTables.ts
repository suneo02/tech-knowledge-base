import { corpNodeApiExecutor } from '@/api/services/corp/corpTable'
import { apiTranslate } from '@/api/services/translate'
import { RPPrintApiState, RPPrintState } from '@/comp/TableSectionsHelper/type'
import { corpBaseNumStore } from '@/store/corpBaseNumStore'
import { ReportDetailNodeJson, TCorpDetailNodeKey, TCorpDetailSectionKey } from 'gel-types'
import { checkNodeApiSendable, parseTableApiResponse, processReportNodeDataTranslation } from 'report-util/misc'
import { ApiResponseForWFC } from 'report-util/types'

/**
 * 执行表格API请求
 * @returns 实际执行的请求数量
 */
export function executeApiRequestsForTables(
  rpConfig: Pick<RPPrintState, 'tableConfigsStore' | 'customNodeConfigStore' | 'rawHtmlNodeConfigStore'>,
  apiState: RPPrintApiState,
  onTableDataLoadedCallback: (data: any, tableKey: TCorpDetailNodeKey | TCorpDetailSectionKey) => void,
  onAllRequestsDoneCallback: () => void
): number {
  const { apiDataStore, apiDataOverAllStore } = apiState
  const { tableConfigsStore, customNodeConfigStore, rawHtmlNodeConfigStore } = rpConfig
  // 计算需要执行的请求数量
  const configToSendApi: Array<ReportDetailNodeJson> = []
  for (const key in tableConfigsStore) {
    if (
      Object.prototype.hasOwnProperty.call(tableConfigsStore, key) &&
      checkNodeApiSendable(tableConfigsStore[key], corpBaseNumStore.getData())
    ) {
      configToSendApi.push(tableConfigsStore[key])
    }
  }

  for (const key in customNodeConfigStore) {
    if (
      Object.prototype.hasOwnProperty.call(customNodeConfigStore, key) &&
      checkNodeApiSendable(customNodeConfigStore[key], corpBaseNumStore.getData())
    ) {
      configToSendApi.push(customNodeConfigStore[key])
    }
  }
  for (const key in rawHtmlNodeConfigStore) {
    if (
      Object.prototype.hasOwnProperty.call(rawHtmlNodeConfigStore, key) &&
      checkNodeApiSendable(rawHtmlNodeConfigStore[key], corpBaseNumStore.getData())
    ) {
      configToSendApi.push(rawHtmlNodeConfigStore[key])
    }
  }

  if (configToSendApi.length === 0) {
    onAllRequestsDoneCallback()
    return 0
  }

  let completedRequests = 0

  // 执行所有表格的API请求
  for (const config of configToSendApi) {
    const handleApiSuccess = (response: ApiResponseForWFC<any> | string) => {
      const data = parseTableApiResponse(response, config.key || null)
      apiTranslate(data, {
        success: (translatedData) => {
          const translatedDataProcessed = processReportNodeDataTranslation(data, translatedData, config.key)
          apiDataStore[config.key] = translatedDataProcessed
          apiDataOverAllStore[config.key] = {
            ...(typeof response === 'object' ? response : { data: response }),
            Data: translatedDataProcessed,
          }
          onTableDataLoadedCallback(translatedDataProcessed, config.key)
        },
        error: () => {
          console.error(`API请求失败 for table ${config.key}:`)
          apiDataStore[config.key] = data
          apiDataOverAllStore[config.key] = response
          onTableDataLoadedCallback(null, config.key)
        },
        finish: () => {
          completedRequests++
          if (completedRequests === configToSendApi.length) {
            onAllRequestsDoneCallback()
          }
        },
      })
    }
    const handleApiError = (error: any) => {
      console.error(`API请求失败 for table ${config.key}:`, error)
      apiDataStore[config.key] = null
      onTableDataLoadedCallback(null, config.key)
      completedRequests++
      if (completedRequests === configToSendApi.length) {
        onAllRequestsDoneCallback()
      }
    }
    corpNodeApiExecutor(config, {
      success: handleApiSuccess,
      error: handleApiError,
    })
  }

  return configToSendApi.length
}
