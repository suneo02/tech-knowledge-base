import { IndicatorCorpMatchItem } from 'gel-api'
import { IndicatorMatchTableColumnMap } from './CorpMatchTable/IndicatorMatchTableColumnMap'
import { IndicatorBulkImportData } from './FileUpload'

export interface IndicatorImportTransformedData {
  header: {
    companyCode: string
    [key: string]: string
  }
  dataList: Array<{
    companyCode: string
    [key: string]: string
  }>
}

/**
 * 将企业匹配数据转换为表格导入格式
 *
 * @param inputData - 企业匹配结果数据
 * @param inputExcelData - 可选的Excel导入数据
 * @returns 转换后的表格数据，包含表头和数据列表
 *
 * @example
 * // 输入数据示例:
 * const input = [{
 *   corpId: "123",
 *   corpName: "测试公司",
 *   creditCode: "91110000123",
 *   queryText: "测试", // 该字段会被忽略
 *   artificialPerson: "张三"
 * }]
 *
 * // 转换后的数据格式:
 * const result = {
 *   header: {
 *     companyCode: "公司编号",
 *     "0": "corpName",
 *     "1": "creditCode",
 *     "2": "artificialPerson"
 *   },
 *   dataList: [{
 *     companyCode: "123",
 *     "0": "测试公司",
 *     "1": "91110000123",
 *     "2": "张三"
 *   }]
 * }
 */
export const transformIndicatorImportData = (
  inputData: IndicatorCorpMatchItem[],
  inputExcelData?: IndicatorBulkImportData[]
): IndicatorImportTransformedData => {
  // 将文本匹配的数据做一个初步过滤
  const filteredInputData = inputData.map((item) => {
    return {
      corpId: item.corpId,
      corpName: item.corpName,
      creditCode: item.creditCode,
    }
  })
  // 创建表头对象
  const header = {
    companyCode: '公司编号',
    ...Object.fromEntries(
      Object.keys(inputExcelData?.[0] || filteredInputData[0] || {})
        .filter((key) => {
          if (!inputExcelData) {
            // 没有文件数据，说明是从文本匹配的
          }
          return key !== 'corpId' && key !== 'queryText'
        })
        .map((key, index) => {
          if (!inputExcelData) {
            // 没有文件数据，说明是从文本匹配的
            if (key in IndicatorMatchTableColumnMap) {
              return [index.toString(), IndicatorMatchTableColumnMap[key as keyof IndicatorCorpMatchItem]]
            }
            console.error('key is not in IndicatorMatchTableColumnMap', key)
            return [index.toString(), key]
          }
          return [index.toString(), key]
        })
    ),
  }

  // 转换数据列表
  // 优先使用 inputExcelData，如果不存在则使用 filteredInputData
  const sourceData = inputExcelData || filteredInputData
  const dataList = sourceData.map((item, index) => {
    // corp id 从 filteredInputData 中获取
    const corpId = filteredInputData[index]?.corpId
    // 使用keyof和in操作符来创建类型安全的映射
    if (!corpId) {
      console.error('corpId is undefined', item)
    }
    return {
      companyCode: !corpId ? '' : corpId,
      ...Object.fromEntries(
        Object.keys(item)
          .filter((key) => key !== 'corpId' && key !== 'queryText')
          .map((key, index) => {
            const value = item[key as keyof typeof item] || '--'
            return [index.toString(), value]
          })
      ),
    }
  })

  return {
    header,
    dataList,
  }
}
