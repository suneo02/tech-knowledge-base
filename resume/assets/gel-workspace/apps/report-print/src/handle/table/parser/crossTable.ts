import { safeToStringRender } from '@/handle/table/cell/shared'
import { TableColProps, TablePropsCross, TablePropsVertical } from '@/types/table'
import { t } from '@/utils/lang'

/**
 * Transforms a cross table configuration and data into a vertical table format.
 *
 * This function converts data from a cross table structure (where dates are typically
 * in rows and metrics in columns) to a vertical table structure (where dates are in
 * columns and metrics are in rows).
 *
 * @param props - The cross table configuration with rowHeaders, columnHeader, etc.
 * @param dataSource - The array of data objects, each containing metrics for a specific time period
 * @returns An object containing the transformed table props and data source
 */
export const transformCrossTablePropsToVerticalTableProps = (
  props: TablePropsCross,
  dataSource: any[]
): { tableProps: TablePropsVertical; dataSource: any[] } => {
  // Handle empty or invalid data source
  if (!dataSource || !Array.isArray(dataSource) || dataSource.length === 0) {
    return {
      tableProps: {
        ...props,
        type: 'verticalTable',
        columns: [],
      },
      dataSource: [],
    }
  }

  const { rowHeaders, firstRowFirstColumnConfig, columnHeader, column } = props

  // Extract the column headers (typically dates) from all data items
  // These will become the columns in the vertical table
  const columnHeadersFromData = dataSource.map((item: any) => item[columnHeader.dataIndex])

  // Create columns for vertical table
  const verticalColumns: TableColProps[] = [
    // First column is the row header (typically metric names)
    {
      ...firstRowFirstColumnConfig,
      dataIndex: 'rowHeader',
      title: t(firstRowFirstColumnConfig.titleIntl, firstRowFirstColumnConfig.title),
      align: firstRowFirstColumnConfig.align || 'left',
    },
    // Add a column for each date/period
    ...columnHeadersFromData.map((header: any, index: number) => ({
      ...column,
      title: safeToStringRender(header),
      dataIndex: `col_${index}`,
      align: columnHeader?.align,
      width: columnHeader?.width,
    })),
  ]

  // Create one row for each metric defined in rowHeaders
  const verticalDataSource = rowHeaders.map((rowHeader) => {
    // Initialize row with header label
    const rowData: Record<string, any> = {
      rowHeader: t(rowHeader.titleIntl, rowHeader.title),
    }

    // For each column (date/period), add the corresponding value
    dataSource.forEach((item, index) => {
      // The value for this cell is the metric value for this date/period
      rowData[`col_${index}`] = item[rowHeader.dataIndex]
    })

    return rowData
  })

  return {
    tableProps: {
      ...props,
      type: 'verticalTable',
      columns: verticalColumns,
    },
    dataSource: verticalDataSource,
  }
}
