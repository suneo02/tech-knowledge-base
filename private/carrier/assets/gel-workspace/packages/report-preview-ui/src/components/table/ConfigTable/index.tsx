import { AxiosInstance } from 'axios'
import { ApiResponseForWFC } from 'gel-api'
import { CorpBasicNumFront, ReportDetailTableJson, TCorpDetailNodeKey } from 'gel-types'
import { useIntl } from 'gel-ui'
import { isEn } from 'gel-util/intl'
import React from 'react'
import { getNoDataLocaleAuto } from 'report-util/constants'
import { tableIndexColumn, transformCrossTablePropsToVerticalTableProps } from 'report-util/table'
import { BasicTable } from '../Basic'
import { HorizontalTable } from '../Horizontal'
import { NoDataElement } from '../tableComp'
import { useConfigTableData } from './useConfigTableData'

interface ConfigTableProps {
  config: ReportDetailTableJson
  corpBasicNum: Partial<CorpBasicNumFront> | undefined
  dataSource?: any
  /** 数据加载完成的回调函数，提供表格数据和表格key  当表格数据加载失败也会调用*/
  onDataLoadedSuccess?: (data: any, key: TCorpDetailNodeKey, response: ApiResponseForWFC<any>) => void
  /** 表格数据加载失败后的回调函数 */
  onDataLoadError?: (error: Error) => void
  /** 表格数据，有些模块由外部发送请求，外部传入数据，目前只有 基本信息 */
  tableData?: any
  axiosInstance: AxiosInstance
  getWsid: () => string | undefined
}

/**
 * ConfigTable 组件 - 配置化表格组件
 * 根据传入的 ReportDetailTableJson 配置自动选择合适的表格类型进行渲染
 */
export const ConfigTable: React.FC<ConfigTableProps> = ({
  config,
  onDataLoadedSuccess,
  onDataLoadError,
  corpBasicNum,
  dataSource: dataSourceFromProps,
  axiosInstance,
  getWsid,
}) => {
  const t = useIntl()
  const { loading, tableProps, finalDataSource } = useConfigTableData({
    config,
    corpBasicNum,
    dataSourceFromProps,
    onDataLoadedSuccess,
    onDataLoadError,
    axiosInstance,
    getWsid,
  })

  const renderNoData = () => {
    return <NoDataElement message={getNoDataLocaleAuto(tableProps?.title, config?.key, isEn())} />
  }
  // 渲染表格内容
  const renderTable = () => {
    if (!tableProps) return null

    const commonProps = {
      loading,
    }

    if (tableProps.type === 'horizontalTable') {
      return <HorizontalTable {...commonProps} dataSource={finalDataSource} {...tableProps} />
    }

    if (tableProps.type === 'verticalTable') {
      const dataWithIndex = finalDataSource?.map((item: any, index: number) => ({
        ...item,
        [tableIndexColumn.dataIndex]: index + 1,
      }))

      return <BasicTable {...commonProps} dataSource={dataWithIndex} options={tableProps} />
    }

    if (tableProps.type === 'crossTable' && finalDataSource) {
      const { tableProps: verticalTableProps, dataSource: processedDataSource } =
        transformCrossTablePropsToVerticalTableProps(tableProps, finalDataSource, t)

      return <BasicTable {...commonProps} dataSource={processedDataSource} options={verticalTableProps} />
    }

    return null
  }

  if (loading) {
    // 在加载时，可以渲染一个骨架屏或加载指示器
    return renderTable()
  }

  if (!finalDataSource || finalDataSource.length === 0) {
    return renderNoData()
  }

  return renderTable()
}
