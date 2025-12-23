import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { TablePropsCross } from '../../../../types/table'
import { transformCrossTablePropsToVerticalTableProps } from '../crossTable'

// Remove the local Window interface extension for 'intl'
// We assume 'intl' is already declared globally with the correct modifiers

describe('transformCrossTablePropsToVerticalTableProps', () => {
  let originalIntl: any
  let originalWind: any // To store original window.wind

  beforeAll(() => {
    originalIntl = (window as any).intl
    ;(window as any).intl = vi.fn((id: string | number, defaultVal?: string) => defaultVal || `mocked_intl_${id}`)

    originalWind = (window as any).wind // Backup original window.wind
    ;(window as any).wind = { langControl: { locale: 'cn' } } // Mock window.wind with a default lang property
  })

  afterAll(() => {
    ;(window as any).intl = originalIntl
    ;(window as any).wind = originalWind // Restore original window.wind
  })

  // Mock corpReportProfitStatement-like configuration
  const mockCrossTableConfig: TablePropsCross = {
    type: 'crossTable',
    api: '/detail/company/getprofit',
    // @ts-expect-error
    firstRowFirstColumnConfig: {
      title: '报告期',
      titleIntl: '1794',
      width: '20%',
    },
    rowHeaders: [
      {
        title: '营业总收入',
        titleIntl: '35216',
        dataIndex: '_sumBusinessIncome',
      },
      {
        title: '营业利润',
        titleIntl: '437706',
        dataIndex: '_businessProfit',
      },
      {
        title: '税前利润',
        titleIntl: '437707',
        dataIndex: '_sumProfit',
      },
      {
        title: '归属母公司股东净利润',
        titleIntl: '417696',
        dataIndex: '_netProfit2',
      },
    ],
    // @ts-expect-error
    columnHeader: {
      dataIndex: '_reportDate',
      width: 120,
    },
    column: {
      dataIndex: 'value',
    },
  }

  it('should transform cross table data to vertical table format', () => {
    // Sample data source similar to what we saw in the stories
    // Sample data source for cross table
    const dataSource = [
      {
        _businessProfit: 11020649000,
        _netProfit2: 9154985000,
        _reportDate: '2025-03-31',
        _sumBusinessIncome: 170360448000,
        _sumProfit: 11190883000,
        codeType: 'companyId',
        companyCode: '1173319566',
      },
      {
        _businessProfit: 50486047000,
        _netProfit2: 40254346000,
        _reportDate: '2024-12-31',
        _sumBusinessIncome: 777102455000,
        _sumProfit: 49680677000,
        codeType: 'companyId',
        companyCode: '1173319566',
      },
      {
        _businessProfit: 38103095000,
        _netProfit2: 30040811000,
        _reportDate: '2023-12-31',
        _sumBusinessIncome: 602315354000,
        _sumProfit: 37268637000,
        codeType: 'companyId',
        companyCode: '1173319566',
      },
      {
        _businessProfit: 21541819000,
        _netProfit2: 16622448000,
        _reportDate: '2022-12-31',
        _sumBusinessIncome: 424060635000,
        _sumProfit: 21079729000,
        codeType: 'companyId',
        companyCode: '1173319566',
      },
    ]

    // Call the function with our mock data
    const result = transformCrossTablePropsToVerticalTableProps(mockCrossTableConfig, dataSource)

    // Assertions
    expect(result).toBeDefined()
    expect(result.tableProps.type).toBe('verticalTable')

    // Validate column structure
    expect(result.tableProps.columns.length).toBe(5) // First column + one for each report date
    expect(result.tableProps.columns[0].dataIndex).toBe('rowHeader')
    expect(result.tableProps.columns[0].title).toBe('报告期')
    expect(result.tableProps.columns.slice(1).map((col) => col.dataIndex)).toEqual(['col_0', 'col_1', 'col_2', 'col_3'])

    // Validate datasource transformation
    expect(result.dataSource.length).toBe(4) // Four rows for the four metrics

    // Check row headers match the rowHeaders config
    expect(result.dataSource[0].rowHeader).toBe('营业总收入')
    expect(result.dataSource[1].rowHeader).toBe('营业利润')
    expect(result.dataSource[2].rowHeader).toBe('税前利润')
    expect(result.dataSource[3].rowHeader).toBe('归属母公司股东净利润')

    // Check values in first row (营业总收入)
    expect(result.dataSource[0].col_0).toBe(170360448000)
    expect(result.dataSource[0].col_1).toBe(777102455000)
    expect(result.dataSource[0].col_2).toBe(602315354000)
    expect(result.dataSource[0].col_3).toBe(424060635000)

    // Check values in second row (营业利润)
    expect(result.dataSource[1].col_0).toBe(11020649000)
    expect(result.dataSource[1].col_1).toBe(50486047000)
    expect(result.dataSource[1].col_2).toBe(38103095000)
    expect(result.dataSource[1].col_3).toBe(21541819000)

    // Check values in third row (税前利润)
    expect(result.dataSource[2].col_0).toBe(11190883000)
    expect(result.dataSource[2].col_1).toBe(49680677000)
    expect(result.dataSource[2].col_2).toBe(37268637000)
    expect(result.dataSource[2].col_3).toBe(21079729000)

    // Check values in fourth row (归属母公司股东净利润)
    expect(result.dataSource[3].col_0).toBe(9154985000)
    expect(result.dataSource[3].col_1).toBe(40254346000)
    expect(result.dataSource[3].col_2).toBe(30040811000)
    expect(result.dataSource[3].col_3).toBe(16622448000)
  })

  it('should handle empty data source', () => {
    const emptyDataSource = []

    const result = transformCrossTablePropsToVerticalTableProps(mockCrossTableConfig, emptyDataSource)

    expect(result.tableProps.type).toBe('verticalTable')
    expect(result.tableProps.columns).toEqual([])
    expect(result.dataSource).toEqual([])
  })

  it('should handle multiple row headers', () => {
    // Mock config with multiple row headers
    const configWithMultipleHeaders = {
      ...mockCrossTableConfig,
      rowHeaders: [
        {
          dataIndex: '_sumBusinessIncome',
          title: '营业总收入',
          titleIntl: '35216',
        },
        {
          dataIndex: '_businessProfit',
          title: '营业利润',
          titleIntl: '437706',
        },
      ],
    }

    const dataSource = [
      {
        _businessProfit: 11020649000,
        _sumBusinessIncome: 170360448000,
        _reportDate: '2025-03-31',
      },
      {
        _businessProfit: 50486047000,
        _sumBusinessIncome: 777102455000,
        _reportDate: '2024-12-31',
      },
    ]

    const result = transformCrossTablePropsToVerticalTableProps(configWithMultipleHeaders, dataSource)

    // Check that we have the right number of rows (one per rowHeader)
    expect(result.dataSource.length).toBe(2)

    // Validate column structure
    expect(result.tableProps.columns.length).toBe(3) // rowHeader + one for each report date
    expect(result.tableProps.columns[0].dataIndex).toBe('rowHeader')
    expect(result.tableProps.columns.slice(1).map((col) => col.dataIndex)).toEqual(['col_0', 'col_1'])

    // Check row headers match
    expect(result.dataSource[0].rowHeader).toBe('营业总收入')
    expect(result.dataSource[1].rowHeader).toBe('营业利润')

    // Check values in first row (营业总收入)
    expect(result.dataSource[0].col_0).toBe(170360448000)
    expect(result.dataSource[0].col_1).toBe(777102455000)

    // Check values in second row (营业利润)
    expect(result.dataSource[1].col_0).toBe(11020649000)
    expect(result.dataSource[1].col_1).toBe(50486047000)
  })

  it('should handle null or undefined data source', () => {
    const result1 = transformCrossTablePropsToVerticalTableProps(
      mockCrossTableConfig,
      // @ts-ignore - Testing null case explicitly
      null
    )
    expect(result1.tableProps.columns).toEqual([])
    expect(result1.dataSource).toEqual([])

    const result2 = transformCrossTablePropsToVerticalTableProps(
      mockCrossTableConfig,
      // @ts-ignore - Testing undefined case explicitly
      undefined
    )
    expect(result2.tableProps.columns).toEqual([])
    expect(result2.dataSource).toEqual([])
  })
})
