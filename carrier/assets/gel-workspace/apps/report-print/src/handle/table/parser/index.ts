import { TableProps, TablePropsCross } from '@/types/table'
import { t } from '@/utils/lang'
import {
  ReportCrossTableJson,
  ReportDetailTableJson,
  ReportHorizontalTableJson,
  ReportVerticalTableJson,
} from 'gel-types'
import { tableIndexColumn } from 'report-util/table'
import { parseConfigTableCellConfig } from '../cell/renderers'

/**
 * Parse cross table configuration
 */
const parseCrossTableConfig = (
  config: ReportCrossTableJson,
  commonProps: Pick<TableProps, 'title' | 'api'>
): TableProps => {
  // 交叉表

  const processedColumns: TablePropsCross['column'] = parseConfigTableCellConfig({
    ...config.cellConfig,
    // 交叉表的列配置，不包含标题和国际化标题 标题从接口中获取，此处只是占位。在之后的代码会被替换
    dataIndex: 'value',
    title: 'value',
  })

  return {
    ...commonProps,
    type: config.type,
    column: processedColumns,
    rowHeaders: config.rowHeaders,
    columnHeader: config.columnHeader,
    firstRowFirstColumnConfig: config.firstRowFirstColumnConfig,
  }
}

/**
 * Parse horizontal table configuration
 */
const parseHorizontalTableConfig = (
  config: ReportHorizontalTableJson,
  commonProps: Pick<TableProps, 'title' | 'api'>
): TableProps => {
  // 检查并确保 columns 存在
  if (!config.columns || config.columns.length === 0) {
    return {
      ...commonProps,
      type: config.type,
      columns: [],
    }
  }

  // 处理水平表格（二维数组）
  const processedColumns = config.columns.map((rowConfig) =>
    rowConfig.map((config) => parseConfigTableCellConfig(config))
  )

  // 构造并返回 TableProps 对象
  return {
    ...commonProps,
    type: config.type,
    columns: processedColumns,
  }
}

/**
 * Parse normal table configuration
 */
const parseNormalTableConfig = (
  config: ReportVerticalTableJson,
  commonProps: Pick<TableProps, 'title' | 'api'>
): TableProps => {
  // 检查并确保 columns 存在
  if (!config.columns || config.columns.length === 0) {
    return {
      ...commonProps,
      type: config.type,
      columns: [],
    }
  }

  // 处理普通表格（一维数组）
  let processedColumns = config.columns.map((config) => parseConfigTableCellConfig(config))

  // 如果不需要隐藏索引列，添加到开始
  if (config.hideIndex !== true) {
    processedColumns = [tableIndexColumn, ...processedColumns]
  }

  // 构造并返回 TableProps 对象
  return {
    ...commonProps,
    type: config.type,
    columns: processedColumns,
  }
}

/**
 * 将配置化 表格配置 转换一下
 *
 * @param config 多个 JSON 配置
 * @returns 表格行配置
 */
export const parseConfigTableConfig = (config: ReportDetailTableJson): TableProps => {
  let title = ''
  if (config.titleIntl || config.title) {
    title = t(config.titleIntl, config.title)
  }
  const commonProps: Pick<TableProps, 'title' | 'api'> = {
    title,
    api: config.api,
  }

  if (config.type === 'crossTable') {
    return parseCrossTableConfig(config, commonProps)
  } else if (config.type === 'horizontalTable') {
    return parseHorizontalTableConfig(config, commonProps)
  } else {
    return parseNormalTableConfig(config, commonProps)
  }
}
