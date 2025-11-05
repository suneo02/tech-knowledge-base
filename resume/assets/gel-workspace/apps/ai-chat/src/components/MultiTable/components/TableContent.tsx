import { CellMetadata, RowData } from 'gel-api'
import { CSSProperties, ReactNode, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { TableContentRef } from '..'
import { useTableAITask } from '../context'
import { useMultiTableRef } from '../context/MultiTableRefContext'
import { useMultiTableRefMethods } from '../hooks/useMultiTableRefMethods'
import { TableOperation } from '../types'
import { onCellClickBySourceProps } from '../types/table'
import { GENERATE_TEXT } from '@/components/VisTable/config/status'

/**
 * 多维表格内容组件
 */
export interface TableContentProps {
  sheetId: number
  style?: CSSProperties
  children?: ReactNode
  handleRecordOperation?: (operation: TableOperation) => void
  onCellClickBySource?: (value?: onCellClickBySourceProps) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOperation?: (operation: any) => void
}

export const TableContent = forwardRef<TableContentRef, TableContentProps>(
  ({ sheetId, style, handleRecordOperation, onCellClickBySource }, ref) => {
    // 创建引用
    const containerRef = useRef<HTMLDivElement>(null)
    const loadedData = useRef<Record<number, Promise<RowData[]>>>({})

    // 使用Context提供的多维表格引用
    const { multiTableRef } = useMultiTableRef()
    // 提供表格事例的方法
    const { setCellValue, getCellMeta } = useMultiTableRefMethods()
    // 添加至AI任务列表开始轮询
    const { updateTask } = useTableAITask()
    // 添加状态跟踪表格是否已初始化
    const [isInitialized, setIsInitialized] = useState(false)

    useEffect(() => {
      console.log('🚀 ~ useEffect ~ multiTableRef.current:', multiTableRef.current)
      if (multiTableRef.current) {
        // 列头移动事件
        multiTableRef.current.on('change_header_position', () => {
          console.log('列头移动事件')
          // onOperation({
          //   type: TableOperationType.COLUMN_MOVE,
          //   data: {
          //     columnId: '1',
          //     oldIndex: 0,
          //     newIndex: 1,
          //   },
          // })
        })
        // 列宽调整事件
        multiTableRef.current.on('resize_column_end', () => {
          console.log('列宽调整事件')
        })
        // 单元格值变更事件
        multiTableRef.current.on('change_cell_value', () => {
          console.log('单元格值变更事件')
        })
        // 下拉菜单点击事件
        multiTableRef.current.on('dropdown_menu_click', () => {
          console.log('下拉菜单点击事件')
        })
        // 单元格点击事件
        multiTableRef.current.on('selected_cell', (cellInfo) => {
          const { col, row, ranges } = cellInfo
          const cellMeta = getCellMeta<CellMetadata>(col, row, ranges)

          if (!cellMeta) {
            onCellClickBySource()
            return
          }
          if (cellMeta?.sourceId && cellMeta?.sourceType) {
            onCellClickBySource({
              sourceId: cellMeta.sourceId,
              sourceType: cellMeta.sourceType,
              value: cellMeta.processedValue,
            })
          } else {
            onCellClickBySource()
          }
          // }
        })

        // multiTableRef.current.on('click_cell', (res) => {
        //   console.log('🚀 ~ multiTableRef.current.on ~ res:', res)
        // })
        multiTableRef.current.on('icon_click', (res) => {
          if (res.name === 'run') {
            const cellMeta = getCellMeta<CellMetadata>(res.col, res.row)
            if (!cellMeta) {
              return
            }
            updateTask([
              {
                columnId: cellMeta.columnId,
                rowId: cellMeta.rowId,
                originalContent: cellMeta.processedValue,
              },
            ])
            // 直接更新单元格显示为等待状态
            setCellValue(res.col, res.row, GENERATE_TEXT)
          }
        })
      }
      return () => {
        if (multiTableRef.current) {
          multiTableRef.current.off('initialized', (e) => {
            console.log('表格初始化 移除 initialized', e)
          })
          multiTableRef.current.off('change_header_position', () => {
            console.log('列头移动事件 移除')
          })
          multiTableRef.current.off('resize_column_end', () => {
            console.log('列宽调整事件 移除')
          })
          multiTableRef.current.off('change_cell_value', () => {
            console.log('单元格值变更事件 移除')
          })
          multiTableRef.current.off('dropdown_menu_click', () => {
            console.log('下拉菜单点击事件 移除')
          })
          multiTableRef.current.off('selected_cell', (cellInfo) => {
            console.log('单元格点击事件 移除', cellInfo)
          })
          multiTableRef.current.off('icon_click', (res) => {
            console.log('icon_click 移除', res)
          })
        }
      }
    }, [multiTableRef.current])

    // 暴露内部的tableInstance给父组件
    useImperativeHandle(
      ref,
      () => ({
        multiTableInstance: multiTableRef.current,
      }),
      [multiTableRef.current]
    ) // 添加依赖以确保引用更新

    // 使用自定义钩子初始化表格
    const { getSheetInfo } = useTableInitialization({
      id: sheetId,
      multiTableRef,
      containerRef,
      loadedData,
      handleRecordOperation,
      onCellClickBySource,
    })

    // 初始化表格
    useEffect(() => {
      // 仅在组件挂载时初始化一次
      if (!isInitialized && containerRef.current) {
        getSheetInfo()
          .then(() => {
            setIsInitialized(true)
          })
          .catch((error) => {
            console.error('初始化表格失败:', error)
          })
      }
    }, [isInitialized, containerRef.current, getSheetInfo])

    return (
      <div style={{ width: '100%', height: 'calc(100vh - 160px)', ...style }}>
        <div ref={containerRef} style={{ width: '100%', height: 'calc(100% - 150px)' }}></div>
      </div>
    )
  }
)

TableContent.displayName = 'TableContent'
