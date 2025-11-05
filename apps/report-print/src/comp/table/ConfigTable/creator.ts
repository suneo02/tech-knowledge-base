import { parseConfigTableConfig } from '@/handle/table'
import { transformCrossTablePropsToVerticalTableProps } from '@/handle/table/parser/crossTable'
import { ReportDetailTableJson } from 'gel-types'
import { TableElementCreator } from '../Basic/creator'
import { HorizontalTableElementCreator } from '../Horizontal/creator'
import { createTableNoDataElement } from '../tableComp'

export const configTableCreator = (dataSource: any, config: ReportDetailTableJson) => {
  if (!dataSource || dataSource.length === 0) {
    return createTableNoDataElement(config)
  }
  const tableProps = parseConfigTableConfig(config)
  if (tableProps.type === 'horizontalTable') {
    return HorizontalTableElementCreator.createTable(dataSource, tableProps)
  } else if (tableProps.type === 'verticalTable') {
    return TableElementCreator.createTable(dataSource, tableProps)
  } else if (tableProps.type === 'crossTable') {
    const { tableProps: verticalTableProps, dataSource: verticalDataSource } =
      transformCrossTablePropsToVerticalTableProps(tableProps, dataSource)
    return TableElementCreator.createTable(verticalDataSource, verticalTableProps)
  } else {
    console.error('Invalid table props')
  }
}
