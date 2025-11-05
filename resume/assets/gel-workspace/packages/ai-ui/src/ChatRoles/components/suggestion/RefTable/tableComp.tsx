import { Link } from '@wind/wind-ui'
import Table, { ColumnProps } from '@wind/wind-ui-table'
import { RefTableData, RefTableHeader } from 'gel-api'
import { ETerminalCommandId, getTerminalCommandLink } from 'gel-util/link'
import './style/tableComp.less'

export const RefTable = ({ data }: { data: RefTableData }) => {
  if (!data || !data.Content || !data.Headers || !Array.isArray(data.Content) || !Array.isArray(data.Headers))
    return null
  console.log('🚀 ~ RefTable ~ data:', data)
  const columns: ColumnProps[] = data.Headers.map((header: RefTableHeader, index: number) => ({
    title: header.Name,
    dataIndex: header.Id,
    key: header.Id,
    ellipsis: true,
    width: 160,
    render: (text: string | number | null) => {
      if (header.DataType === 'composite') {
        try {
          const obj = JSON.parse(text as string)
          const windcode = typeof obj?.Id === 'string' ? obj?.Id?.split('.')?.[0] : obj?.Id
          if (!windcode) return '-'
          return (
            <Link
              underline
              // @ts-expect-error ttt
              href={getTerminalCommandLink(ETerminalCommandId.F9, {
                windcode,
              })}
            >
              {obj?.Label}
            </Link>
          )
        } catch {
          return text
        }
      }
      if (text === null || typeof text === 'object') return '--'
      return text.toString()
    },
  }))

  const tableData = data.Content.map((row, index) => {
    const rowData: Record<string, any> = { key: index }
    data.Headers.forEach((header, colIndex) => {
      rowData[header.Id] = row[colIndex]
    })
    return rowData
  })

  return (
    <div className="ref-table-wrapper">
      <Table
        columns={columns}
        dataSource={tableData}
        scroll={{ y: '70vh', x: '100%' }}
        pagination={{
          total: data.Total,
          showTotal: (total) => `共 ${total} 条数据`,
        }}
        size="middle"
      />
    </div>
  )
}
