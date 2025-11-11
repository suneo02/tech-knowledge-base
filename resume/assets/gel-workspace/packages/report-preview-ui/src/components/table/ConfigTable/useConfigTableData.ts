import { corpNodeApiExecutorWithAxios } from '@/api'
import { parseConfigTableConfig } from '@/handle/table'
import { useRequest } from 'ahooks'
import { AxiosInstance } from 'axios'
import { ApiResponseForWFC } from 'gel-api'
import { CorpBasicNumFront, ReportDetailTableJson, TCorpDetailNodeKey } from 'gel-types'
import { useIntl } from 'gel-ui'
import { useEffect, useMemo, useState } from 'react'
import { checkNodeApiSendable, parseTableApiResponse } from 'report-util/misc'
import { getUrlParamCorpCode } from 'report-util/url'
import { validateApiConfig } from './api'
import { logError } from './utils'

interface UseConfigTableDataParams {
  config: ReportDetailTableJson
  corpBasicNum: Partial<CorpBasicNumFront> | undefined
  dataSourceFromProps?: any
  onDataLoadedSuccess?: (data: any, key: TCorpDetailNodeKey, response: ApiResponseForWFC<any>) => void
  onDataLoadError?: (error: Error) => void
  axiosInstance: AxiosInstance
  getWsid: () => string | undefined
}

export const useConfigTableData = ({
  config,
  corpBasicNum,
  dataSourceFromProps,
  onDataLoadedSuccess,
  onDataLoadError,
  axiosInstance,
  getWsid,
}: UseConfigTableDataParams) => {
  const t = useIntl()
  const [hasFetched, setHasFetched] = useState(false)
  const [untranslatedData, setUntranslatedData] = useState<any>()

  const tableProps = useMemo(() => {
    return parseConfigTableConfig(t, config, getWsid)
  }, [config, getWsid])

  const handleApiResponse = (response: ApiResponseForWFC<any>) => {
    const data = parseTableApiResponse(response, config?.key || null)
    setUntranslatedData(data)
    if (data) {
      onDataLoadedSuccess?.(data, config.key, response)
    } else {
      onDataLoadError?.(new Error('API响应数据为空'))
    }
  }

  const handleApiError = (error: Error) => {
    logError('API请求失败', error)
    onDataLoadError?.(error)
  }

  const { run: runCorpTableApiExecutor, loading } = useRequest(corpNodeApiExecutorWithAxios, {
    manual: true,
    onSuccess: handleApiResponse,
    onError: handleApiError,
    onFinally: () => {
      setHasFetched(true)
    },
  })

  // 状态管理
  const dataSource = dataSourceFromProps ?? untranslatedData

  const executeApi = () => {
    if (!corpBasicNum || !checkNodeApiSendable(config, corpBasicNum)) {
      return
    }

    if (!validateApiConfig(tableProps)) {
      console.warn('无法执行API请求，缺少API配置或执行器')
      return
    }

    runCorpTableApiExecutor(axiosInstance, config, getUrlParamCorpCode() ?? '')
  }

  useEffect(() => {
    // 如果已经加载过数据，则不重复加载
    if (!hasFetched && !dataSourceFromProps) {
      executeApi()
    }
  }, [tableProps?.api, corpBasicNum, hasFetched, dataSourceFromProps])

  return {
    loading,
    tableProps,
    finalDataSource: dataSource,
  }
}
