import { initLanguageControl } from '@/utils/lang'
import { Meta, StoryObj } from '@storybook/html'
import { corpReportProfitStatement } from 'detail-page-config'
import { ReportDetailTableJson } from 'gel-types'
import { configTableCreator } from './creator'

/**
 * Create a container to mount our table
 */
const createContainer = (): JQuery => {
  const container = $('<div>').addClass('config-table-container')
  container.css({
    padding: '20px',
    width: '800px',
    border: '1px solid #e0e0e0',
  })
  return container
}

/**
 * Render the table into the container
 */
const renderTable = (container: JQuery, dataSource: any, config: ReportDetailTableJson) => {
  try {
    initLanguageControl({
      onSuccess: () => {
        const tableElement = configTableCreator(dataSource, config)
        container.append(tableElement)
      },
    })
    // Add error handling display
    const status = document.createElement('div')
    status.className = 'status success'
    status.innerText = 'Table rendered successfully'
    status.style.color = 'green'
    status.style.marginTop = '10px'
    container.append(status)
  } catch (error) {
    console.error('Error rendering table:', error)
  }

  return container.get(0)
}

// Story metadata
const meta: Meta = {
  title: 'Components/ConfigTable/Creator',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Tests for configTableCreator function which creates tables based on configuration',
      },
    },
  },
}

export default meta

type Story = StoryObj

// ===================== Cross Table Test =====================
export const CrossTable: Story = {
  name: 'Cross Table',
  render: () => {
    const container = createContainer()

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

    // Sample configuration for cross table

    return renderTable(container, dataSource, corpReportProfitStatement)
  },
}

// ===================== Empty Data Test =====================
export const EmptyCrossTable: Story = {
  name: 'Empty Data Source',
  render: () => {
    const container = createContainer()

    // Empty data source
    const dataSource = []

    return renderTable(container, dataSource, corpReportProfitStatement)
  },
}
