import type * as VTable from '@visactor/vtable'
import { Button, Select, Card, Row, Col, Space } from 'antd'
import { useState, useEffect, useMemo } from 'react'

const { Option } = Select

interface DataOperationPanelProps {
  table: VTable.ListTable | null
  setActionStatus: (status: string | null) => void
}

const DataOperationPanel = ({ table, setActionStatus }: DataOperationPanelProps) => {
  const [selectedColField, setSelectedColField] = useState<string | null>(null)
  const [selectedRow, setSelectedRow] = useState<number | null>(null)

  const columns = useMemo(() => {
    if (!table) return []
    return table.columns.map((c) => ({ title: c.title as string, field: c.field as string }))
  }, [table])

  const { rowCount, colCount } = useMemo(() => {
    return {
      rowCount: table?.rowCount ?? 0,
      colCount: table?.colCount ?? 0,
    }
  }, [table])

  useEffect(() => {
    if (table) {
      if (columns.length > 1) {
        // Skip the first column (sequence number)
        setSelectedColField(columns[1].field)
      }
      if (rowCount > 1) {
        // Skip the header row
        setSelectedRow(2)
      }
    } else {
      setSelectedColField(null)
      setSelectedRow(null)
    }
  }, [table, columns, rowCount])

  const handleDataAction = (action: () => void, successMessage: string) => {
    if (!table) {
      setActionStatus('错误：未选择或加载表格实例')
      return
    }
    try {
      action()
      setActionStatus(successMessage)
    } catch (error) {
      const e = error as Error
      setActionStatus(`操作失败: ${e.message}`)
    }
  }

  const getTargetColIndex = () => {
    if (!selectedColField) return -1
    // @ts-expect-error ttt
    return table?.getColIndexByField(selectedColField) ?? -1
  }

  const handleDeleteRow = () => {
    if (selectedRow === null) return
    // VTable row index is 0-based, but our display is 1-based and we skip the header.
    // Assuming row 1 in dropdown is the first data row (index 1 in VTable).
    // @ts-expect-error ttt
    handleDataAction(() => table?.deleteRows([selectedRow - 1]), `已删除第 ${selectedRow} 行`)
  }

  const handleDeleteCol = () => {
    const colIndex = getTargetColIndex()
    if (colIndex === -1) return
    const colTitle = columns.find((c) => c.field === selectedColField)?.title
    // @ts-expect-error ttt
    handleDataAction(() => table?.deleteColumns([colIndex]), `已删除列 "${colTitle}"`)
  }

  const handleInsertRow = (above: boolean) => {
    if (selectedRow === null) return
    const insertIndex = above ? selectedRow - 1 : selectedRow
    handleDataAction(
      // @ts-expect-error
      () => table?.insertRows(insertIndex, 1),
      `已在第 ${selectedRow} 行${above ? '上方' : '下方'}插入新行`
    )
  }

  const handleInsertCol = (before: boolean) => {
    const colIndex = getTargetColIndex()
    if (colIndex === -1) return
    const colTitle = columns.find((c) => c.field === selectedColField)?.title
    const insertIndex = before ? colIndex : colIndex + 1
    handleDataAction(
      // @ts-expect-error ttt
      () => table?.insertColumns(insertIndex, 1),
      `已在列 "${colTitle}" ${before ? '左侧' : '右侧'}插入新列`
    )
  }

  if (!table) {
    return (
      <Card title="无可用数据表" size="small">
        <p>请先在“基础操作”标签页中选择一个已加载的工作表。</p>
      </Card>
    )
  }

  return (
    <>
      <Card title="当前表格信息" size="small" style={{ marginBottom: 16 }}>
        <Row>
          <Col span={12}>
            <strong>总行数 (数据):</strong> {rowCount > 0 ? rowCount - 1 : 0}
          </Col>
          <Col span={12}>
            <strong>总列数 (数据):</strong> {colCount > 0 ? colCount - 1 : 0}
          </Col>
        </Row>
      </Card>
      <Card title="数据操作" size="small">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space>
            <span>选择列:</span>
            <Select style={{ width: 180 }} value={selectedColField} onChange={setSelectedColField} placeholder="选择列">
              {columns.slice(1).map((c) => (
                <Option key={c.field} value={c.field}>
                  {c.title}
                </Option>
              ))}
            </Select>
            <span>选择行:</span>
            <Select
              style={{ width: 120 }}
              value={selectedRow}
              onChange={setSelectedRow}
              placeholder="选择行"
              disabled={rowCount <= 1}
            >
              {Array.from({ length: rowCount - 1 }, (_, i) => (
                <Option key={i + 2} value={i + 2}>
                  {`第 ${i + 2} 行`}
                </Option>
              ))}
            </Select>
          </Space>
          <Space wrap>
            <Button onClick={() => handleInsertCol(true)} disabled={!selectedColField}>
              左侧插入列
            </Button>
            <Button onClick={() => handleInsertCol(false)} disabled={!selectedColField}>
              右侧插入列
            </Button>
            <Button danger onClick={handleDeleteCol} disabled={!selectedColField}>
              删除选中列
            </Button>
          </Space>
          <Space wrap>
            <Button onClick={() => handleInsertRow(true)} disabled={selectedRow === null}>
              上方插入行
            </Button>
            <Button onClick={() => handleInsertRow(false)} disabled={selectedRow === null}>
              下方插入行
            </Button>
            <Button danger onClick={handleDeleteRow} disabled={selectedRow === null}>
              删除选中行
            </Button>
          </Space>
        </Space>
      </Card>
    </>
  )
}

export default DataOperationPanel
