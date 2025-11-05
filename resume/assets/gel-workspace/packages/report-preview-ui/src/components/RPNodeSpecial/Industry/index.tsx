import { corpNodeApiExecutorWithAxios } from '@/api'
import { HorizontalTable } from '@/components/table'
import { NoDataElement } from '@/components/table/tableComp'
import { tForRPPreview } from '@/utils'
import { Spin } from '@wind/wind-ui'
import { useRequest } from 'ahooks'
import { AxiosInstance } from 'axios'
import { ApiResponseForWFC } from 'gel-api'
import { CorpBasicNumFront, IndustrySector, ReportDetailCustomNodeJson, TCorpDetailNodeKey } from 'gel-types'
import { ErrorBoundary } from 'gel-ui'
import { isEn } from 'gel-util/intl'
import React, { useEffect, useMemo, useState } from 'react'
import { getNoDataLocaleAuto } from 'report-util/constants'
import { configDetailIntlHelper } from 'report-util/corpConfigJson'
import { checkNodeApiSendable, parseTableApiResponse } from 'report-util/misc'
import { convertIndustryDataForTable, createIndustryTableColumns, preProcessIndustrySector } from 'report-util/table'
import { IndustryDataCell } from './comp'

interface Props {
  corpCode: string | undefined
  config: ReportDetailCustomNodeJson
  corpBasicNum: Partial<CorpBasicNumFront> | undefined
  dataSource?: any
  /** 数据加载完成的回调函数，提供表格数据和表格key  当表格数据加载失败也会调用*/
  onDataLoadedSuccess?: (data: any, key: TCorpDetailNodeKey, response: ApiResponseForWFC<any>) => void
  /** 表格数据加载失败后的回调函数 */
  onDataLoadError?: (error: Error) => void
  /** 表格数据，有些模块由外部发送请求，外部传入数据，目前只有 基本信息 */
  tableData?: any
  axiosInstance: AxiosInstance
}

/**
 * ConfigTable 组件 - 配置化表格组件
 * 根据传入的 ReportDetailTableJson 配置自动选择合适的表格类型进行渲染
 */
export const CorpBelongIndustry: React.FC<Props> = ({
  corpCode,
  config,
  onDataLoadedSuccess,
  onDataLoadError,
  corpBasicNum,
  dataSource: dataSourceFromProps,
  axiosInstance,
}) => {
  const [hasFetched, setHasFetched] = useState(false)
  // 处理 API 响应数据
  const handleApiResponse = (response: ApiResponseForWFC<any>) => {
    const data = parseTableApiResponse(response, config?.key || null)
    if (!data) {
      onDataLoadError?.(new Error('API响应数据为空'))
      return
    }

    setDataSource(data)
    onDataLoadedSuccess?.(data, config?.key, response)
  }

  // 处理 API 错误
  const handleApiError = (error: Error) => {
    console.error('API请求失败', error)
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
  const [dataSource, setDataSource] = useState<IndustrySector[]>(dataSourceFromProps || [])

  const dataSourceProcessed = useMemo(() => {
    return preProcessIndustrySector(dataSource)
  }, [dataSource])

  const { dataSourceObj, keys } = useMemo(() => convertIndustryDataForTable(dataSourceProcessed), [dataSourceProcessed])

  useEffect(() => {
    setDataSource(dataSourceFromProps)
  }, [dataSourceFromProps])

  const columns = useMemo(() => {
    return createIndustryTableColumns(dataSourceProcessed, (sector) => {
      return <IndustryDataCell sector={sector} />
    })
  }, [dataSourceProcessed])

  // 执行 API 请求
  const executeApi = () => {
    if (!corpBasicNum || !checkNodeApiSendable(config, corpBasicNum)) {
      return
    }

    runCorpTableApiExecutor(axiosInstance, config, corpCode ?? '')
  }

  // 初始化加载数据, 或者 统计数字变更时，监听是否没有发送过 api 请求
  useEffect(() => {
    // 如果已经加载过数据，则不重复加载
    if (!hasFetched && !dataSourceFromProps) {
      executeApi()
    }
  }, [config?.api, corpBasicNum])

  const renderNoData = () => {
    const title = configDetailIntlHelper(config, 'title', tForRPPreview)
    return <NoDataElement message={getNoDataLocaleAuto(title, config?.key, isEn())} />
  }

  if (keys.length === 0) {
    return renderNoData()
  }

  if (loading) {
    return <Spin />
  }
  return (
    <ErrorBoundary>
      <HorizontalTable dataSource={dataSourceObj} columns={columns} />
    </ErrorBoundary>
  )
}
