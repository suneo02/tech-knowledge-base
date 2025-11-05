import { Modal } from 'antd'
import { ListTable } from '@visactor/vtable'
import { ColumnDefine, FieldDef } from '@visactor/vtable/es/ts-types'
import React from 'react'
import { TableOperation, TableOperationType } from '../types/operationTypes'
import { nanoid } from '@reduxjs/toolkit'
import { generateUniqueName } from '@/utils/common/data'
import { useColumnsUtils } from '../utils/columnsUtils'

/**
 * 表格操作动作Hook
 * 提供对表格的各种具体操作方法，如插入列、删除列、重命名列等
 */
export interface UseTableOperationActionsProps {
  multiTableRef: React.RefObject<ListTable>
  onRecordOperation?: (operation: TableOperation) => void
}

export const useTableOperationActions = ({ multiTableRef, onRecordOperation }: UseTableOperationActionsProps) => {
  const { getColumnsCells, getColumns } = useColumnsUtils(multiTableRef)
  /**
   * 重命名列
   */
  const renameColumn = (props: { row: number; col: number }) => {
    const { row, col } = props
    multiTableRef.current?.startEditCell(col, row)
  }

  /**
   * AI生成列
   */
  const smartFillColumn = (props: { field: FieldDef; row: number; col: number }) => {
    console.log('AI生成列', props)
    // 实现AI生成列的逻辑
  }

  /**
   * 编辑列类型
   */
  const editColumnType = (props: { field: FieldDef; row: number; col: number }, type: 'text' | 'date' | 'number') => {
    console.log('编辑列类型', props, type)
    // 实现编辑列类型的逻辑
  }

  /**
   * 运行列
   */
  const runColumn = (props: { field: FieldDef; row: number; col: number }, mode: 'pending' | 'all') => {
    console.log('运行列', props, mode)
    // 实现运行列的逻辑
  }

  /**
   * 复制列
   */
  const copyColumn = (props: { field: FieldDef; row: number; col: number }) => {
    console.log('复制列', props)
    // 实现复制列的逻辑
  }

  /**
   * 插入列
   */
  const insertColumn = (props: { field: FieldDef; row: number; col: number }, direction: 'left' | 'right') => {
    console.log('插入列', props, direction)
    const table = multiTableRef.current
    if (!table) return

    // 直接从table.columns获取当前列配置
    const currentColumns = getColumns().map((col) => ({
      field: col.field,
      title: col.title,
      width: col.width,
      editor: col.editor,
    }))

    // 创建新列
    const newColumn = {
      field: nanoid(14),
      title: generateUniqueName({ name: '列', list: getColumnsCells(), key: 'title' }),
      width: 120,
      editor: 'input', // 使用字符串类型的editor，而不是布尔值
      headerEditor: 'input',
    }

    // 找到目标列的索引
    const targetIndex = currentColumns.findIndex((col) => col.field === props.field)
    if (targetIndex === -1) return
    const insertColumnIndex = direction === 'left' ? targetIndex : targetIndex + 1

    // 根据方向插入新列

    currentColumns.splice(insertColumnIndex, 0, newColumn)
    table.updateColumns(currentColumns)
    // table.startEditCell(insertColumnIndex, 0)
    onRecordOperation({
      type: TableOperationType.COLUMN_INSERT,
      columnId: newColumn.field,
      columnIndex: insertColumnIndex,
      columnName: newColumn.title,
      editor: newColumn.editor,
      headerEditor: newColumn.headerEditor,
      width: newColumn.width,
    })
  }

  /**
   * 筛选列
   */
  const filterColumn = (props: { field: FieldDef; row: number; col: number }) => {
    console.log('筛选列', props)
    // 实现筛选列的逻辑
  }

  /**
   * 排序列
   */
  const sortColumn = (props: { field: FieldDef; row: number; col: number }, direction: 'asc' | 'desc') => {
    console.log('排序列', props, direction)
    // 实现排序列的逻辑
  }

  /**
   * 隐藏/显示列
   */
  const toggleColumnVisibility = (props: { field: FieldDef; row: number; col: number }) => {
    console.log('隐藏/显示列', props)
    const table = multiTableRef.current
    if (!table) return
    // 实现隐藏/显示列的逻辑
    const columnsMap = new Map(getColumns().map((col) => [col.field, col]))
    console.log('🚀 ~ useTableOperationActions ~ columnsMap:', columnsMap)

    const headerCells = table.getAllColumnHeaderCells()[0].reduce((acc, pre) => {
      // 跳过要删除的列
      if (props.field === pre.field) return acc
      acc.push({
        field: pre.field,
        title: pre.title,
        width: pre.cellRange.bounds.x2 - pre.cellRange.bounds.x1,
        editor: columnsMap.get(pre.field)?.editor,
      })
      return acc
    }, [])
    // onRecordOperation({
    //   type: TableOperationType.COLUMN_DELETE,
    //   columnId: props.field as string,
    // })
    table.updateColumns(headerCells)
  }

  /**
   * 删除列
   */
  const deleteColumn = (props: { field: FieldDef; row: number; col: number }) => {
    Modal.confirm({
      title: '删除列',
      content: '确定删除该列吗？',
      onOk: () => {
        const table = multiTableRef.current
        if (!table) return

        // 使用 Map 存储列配置，避免后续查找
        const columnsMap = new Map(getColumns().map((col) => [col.field, col]))

        let column: ColumnDefine

        // 大大降低时间复杂度
        const headerCells = getColumnsCells().reduce((acc, pre) => {
          // 跳过要删除的列
          if (props.field === pre.field) {
            column = {
              ...columnsMap.get(pre.field),
              width: pre.cellRange.bounds.x2 - pre.cellRange.bounds.x1,
            } as ColumnDefine
            return acc
          }

          acc.push({
            field: pre.field,
            title: pre.title,
            width: pre.cellRange.bounds.x2 - pre.cellRange.bounds.x1,
            editor: columnsMap.get(pre.field)?.editor,
          })
          return acc
        }, [])
        onRecordOperation({
          type: TableOperationType.COLUMN_DELETE,
          columnId: props.field as string,
          column,
          col: props.col,
        })
        table.updateColumns(headerCells)
      },
    })
  }

  /**
   * 复制单元格
   */
  const copyCellValue = (props: { field: FieldDef; row: number; col: number }) => {
    const { row, col } = props
    console.log('复制单元格', props)
    multiTableRef.current?.startEditCell(col, row)
  }

  /**
   * 删除行
   */
  const deleteRow = (props: { field: FieldDef; row: number; col: number }) => {
    Modal.confirm({
      title: '删除行',
      content: '确定删除该行吗？',
      onOk: () => {
        const table = multiTableRef.current
        if (!table) return
        const rowItem = multiTableRef.current.getRecordByCell(props.col, props.row)
        onRecordOperation({
          type: TableOperationType.ROW_DELETE,
          rowId: rowItem.rowId,
          row: props.row,
          rowItem,
        })
        table.deleteRecords([props.row - 1])
      },
    })
  }

  /**
   * TODO 批量删除行 里面的
   */
  const batchDeleteRows = (props: { field: FieldDef; row: number; col: number }) => {
    const table = multiTableRef.current
    if (!table) return

    // ！这段是用来做批量删除操作需要的判断
    const cellInfos = table.getSelectedCellInfos()
    if (cellInfos.length === 0) return // 处理单删
    const inSelected = cellInfos.some((info) => !!info.find((res) => res.col === props.col && res.row === props.row))
    if (!inSelected) return // 处理单删

    // // 获取所有选中的行索引（注意要去重）
    // const selectedRows = new Set<number>()
    // cellInfos.forEach((info) => {
    //   info.forEach((cell) => {
    //     if (cell.row > 0) {
    //       // 跳过表头行（第0行）
    //       selectedRows.add(cell.row)
    //     }
    //   })
    // })

    // // 转换为数组并排序
    // const rowsToDelete = Array.from(selectedRows).sort((a, b) => a - b)

    // if (rowsToDelete.length === 0) return

    // Modal.confirm({
    //   title: '批量删除行',
    //   content: `确定删除选中的 ${rowsToDelete.length} 行吗？`,
    //   onOk: () => {
    //     // 需要先记录所有将要删除的行数据，然后再删除
    //     const rowItems = rowsToDelete.map((rowIndex) => {
    //       const rowData = table.getRecordByCell(0, rowIndex)
    //       return {
    //         rowId: rowData.rowId,
    //         row: rowIndex,
    //         rowItem: rowData,
    //       }
    //     })

    //     // 记录每个行删除操作
    //     rowItems.forEach((item) => {
    //       onRecordOperation({
    //         type: TableOperationType.ROW_DELETE,
    //         rowId: item.rowId,
    //         row: item.row,
    //         rowItem: item.rowItem,
    //       })
    //     })

    //     // 删除行（注意要转成0-索引，因为deleteRecords接收的是内部行索引而不是显示的行索引）
    //     table.deleteRecords(rowsToDelete.map((row) => row - 1))
    //   },
    // })
  }

  /**
   * 批量删除列
   */
  const batchDeleteColumns = () => {
    const table = multiTableRef.current
    if (!table) return

    // const cellInfos = table.getSelectedCellInfos()
    // if (cellInfos.length === 0) return

    // // 获取所有选中的列索引（去重）
    // const selectedCols = new Set<number>()
    // cellInfos.forEach((info) => {
    //   info.forEach((cell) => {
    //     selectedCols.add(cell.col)
    //   })
    // })

    // // 转换为数组
    // const colsToDelete = Array.from(selectedCols).sort((a, b) => a - b)

    // if (colsToDelete.length === 0) return

    // Modal.confirm({
    //   title: '批量删除列',
    //   content: `确定删除选中的 ${colsToDelete.length} 列吗？`,
    //   onOk: () => {
    //     // 使用 Map 存储列配置，避免后续查找
    //     const columnsMap = new Map(getColumns().map((col) => [col.field, col]))
    //     const headerCells = table.getAllColumnHeaderCells()[0]

    //     // 获取要删除的列信息
    //     const columnsToDelete = colsToDelete.map((colIndex) => {
    //       const headerCell = headerCells[colIndex]
    //       return {
    //         field: headerCell.field,
    //         col: colIndex,
    //         column: {
    //           ...columnsMap.get(headerCell.field),
    //           width: headerCell.cellRange.bounds.x2 - headerCell.cellRange.bounds.x1,
    //         } as ColumnDefine,
    //       }
    //     })

    //     // 筛选出要保留的列
    //     const remainingColumns = headerCells
    //       .filter((_, index) => !colsToDelete.includes(index))
    //       .map((cell) => ({
    //         field: cell.field,
    //         title: cell.title,
    //         width: cell.cellRange.bounds.x2 - cell.cellRange.bounds.x1,
    //         editor: columnsMap.get(cell.field)?.editor,
    //       }))

    //     // 记录列删除操作
    //     columnsToDelete.forEach((column) => {
    //       onRecordOperation({
    //         type: TableOperationType.COLUMN_DELETE,
    //         columnId: column.field as string,
    //         column: column.column,
    //         col: column.col,
    //       })
    //     })

    //     // 更新表格列
    //     table.updateColumns(remainingColumns)
    //   },
    // })
  }

  return {
    renameColumn,
    smartFillColumn,
    editColumnType,
    runColumn,
    copyColumn,
    insertColumn,
    filterColumn,
    sortColumn,
    toggleColumnVisibility,
    deleteColumn,
    copyCellValue,
    deleteRow,
    batchDeleteRows,
    batchDeleteColumns,
  }
}
