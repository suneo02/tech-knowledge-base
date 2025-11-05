import { requestToWFCSuperlistFcs } from '@/api'
import { Column, TableOperationRequest } from 'gel-api'

/**
 * 表格操作服务
 */
export const tableOperationService = {
  /**
   * 获取表格版本信息
   * @param sheetId 表格ID
   */
  async getSheetVersion(sheetId: number) {
    const { Data } = await requestToWFCSuperlistFcs('superlist/excel/getSheetInfo', {
      sheetId,
    })
    return Data
  },

  /**
   * 添加行操作
   * @param params 添加行的参数，包括表格ID(sheetId)、行ID(rowId)、行索引(rowIndex)和操作编号(operationNo)
   * @returns 接口响应结果
   */
  async addRecord(params: { sheetId: number; rowId: string; rowIndex: number; operationNo: number }) {
    const { sheetId, rowId, rowIndex, operationNo } = params
    return await requestToWFCSuperlistFcs('superlist/excel/operation', {
      cmd: 'add_row',
      sheetId,
      operationNo,
      payload: {
        rowId,
        rowIndex,
      },
    })
  },

  /**
   * 添加列操作
   * @param params 添加列的参数
   */
  async addColumn(params: {
    sheetId: number
    column: Column
    columnIndex: number
    operationNo: number
    columnId: string
  }) {
    const { sheetId, column, columnIndex, operationNo, columnId } = params
    console.log('🚀 ~ addColumn ~ column:', column)
    return await requestToWFCSuperlistFcs('superlist/excel/operation', {
      cmd: 'add_column',
      sheetId,
      operationNo,
      payload: {
        columnId: column.field || columnId,
        columnName: column.columnName || column.title,
        columnIndex,
      },
    } as TableOperationRequest)
  },

  /**
   * 删除列操作
   * @param params 删除列的参数
   */
  async deleteColumn(params: { sheetId: number; operationNo: number; columnId: string }) {
    const { sheetId, columnId, operationNo } = params
    return await requestToWFCSuperlistFcs('superlist/excel/operation', {
      cmd: 'delete_column',
      sheetId,
      operationNo,
      payload: {
        columnId,
      },
    })
  },

  /**
   * 删除列操作
   * @param params 删除列的参数
   */
  async moveColumn(params: { sheetId: number; operationNo: number; columnId: string; col: number }) {
    const { sheetId, columnId, operationNo, col } = params
    return await requestToWFCSuperlistFcs('superlist/excel/operation', {
      cmd: 'move_column',
      sheetId,
      operationNo,
      payload: {
        columnId,
        newColumnIndex: col,
      },
    })
  },

  /**
   * 删除列操作
   * @param params 删除列的参数
   */
  async updateColumn(params: {
    sheetId: number
    operationNo: number
    newColumnName?: string
    columnId: string
    isHidden?: boolean
  }) {
    const { sheetId, operationNo, ...payload } = params
    return await requestToWFCSuperlistFcs('superlist/excel/operation', {
      cmd: 'update_column',
      sheetId,
      operationNo,
      payload,
    })
  },

  async updateCell(params: {
    sheetId: number
    operationNo: number
    rowId: string
    columnId: string
    value: string | number | boolean | null
  }) {
    const { sheetId, operationNo, ...payload } = params
    return await requestToWFCSuperlistFcs('superlist/excel/operation', {
      cmd: 'update_cell',
      sheetId,
      operationNo,
      payload,
    })
  },

  /**
   * 运行单元格操作
   * @param params 运行单元格的参数
   */
  async runCell(params: { sheetId: number; col: number; row: number; operationNo: number }) {
    const { sheetId, col, row, operationNo } = params
    return await requestToWFCSuperlistFcs('superlist/excel/operation', {
      cmd: 'run_cell',
      sheetId,
      operationNo,
      payload: {
        col,
        row,
      },
    } as TableOperationRequest)
  },

  /**
   * 删除行
   * @param params 运行单元格的参数
   */
  async deleteRow(params: { sheetId: number; rowId: string; operationNo: number }) {
    const { sheetId, rowId, operationNo } = params
    return await requestToWFCSuperlistFcs('superlist/excel/operation', {
      cmd: 'delete_row',
      sheetId,
      operationNo,
      payload: {
        rowId,
      },
    })
  },
}
