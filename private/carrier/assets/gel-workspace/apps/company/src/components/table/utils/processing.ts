import { useTableColumns } from '../tableColumns'
import { getGroupDataApi } from '../../../api/groupApi'

export const usePreprocessingData = () => {
  const { handleColumns } = useTableColumns()
  /**
   * 兼容旧代码，未来改造好了可以删除
   * 1.Data: {}
   * 2.Data: {list: [], aggregations: {对应的key: []}}
   * 3.Data: []
   *
   * 未来都是
   * Data: {sourceData: {} | [], aggregations: {对应的key: []}}
   */
  const matchOldData = (Data) => {
    const handleSourceData = (sourceData) => {
      if (!sourceData.length) return []
      return sourceData.map((res, index) => ({ ...res, key: res.key || `table-${index}` }))
    }
    const matchedData = { sourceData: null, aggregations: null }
    if (Array.isArray(Data)) {
      matchedData.sourceData = handleSourceData(Data)
    } else if (Data?.list || Data?.list === null) {
      matchedData.sourceData = handleSourceData(Data.list)
      matchedData.aggregations = Data.aggregations
    } else if (Data?.search || Data?.search === null) {
      matchedData.sourceData = handleSourceData(Data.search)
      matchedData.aggregations = Data.aggregations
    } else {
      matchedData.sourceData = Data
    }
    return matchedData
  }

  const getDataSourceByApi = async (api) => {
    if (api == null) {
      console.error('🚀 ~ getDataSourceByApi ~ api:', api)
      return
    }
    const { Data, Page } = (await getGroupDataApi(api.url, api.params, api.noExtra)) || {}
    return { ...matchOldData(Data), Page }
  }
  /**
   *
   * @param {api: {url: '', params: {} }} param
   * @returns {sourceData: {} | [], aggregations: {对应的key: []}, Page}
   */
  const getDataSource = async ({ api, dataSource }) =>
    api
      ? await getDataSourceByApi(api)
      : { sourceData: dataSource.map((res, index) => ({ ...res, key: res.key || `table-${index}` })) }
  const getColumns = ({ preprocessing, columns }) => (preprocessing ? handleColumns(columns) : columns)

  /**
   *
   * @param { columns, dataSource, api, preprocessing } param0
   * @returns { dataSource, aggregations?, columns, Page? }
   */
  const getTableData = ({ columns, dataSource, api, preprocessing }) => {
    return new Promise(async (resolve) => {
      // @ts-expect-error ttt
      const { sourceData, aggregations } = await getDataSource({ api, dataSource })
      const tableColumns = getColumns({ preprocessing, columns })
      resolve({ dataSource: sourceData, aggregations, columns: tableColumns })
    })
  }
  return {
    getTableData,
    getDataSource,
    matchOldData,
  }
}
