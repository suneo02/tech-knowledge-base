import { corpNodeApiExecutor } from '@/api/services/corp/corpTable'
import { apiTranslate } from '@/api/services/translate'
import { corpBaseNumStore } from '@/store/corpBaseNumStore'
import { ReportDetailCustomNodeJson, ReportDetailTableJson, TCorpDetailNodeKey } from 'gel-types'
import { checkNodeApiSendable, parseTableApiResponse, processReportNodeDataTranslation } from 'report-util/misc'
import { ApiResponseForWFC } from 'report-util/types'
import { logError } from '../table/ConfigTable/utils'

/**
 * 执行表格API请求
 * @returns 实际执行的请求数量
 */
export function executeApiRequestsForTables(
  tableConfigsStore: Partial<Record<TCorpDetailNodeKey, ReportDetailTableJson>>,
  customNodeConfigStore: Partial<Record<TCorpDetailNodeKey, ReportDetailCustomNodeJson>>,
  apiDataStore: Partial<Record<TCorpDetailNodeKey, any>>,
  /**
   * 表格数据整体存储
   */
  tableDataOverallStore: Partial<Record<TCorpDetailNodeKey, ApiResponseForWFC<any>>>,
  onTableDataLoadedCallback: (data: any, tableKey: TCorpDetailNodeKey) => void,
  onAllRequestsDoneCallback: () => void
): number {
  // 计算需要执行的请求数量
  const configToSendApi: Array<ReportDetailTableJson | ReportDetailCustomNodeJson> = []
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

  if (configToSendApi.length === 0) {
    onAllRequestsDoneCallback()
    return 0
  }

  let completedRequests = 0

  // 执行所有表格的API请求
  for (const config of configToSendApi) {
    corpNodeApiExecutor(config, {
      success: (response) => {
        const data = parseTableApiResponse(response, config.key || null)
        apiTranslate(data, {
          success: (translatedData) => {
            const translatedDataProcessed = processReportNodeDataTranslation(data, translatedData, config.key)
            apiDataStore[config.key] = translatedDataProcessed
            tableDataOverallStore[config.key] = {
              ...response,
              Data: translatedDataProcessed,
            }
            onTableDataLoadedCallback(translatedDataProcessed, config.key)
          },
          error: () => {
            logError(`API请求失败 for table ${config.key}:`)
            apiDataStore[config.key] = data
            tableDataOverallStore[config.key] = response
            onTableDataLoadedCallback(null, config.key)
          },
          finish: () => {
            completedRequests++
            if (completedRequests === configToSendApi.length) {
              onAllRequestsDoneCallback()
            }
          },
        })
      },
      error: (error) => {
        logError(`API请求失败 for table ${config.key}:`, error)
        apiDataStore[config.key] = null
        onTableDataLoadedCallback(null, config.key)
      },
    })
  }

  return configToSendApi.length
}
