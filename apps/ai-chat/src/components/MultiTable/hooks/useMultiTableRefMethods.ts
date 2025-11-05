import { ColumnDefine, ListTable } from '@visactor/vtable'
import { ISortedMapItem } from '@visactor/vtable/es/data/DataSource'
import {
  CellRange,
  DropDownMenuHighlightInfo,
  DropDownMenuOptions,
  FieldDef,
  IPagination,
  SortState,
} from '@visactor/vtable/es/ts-types'
import { TooltipOptions } from '@visactor/vtable/es/ts-types/tooltip'
import { useMemo } from 'react'
import { useMultiTableRef } from '../context/MultiTableRefContext'

/**
 * 使用多维表格实例的常用方法API
 */
export const useMultiTableRefMethods = () => {
  const { multiTableRef } = useMultiTableRef()

  /** 数据操作与管理相关 */
  const dataManipulationandManagement = (table: ListTable | null) => {
    /**
     * 设置表格数据
     * @param records 数据记录数组
     * @param option 选项
     * @returns 是否设置成功
     */
    const setRecords = <T extends Record<string, unknown>>(
      records: T[],
      option?: {
        sortState?: SortState | SortState[] | null
      }
    ): boolean => {
      try {
        if (!table) return false

        table.setRecords(records, option)
        return true
      } catch (error) {
        console.error('设置表格数据失败:', error)
        return false
      }
    }
    /**
     * 添加数据记录
     * @param records 数据记录数组
     * @param recordIndex 插入位置索引
     * @returns 是否添加成功
     */
    const addRecords = <T extends Record<string, unknown>>(records: T[], recordIndex?: number | number[]): boolean => {
      try {
        if (!table) return false

        table.addRecords(records, recordIndex)
        return true
      } catch (error) {
        console.error('添加数据记录失败:', error)
        return false
      }
    }

    /**
     * 添加单条数据记录
     * @param record 数据记录
     * @param recordIndex 插入位置索引
     * @returns 是否添加成功
     */
    const addRecord = <T extends Record<string, unknown>>(record: T, recordIndex?: number): boolean => {
      try {
        if (!table) return false

        table.addRecord(record, recordIndex)
        return true
      } catch (error) {
        console.error('添加单条数据记录失败:', error)
        return false
      }
    }

    /**
     * 删除数据记录
     * @param recordIndexes 要删除的记录索引数组
     * @returns 是否删除成功
     */
    const deleteRecords = (recordIndexes: number[]): boolean => {
      try {
        if (!table) return false

        table.deleteRecords(recordIndexes)
        return true
      } catch (error) {
        console.error('删除数据记录失败:', error)
        return false
      }
    }

    /**
     * 更新数据记录
     * @param records 新的数据记录数组
     * @param recordIndexes 要更新的记录索引数组
     * @returns 是否更新成功
     */
    const updateRecords = <T extends Record<string, unknown>>(records: T[], recordIndexes: number[]): boolean => {
      try {
        if (!table) return false

        table.updateRecords(records, recordIndexes)
        return true
      } catch (error) {
        console.error('更新数据记录失败:', error)
        return false
      }
    }

    return { setRecords, addRecord, addRecords, deleteRecords, updateRecords }
  }

  const customMethods = (table: ListTable | null) => {
    /**
     * 获取单元格元信息
     * @param col 列索引
     * @param row 行索引
     * @param ranges 单元格范围
     * @returns 单元格元信息
     * TODO 暂不支持多单元格获取
     */
    const getCellMeta = <T>(col: number, row: number, ranges?: CellRange[]): T | false => {
      console.log('🚀 ~ 获取单元格元信息 ~ ranges:', ranges)
      if (ranges && (ranges.length > 1 || ranges[0].start.row === 0)) {
        console.warn('获取表头列失败: 暂不支持范围参数获取')
        return false
      }
      try {
        const columnId = table?.getHeaderField(col, row)
        const record = table?.getRecordByCell(col, row)
        const cellMeta = record[`${columnId}&`] as T
        console.log('🚀 ~ 获取单元格元信息 ~ cellMeta:', cellMeta)
        return cellMeta
      } catch (error) {
        console.error('获取单元格元信息失败:', error)
        return null
      }
    }

    const getCellMetaById = <T>(columnId: string, rowId: string) => {
      try {
        const record = table?.records.find((record) => record[rowId] === rowId)
        const cellMeta = record[`${columnId}&`] as T
        return cellMeta
      } catch (error) {
        console.error('获取单元格元信息失败:', error)
        return null
      }
    }

    const addColumn = (column: ColumnDefine, index?: number) => {
      if (!table) {
        console.error('表格实例不存在')
        return
      }
      const newColumns = [...table.columns]
      newColumns.splice(index, 0, column)
      console.log('🚀 ~ addColumn ~ table.columns:', newColumns)
      table.updateColumns(newColumns)
    }

    return { getCellMeta, getCellMetaById, addColumn }
  }

  return useMemo(() => {
    console.log('🚀 ~ 获取表格实例 ~ multiTableRef.current:', multiTableRef.current)
    // 获取表格实例，简化后续代码访问
    const getTable = (): ListTable | null => multiTableRef.current

    return {
      ...dataManipulationandManagement(getTable()),
      ...customMethods(getTable()),
      /**
       * 获取表格列定义
       * @returns 列定义数组或undefined
       */
      getColumns: (): ColumnDefine[] | undefined => {
        return getTable()?.columns
      },

      /**
       * 获取表格所有列头单元格
       * @returns 列头单元格数组或空数组
       */
      getAllColumnHeaders: () => {
        const headerCells = getTable()?.getAllColumnHeaderCells()
        return headerCells && headerCells.length > 0 ? headerCells[0] : []
      },

      /**
       * 获取当前选中的单元格信息
       * @returns 选中单元格信息数组或空数组
       */
      getSelectedCells: () => {
        return getTable()?.getSelectedCellInfos() || []
      },

      /**
       * 修改单元格的值
       * @param col 列索引
       * @param row 行索引
       * @param value 新值
       * @param workOnEditableCell 是否只在可编辑单元格上操作
       * @returns 是否修改成功
       */
      setCellValue: (
        col: number,
        row: number,
        value: string | number,
        workOnEditableCell: boolean = false
      ): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          table.changeCellValue(col, row, value, workOnEditableCell)
          return true
        } catch (error) {
          console.error('设置单元格值失败:', error)
          return false
        }
      },

      /**
       * 批量修改单元格的值
       * @param col 起始列索引
       * @param row 起始行索引
       * @param values 二维数组值，代表从起始位置开始的一片区域的值
       * @returns 是否修改成功
       */
      setCellValues: (col: number, row: number, values: (string | number)[][]): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          table.changeCellValues(col, row, values)
          return true
        } catch (error) {
          console.error('批量设置单元格值失败:', error)
          return false
        }
      },

      /**
       * 获取表格可见区域的矩形区域
       * @returns 可见区域范围对象
       */
      getVisibleRect: () => {
        return getTable()?.getVisibleRect()
      },

      /**
       * 刷新表格
       * @returns 是否刷新成功
       */
      refresh: (): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          table.render()
          return true
        } catch (error) {
          console.error('刷新表格失败:', error)
          return false
        }
      },

      /**
       * 重新创建单元格并刷新表格
       * @returns 是否刷新成功
       */
      refreshWithRecreateCells: (): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          table.renderWithRecreateCells()
          return true
        } catch (error) {
          console.error('重新创建单元格并刷新表格失败:', error)
          return false
        }
      },

      /**
       * 获取表格DOM元素
       * @returns 表格DOM元素或null
       */
      getTableDomElement: () => {
        return getTable()?.getElement() || null
      },

      /**
       * 获取原始表格实例
       * @returns 表格实例或null
       */
      getTableInstance: () => getTable(),

      /**
       * 根据表格索引获取表体索引
       * @param col 列索引
       * @param row 行索引
       * @returns 表体索引对象
       */
      getBodyIndexByTableIndex: (col: number, row: number) => {
        return getTable()?.getBodyIndexByTableIndex(col, row) || { col: 0, row: 0 }
      },

      /**
       * 根据表体索引获取表格索引
       * @param col 列索引
       * @param row 行索引
       * @returns 表格索引对象
       */
      getTableIndexByBodyIndex: (col: number, row: number) => {
        return getTable()?.getTableIndexByBodyIndex(col, row) || { col: 0, row: 0 }
      },

      /**
       * 根据记录索引获取表格行索引
       * @param recordIndex 记录索引
       * @returns 表格行索引
       */
      getTableIndexByRecordIndex: (recordIndex: number) => {
        return getTable()?.getTableIndexByRecordIndex(recordIndex) || 0
      },

      /**
       * 根据单元格位置获取记录索引
       * @param col 列索引
       * @param row 行索引
       * @returns 记录索引
       */
      getRecordIndexByCell: (col: number, row: number) => {
        return getTable()?.getRecordIndexByCell(col, row) || 0
      },

      /**
       * 根据记录索引获取表体行索引
       * @param index 记录索引
       * @returns 表体行索引
       */
      getBodyRowIndexByRecordIndex: (index: number) => {
        return getTable()?.getBodyRowIndexByRecordIndex(index) || 0
      },

      /**
       * 根据字段名获取表格列索引
       * @param field 字段名
       * @returns 表格列索引
       */
      getTableIndexByField: (field: string) => {
        return getTable()?.getTableIndexByField(field) || 0
      },

      /**
       * 根据单元格位置获取记录显示索引
       * @param col 列索引
       * @param row 行索引
       * @returns 记录显示索引
       */
      getRecordShowIndexByCell: (col: number, row: number) => {
        return getTable()?.getRecordShowIndexByCell(col, row) || 0
      },

      /**
       * 根据字段名和记录索引获取单元格地址
       * @param field 字段名
       * @param recordIndex 记录索引
       * @returns 单元格地址对象
       */
      getCellAddrByFieldRecord: (field: string, recordIndex: number) => {
        return getTable()?.getCellAddrByFieldRecord(field, recordIndex) || { col: 0, row: 0 }
      },

      /**
       * 获取所有单元格
       * @param colMaxCount 最大列数
       * @param rowMaxCount 最大行数
       * @returns 所有单元格数组
       */
      getAllCells: (colMaxCount?: number, rowMaxCount?: number) => {
        return getTable()?.getAllCells(colMaxCount, rowMaxCount) || []
      },

      /**
       * 获取所有表体单元格
       * @param colMaxCount 最大列数
       * @param rowMaxCount 最大行数
       * @returns 所有表体单元格数组
       */
      getAllBodyCells: (colMaxCount?: number, rowMaxCount?: number) => {
        return getTable()?.getAllBodyCells(colMaxCount, rowMaxCount) || []
      },

      /**
       * 获取所有行表头单元格
       * @param colMaxCount 最大列数
       * @param rowMaxCount 最大行数
       * @returns 所有行表头单元格数组
       */
      getAllRowHeaderCells: () => {
        return getTable()?.getAllRowHeaderCells() || []
      },

      /**
       * 获取单元格表头路径
       * @param col 列索引
       * @param row 行索引
       * @returns 表头路径对象
       */
      getCellHeaderPaths: (col: number, row: number) => {
        return getTable()?.getCellHeaderPaths(col, row) || {}
      },

      /**
       * 设置下拉菜单高亮
       * @param dropDownMenuInfo 下拉菜单信息
       * @returns 是否设置成功
       */
      setDropDownMenuHighlight: (dropDownMenuInfo: DropDownMenuHighlightInfo[]): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          table.setDropDownMenuHighlight(dropDownMenuInfo)
          return true
        } catch (error) {
          console.error('设置下拉菜单高亮失败:', error)
          return false
        }
      },

      /**
       * 导出单元格区域图片
       * @param cellRange 单元格区域
       * @returns 图片数据URL
       */
      exportCellRangeImg: (cellRange: {
        start: { col: number; row: number }
        end: { col: number; row: number }
      }): string => {
        return getTable()?.exportCellRangeImg(cellRange) || ''
      },

      /**
       * 获取编辑器
       * @param col 列索引
       * @param row 行索引
       * @returns 编辑器对象
       */
      getEditor: (col: number, row: number) => {
        return getTable()?.getEditor(col, row) || {}
      },

      /**
       * 开始编辑单元格
       * @param col 列索引
       * @param row 行索引
       * @param value 初始值
       * @returns 是否开始编辑成功
       */
      startEditCell: (col: number, row: number, value?: string | number): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          table.startEditCell(col, row, value)
          return true
        } catch (error) {
          console.error('开始编辑单元格失败:', error)
          return false
        }
      },

      /**
       * 完成编辑单元格
       * @returns 是否完成编辑成功
       */
      completeEditCell: (): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          table.completeEditCell()
          return true
        } catch (error) {
          console.error('完成编辑单元格失败:', error)
          return false
        }
      },

      /**
       * 根据字段获取聚合值
       * @param field 字段名
       * @returns 聚合值数组
       */
      getAggregateValuesByField: (field: string) => {
        return getTable()?.getAggregateValuesByField(field) || []
      },

      /**
       * 判断单元格是否为聚合单元格
       * @param col 列索引
       * @param row 行索引
       * @returns 是否为聚合单元格
       */
      isAggregation: (col: number, row: number): boolean => {
        return getTable()?.isAggregation(col, row) || false
      },

      /**
       * 注册自定义单元格样式
       * @param customStyleId 自定义样式ID
       * @param customStyle 自定义样式对象
       * @returns 是否注册成功
       */
      registerCustomCellStyle: (customStyleId: string, customStyle: Record<string, unknown>): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          table.registerCustomCellStyle(customStyleId, customStyle)
          return true
        } catch (error) {
          console.error('注册自定义单元格样式失败:', error)
          return false
        }
      },

      /**
       * 安排自定义单元格样式
       * @param cellPosition 单元格位置对象
       * @param customStyleId 自定义样式ID
       * @returns 是否安排成功
       */
      arrangeCustomCellStyle: (cellPosition: { col: number; row: number }, customStyleId: string): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          table.arrangeCustomCellStyle(cellPosition, customStyleId)
          return true
        } catch (error) {
          console.error('安排自定义单元格样式失败:', error)
          return false
        }
      },

      /**
       * 获取复选框状态
       * @param field 字段名
       * @returns 复选框状态数组
       */
      getCheckboxState: (field: string) => {
        return getTable()?.getCheckboxState(field) || []
      },

      /**
       * 获取单元格复选框状态
       * @param col 列索引
       * @param row 行索引
       * @returns 单元格复选框状态
       */
      getCellCheckboxState: (col: number, row: number) => {
        return getTable()?.getCellCheckboxState(col, row) || []
      },

      /**
       * 获取单选框状态
       * @param field 字段名
       * @returns 单选框状态
       */
      getRadioState: (field: string) => {
        return getTable()?.getRadioState(field) || 0
      },

      /**
       * 获取单元格单选框状态
       * @param col 列索引
       * @param row 行索引
       * @returns 单元格单选框状态
       */
      getCellRadioState: (col: number, row: number): boolean | number => {
        return getTable()?.getCellRadioState(col, row)
      },

      /**
       * 设置单元格复选框状态
       * @param col 列索引
       * @param row 行索引
       * @param checked 是否选中
       * @returns 是否设置成功
       */
      setCellCheckboxState: (col: number, row: number, checked: boolean): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          table.setCellCheckboxState(col, row, checked)
          return true
        } catch (error) {
          console.error('设置单元格复选框状态失败:', error)
          return false
        }
      },

      /**
       * 设置单元格单选框状态
       * @param col 列索引
       * @param row 行索引
       * @param index 选中索引
       * @returns 是否设置成功
       */
      setCellRadioState: (col: number, row: number, index: number): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          table.setCellRadioState(col, row, index)
          return true
        } catch (error) {
          console.error('设置单元格单选框状态失败:', error)
          return false
        }
      },

      /**
       * 获取开关状态
       * @param field 字段名
       * @returns 开关状态数组
       */
      getSwitchState: (field: string) => {
        return getTable()?.getSwitchState(field) || []
      },

      /**
       * 获取单元格开关状态
       * @param col 列索引
       * @param row 行索引
       * @returns 单元格开关状态
       */
      getCellSwitchState: (col: number, row: number): boolean => {
        return !!getTable()?.getCellSwitchState?.(col, row)
      },

      /**
       * 设置单元格开关状态
       * @param col 列索引
       * @param row 行索引
       * @param checked 是否选中
       * @returns 是否设置成功
       */
      setCellSwitchState: (col: number, row: number, checked: boolean): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          if (typeof table.setCellSwitchState === 'function') {
            table.setCellSwitchState(col, row, checked)
            return true
          }
          return false
        } catch (error) {
          console.error('设置单元格开关状态失败:', error)
          return false
        }
      },

      /**
       * 获取所有行高
       * @returns 所有行高数组
       */
      getAllRowsHeight: () => {
        return getTable()?.getAllRowsHeight?.() || []
      },

      /**
       * 获取所有列宽
       * @returns 所有列宽数组
       */
      getAllColsWidth: () => {
        return getTable()?.getAllColsWidth?.() || []
      },

      /**
       * 设置排序索引映射
       * @param field 字段
       * @param filedMap 排序索引映射
       * @returns 是否设置成功
       */
      setSortedIndexMap: (field: FieldDef, filedMap: ISortedMapItem): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          if (typeof table.setSortedIndexMap === 'function') {
            table.setSortedIndexMap(field, filedMap)
            return true
          }
          return false
        } catch (error) {
          console.error('设置排序索引映射失败:', error)
          return false
        }
      },

      /**
       * 获取表头字段
       * @param col 列索引
       * @param row 行索引
       * @returns 表头字段
       */
      getHeaderField: (col: number, row: number): FieldDef => {
        return getTable()?.getHeaderField?.(col, row)
      },

      /**
       * 获取列宽
       * @param col 列索引
       * @returns 列宽
       */
      getColWidth: (col: number): number => {
        return getTable()?.getColWidth?.(col) || 0
      },

      /**
       * 获取行高
       * @param row 行索引
       * @returns 行高
       */
      getRowHeight: (row: number): number => {
        return getTable()?.getRowHeight?.(row) || 0
      },

      /**
       * 设置列宽
       * @param col 列索引
       * @param width 列宽
       * @returns 是否设置成功
       */
      setColWidth: (col: number, width: number): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          if (typeof table.setColWidth === 'function') {
            table.setColWidth(col, width)
            return true
          }
          return false
        } catch (error) {
          console.error('设置列宽失败:', error)
          return false
        }
      },

      /**
       * 设置行高
       * @param row 行索引
       * @param height 行高
       * @returns 是否设置成功
       */
      setRowHeight: (row: number, height: number): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          if (typeof table.setRowHeight === 'function') {
            table.setRowHeight(row, height)
            return true
          }
          return false
        } catch (error) {
          console.error('设置行高失败:', error)
          return false
        }
      },

      /**
       * 判断单元格是否在可视视图中
       * @param col 列索引
       * @param row 行索引
       * @returns 是否在可视视图中
       */
      cellIsInVisualView: (col: number, row: number): boolean => {
        return getTable()?.cellIsInVisualView?.(col, row) || false
      },

      /**
       * 根据相对位置获取单元格
       * @param x X坐标
       * @param y Y坐标
       * @returns 单元格地址对象
       */
      getCellAtRelativePosition: (x: number, y: number) => {
        return getTable()?.getCellAtRelativePosition?.(x, y) || { col: 0, row: 0 }
      },

      /**
       * 显示移动线
       * @param x X坐标
       * @param y Y坐标
       * @returns 是否显示成功
       */
      showMoverLine: (x: number, y: number): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          if (typeof table.showMoverLine === 'function') {
            table.showMoverLine(x, y)
            return true
          }
          return false
        } catch (error) {
          console.error('显示移动线失败:', error)
          return false
        }
      },

      /**
       * 隐藏移动线
       * @returns 是否隐藏成功
       */
      hideMoverLine: (col: number, row: number) => {
        try {
          const table = getTable()
          if (!table) return false

          table?.hideMoverLine(col, row)
        } catch (error) {
          console.error('隐藏移动线失败:', error)
          return false
        }
      },

      /**
       * 禁用滚动
       * @returns 是否禁用成功
       */
      disableScroll: (): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          if (typeof table.disableScroll === 'function') {
            table.disableScroll()
            return true
          }
          return false
        } catch (error) {
          console.error('禁用滚动失败:', error)
          return false
        }
      },

      /**
       * 启用滚动
       * @returns 是否启用成功
       */
      enableScroll: (): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          if (typeof table.enableScroll === 'function') {
            table.enableScroll()
            return true
          }
          return false
        } catch (error) {
          console.error('启用滚动失败:', error)
          return false
        }
      },

      /**
       * 设置画布大小
       * @param width 宽度
       * @param height 高度
       * @returns 是否设置成功
       */
      setCanvasSize: (width: number, height: number): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          if (typeof table.setCanvasSize === 'function') {
            table.setCanvasSize(width, height)
            return true
          }
          return false
        } catch (error) {
          console.error('设置画布大小失败:', error)
          return false
        }
      },

      /**
       * 设置层级结构状态加载中
       * @param col 列索引
       * @param row 行索引
       * @returns 是否设置成功
       */
      setLoadingHierarchyState: (col: number, row: number): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          if (typeof table.setLoadingHierarchyState === 'function') {
            table.setLoadingHierarchyState(col, row)
            return true
          }
          return false
        } catch (error) {
          console.error('设置层级结构状态加载中失败:', error)
          return false
        }
      },

      /**
       * 设置像素比率
       * @param ratio 比率
       * @returns 是否设置成功
       */
      setPixelRatio: (ratio: number): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          if (typeof table.setPixelRatio === 'function') {
            table.setPixelRatio(ratio)
            return true
          }
          return false
        } catch (error) {
          console.error('设置像素比率失败:', error)
          return false
        }
      },

      /**
       * 释放表格资源
       * @returns 是否释放成功
       */
      release: (): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          table.release()
          return true
        } catch (error) {
          console.error('释放表格资源失败:', error)
          return false
        }
      },

      /**
       * 导出表格为图片
       * @returns 图片数据URL
       */
      exportImg: (): string => {
        return getTable()?.exportImg() || ''
      },

      /**
       * 导出单元格为图片
       * @param col 列索引
       * @param row 行索引
       * @param options 导出选项
       * @returns 图片数据URL
       */
      exportCellImg: (col: number, row: number, options?: Record<string, unknown>): string => {
        return getTable()?.exportCellImg(col, row, options) || ''
      },

      /**
       * 导出表格数据为CSV格式
       * @returns CSV内容字符串
       */
      exportCSV: (): string => {
        const table = getTable()
        if (!table) return ''

        // 使用getCopyValue代替exportCSV
        return table.getCopyValue() || ''
      },

      /**
       * 获取单元格值
       * @param col 列索引
       * @param row 行索引
       * @param skipCustomMerge 是否跳过自定义合并
       * @returns 单元格值
       */
      getCellValue: (col: number, row: number, skipCustomMerge?: boolean): string | number | null => {
        return getTable()?.getCellValue(col, row, skipCustomMerge) || null
      },

      /**
       * 获取单元格原始值
       * @param col 列索引
       * @param row 行索引
       * @returns 单元格原始值
       */
      getCellOriginValue: (col: number, row: number): string | number | null => {
        return getTable()?.getCellOriginValue(col, row) || null
      },

      /**
       * 获取单元格原始数据值(未经过格式化)
       * @param col 列索引
       * @param row 行索引
       * @returns 单元格原始数据值
       */
      getCellRawValue: (col: number, row: number): string | number | null => {
        return getTable()?.getCellRawValue(col, row) || null
      },

      /**
       * 获取单元格信息
       * @param col 列索引
       * @param row 行索引
       * @returns 单元格信息对象
       */
      getCellInfo: (col: number, row: number) => {
        return getTable()?.getCellInfo(col, row)
      },

      /**
       * 获取单元格样式
       * @param col 列索引
       * @param row 行索引
       * @returns 单元格样式对象
       */
      getCellStyle: (col: number, row: number) => {
        return getTable()?.getCellStyle(col, row) || {}
      },

      /**
       * 获取单元格溢出文本
       * @param col 列索引
       * @param row 行索引
       * @returns 单元格溢出文本
       */
      getCellOverflowText: (col: number, row: number) => {
        return getTable()?.getCellOverflowText(col, row)
      },

      /**
       * 获取单元格矩形区域
       * @param col 列索引
       * @param row 行索引
       * @returns 单元格矩形区域对象
       */
      getCellRect: (col: number, row: number) => {
        return getTable()?.getCellRect(col, row)
      },

      /**
       * 获取单元格相对矩形区域
       * @param col 列索引
       * @param row 行索引
       * @returns 单元格相对矩形区域对象
       */
      getCellRelativeRect: (col: number, row: number) => {
        return getTable()?.getCellRelativeRect(col, row)
      },

      /**
       * 获取单元格区域范围
       * @param col 列索引
       * @param row 行索引
       * @returns 单元格区域范围对象
       */
      getCellRange: (col: number, row: number) => {
        return getTable()?.getCellRange(col, row)
      },

      /**
       * 获取复制的值（按TAB和换行符格式化）
       * @returns 复制的值字符串
       */
      getCopyValue: (): string => {
        return getTable()?.getCopyValue() || ''
      },

      /**
       * 选择单元格
       * @param col 列索引
       * @param row 行索引
       * @param isShift 是否按下Shift键
       * @param isCtrl 是否按下Ctrl键
       * @param makeVisible 是否使选中单元格可见
       * @param skipBodyMerge 是否跳过表体合并
       * @returns 是否选择成功
       */
      selectCell: (
        col: number,
        row: number,
        isShift?: boolean,
        isCtrl?: boolean,
        makeVisible?: boolean,
        skipBodyMerge?: boolean
      ): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          table.selectCell(col, row, isShift, isCtrl, makeVisible, skipBodyMerge)
          return true
        } catch (error) {
          console.error('选择单元格失败:', error)
          return false
        }
      },

      /**
       * 选择多个单元格区域
       * @param cellRanges 单元格区域数组
       * @returns 是否选择成功
       */
      selectCells: (
        cellRanges: Array<{ start: { col: number; row: number }; end: { col: number; row: number } }>
      ): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          table.selectCells(cellRanges)
          return true
        } catch (error) {
          console.error('选择多个单元格区域失败:', error)
          return false
        }
      },

      /**
       * 选择一个单元格区域
       * @param startCol 起始列索引
       * @param startRow 起始行索引
       * @param endCol 结束列索引
       * @param endRow 结束行索引
       * @returns 是否选择成功
       */
      selectCellRange: (startCol: number, startRow: number, endCol: number, endRow: number): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          // 使用两次selectCell实现区域选择
          table.selectCell(startCol, startRow)
          table.selectCell(endCol, endRow, true) // 第三个参数表示扩展选择
          return true
        } catch (error) {
          console.error('选择单元格区域失败:', error)
          return false
        }
      },

      /**
       * 清除所有选择
       * @returns 是否清除成功
       */
      clearSelection: (): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          table.clearSelected()
          return true
        } catch (error) {
          console.error('清除选择失败:', error)
          return false
        }
      },

      /**
       * 滚动到指定位置
       * @param scrollLeft 水平滚动偏移量
       * @param scrollTop 垂直滚动偏移量
       * @returns 是否滚动成功
       */
      scrollTo: (scrollLeft: number, scrollTop: number): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          // 分别设置水平和垂直滚动位置
          table.setScrollLeft(scrollLeft)
          table.setScrollTop(scrollTop)
          return true
        } catch (error) {
          console.error('滚动失败:', error)
          return false
        }
      },

      /**
       * 滚动到指定单元格位置
       * @param col 列索引
       * @param row 行索引
       * @returns 是否滚动成功
       */
      scrollToCell: (col: number, row: number): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          table.scrollToCell({ col, row })
          return true
        } catch (error) {
          console.error('滚动到单元格失败:', error)
          return false
        }
      },

      /**
     

     

      // /**
      //  * 获取表格当前数据记录
      //  * @returns 数据记录数组
      //  */
      // getRecords: <T extends Record<string, unknown>>(): T[] => {
      //   const table = getTable()
      //   if (!table) return []

      //   // 使用数据源方法获取记录
      //   if (typeof table.records === 'function') {
      //     return table.records()
      //   } else if (typeof table.dataSource === 'function') {
      //     return table.dataSource()
      //   }
      //   return []
      // },

      /**
       * 根据单元格位置获取记录
       * @param col 列索引
       * @param row 行索引
       * @returns 数据记录对象
       */
      getRecordByCell: <T extends Record<string, unknown>>(col: number, row: number): T => {
        return getTable()?.getRecordByCell(col, row) || {}
      },

      /**
       * 根据单元格位置获取原始记录
       * @param col 列索引
       * @param row 行索引
       * @returns 原始数据记录对象
       */
      getCellOriginRecord: <T extends Record<string, unknown>>(col: number, row: number): T => {
        return getTable()?.getCellOriginRecord(col, row) || {}
      },

      /**
       * 更新表格配置
       * @param options 新的配置选项
       * @returns 是否更新成功
       */
      updateOptions: <T extends Record<string, unknown>>(options: T): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          table.updateOption(options)
          return true
        } catch (error) {
          console.error('更新配置失败:', error)
          return false
        }
      },

      /**
       * 更新表格主题
       * @param theme 新的主题配置
       * @returns 是否更新成功
       */
      updateTheme: (theme: Record<string, unknown>): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          table.updateTheme(theme)
          return true
        } catch (error) {
          console.error('更新主题失败:', error)
          return false
        }
      },

      /**
       * 更新表格列配置
       * @param columns 新的列配置
       * @returns 是否更新成功
       */
      updateColumns: (columns: ColumnDefine[]): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          table.updateColumns(columns)
          return true
        } catch (error) {
          console.error('更新列配置失败:', error)
          return false
        }
      },

      /**
       * 更新表格配置
       * @param options 新的配置选项
       * @returns 是否更新成功
       */
      updateOption: <T extends Record<string, unknown>>(options: T): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          table.updateOption(options)
          return true
        } catch (error) {
          console.error('更新配置失败:', error)
          return false
        }
      },

      /**
       * 更新分页配置
       * @param pagination 新的分页配置
       * @returns 是否更新成功
       */
      updatePagination: (pagination: IPagination): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          table.updatePagination(pagination)
          return true
        } catch (error) {
          console.error('更新分页配置失败:', error)
          return false
        }
      },

      // /**
      //  * 绑定事件监听
      //  * @param eventName 事件名称
      //  * @param handler 事件处理函数
      //  * @returns 是否绑定成功
      //  */
      // on: (): EventListenerId => {
      //   try {
      //     const table = getTable()
      //     console.log('注册事件 useMultiTableOperations ', type, listener)
      //     // 绑定事件
      //     return table.on()
      //   } catch (error) {
      //     console.error('绑定事件失败:', error)
      //   }
      // },

      // /**
      //  * 解除事件监听
      //  * @param eventName 事件名称
      //  * @param handler 事件处理函数
      //  * @returns 是否解除成功
      //  */
      // off: <T extends unknown[]>(eventName: string, handler: (...args: T) => void): boolean => {
      //   try {
      //     const table = getTable()
      //     if (!table) return false

      //     // 解除事件
      //     table.off(eventName as any, handler as any)
      //     return true
      //   } catch (error) {
      //     console.error('解除事件失败:', error)
      //     return false
      //   }
      // },

      /**
       * 获取表格绘制范围
       * @returns 绘制范围对象
       */
      getDrawRange: () => {
        return getTable()?.getDrawRange()
      },

      /**
       * 获取当前表格的滚动位置
       * @returns 滚动位置对象 {scrollLeft, scrollTop}
       */
      getScrollOffset: () => {
        const table = getTable()
        if (!table) return { scrollLeft: 0, scrollTop: 0 }

        return {
          scrollLeft: table.getScrollLeft(),
          scrollTop: table.getScrollTop(),
        }
      },

      /**
       * 获取表格body可见单元格范围
       * @returns 可见单元格范围对象
       */
      getBodyVisibleCellRange: () => {
        return (
          getTable()?.getBodyVisibleCellRange() || {
            rowStart: 0,
            colStart: 0,
            rowEnd: 0,
            colEnd: 0,
          }
        )
      },

      /**
       * 获取表格body可见列范围
       * @returns 可见列范围对象
       */
      getBodyVisibleColRange: () => {
        return (
          getTable()?.getBodyVisibleColRange() || {
            colStart: 0,
            colEnd: 0,
          }
        )
      },

      /**
       * 获取表格body可见行范围
       * @returns 可见行范围对象
       */
      getBodyVisibleRowRange: () => {
        return (
          getTable()?.getBodyVisibleRowRange() || {
            rowStart: 0,
            rowEnd: 0,
          }
        )
      },

      /**
       * 切换层级结构状态
       * @param col 列索引
       * @param row 行索引
       * @param recalculateColWidths 是否重新计算列宽
       * @returns 是否切换成功
       */
      toggleHierarchyState: (col: number, row: number, recalculateColWidths: boolean = true): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          table.toggleHierarchyState(col, row, recalculateColWidths)
          return true
        } catch (error) {
          console.error('切换层级结构状态失败:', error)
          return false
        }
      },

      /**
       * 获取层级结构状态
       * @param col 列索引
       * @param row 行索引
       * @returns 层级结构状态
       */
      getHierarchyState: (col: number, row: number): string => {
        return getTable()?.getHierarchyState(col, row) || 'none'
      },

      /**
       * 显示工具提示
       * @param col 列索引
       * @param row 行索引
       * @param tooltipOptions 工具提示选项
       * @returns 是否显示成功
       */
      showTooltip: (col: number, row: number, tooltipOptions?: TooltipOptions): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          table.showTooltip(col, row, tooltipOptions)
          return true
        } catch (error) {
          console.error('显示工具提示失败:', error)
          return false
        }
      },

      /**
       * 显示下拉菜单
       * @param col 列索引
       * @param row 行索引
       * @param menuOptions 菜单选项
       * @returns 是否显示成功
       */
      showDropdownMenu: (col: number, row: number, menuOptions?: DropDownMenuOptions): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          table.showDropDownMenu(col, row, menuOptions)
          return true
        } catch (error) {
          console.error('显示下拉菜单失败:', error)
          return false
        }
      },

      // /**
      //  * 更新排序状态
      //  * @param sortState 排序状态
      //  * @param executeSort 是否执行排序
      //  * @returns 是否更新成功
      //  */
      // updateSortState: (sortState: Record<string, unknown>, executeSort: boolean = true): boolean => {
      //   try {
      //     const table = getTable()
      //     if (!table) return false

      //     table.updateSortState(sortState, executeSort)
      //     return true
      //   } catch (error) {
      //     console.error('更新排序状态失败:', error)
      //     return false
      //   }
      // },

      /**
       * 更新过滤规则
       * @param filterRules 过滤规则
       * @returns 是否更新成功
       */
      updateFilterRules: (filterRules: Record<string, unknown>[]): boolean => {
        try {
          const table = getTable()
          if (!table) return false

          table.updateFilterRules(filterRules)
          return true
        } catch (error) {
          console.error('更新过滤规则失败:', error)
          return false
        }
      },
    }
  }, [multiTableRef.current])
}
