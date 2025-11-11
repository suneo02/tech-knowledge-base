/**
 * creator.ts
 * Pure functions for creating BasicTable jQuery elements.
 */
import { TablePropsVertical } from '@/types/table'
import { t } from '@/utils/lang'
import { instanceTableDefaultOptions } from 'report-util/table'
import { TableUtils } from '../shared/tableUtils'
import { createNoDataRow } from '../tableComp'
import styles from './index.module.less'

function createHeaderElement(options: TablePropsVertical): JQuery | null {
  const { columns, showHeader } = options
  if (showHeader === false) {
    return null
  }
  const $thead = $('<thead></thead>')
  const $tr = $('<tr></tr>')

  columns.forEach((column) => {
    const $th = $('<th></th>').html(column.title || '')

    if (column.align) {
      $th.addClass(styles[`align-${column.align}`])
    }

    if (column.className) {
      $th.addClass(column.className)
    }

    $tr.append($th)
  })

  $thead.append($tr)
  return $thead
}

function createColGroup(options: TablePropsVertical): JQuery {
  const { columns } = options
  const $colgroup = $('<colgroup></colgroup>')

  columns.forEach((column) => {
    const $col = $('<col />')
    let width = column.width || ''
    if (typeof width === 'number') {
      width = `${width}px`
    }
    if (width) {
      $col.css('width', width)
      $col.css('min-width', width)
    }
    $colgroup.append($col)
  })

  return $colgroup
}

function createBodyElement(dataSource: any[], options: TablePropsVertical): JQuery {
  const $tbody = $('<tbody></tbody>')
  const { rowKey, columns, loading, noDataText } = options

  if (loading) {
    return $tbody
  }

  /**
   * 不应该走到这，如果无数据，不展示表格
   */
  if (!dataSource || dataSource.length === 0) {
    $tbody.append(createNoDataRow(columns.length || 1, noDataText))
    return $tbody
  }

  dataSource.forEach((rowData, rowIndex) => {
    const rowId = typeof rowData[rowKey] !== 'undefined' ? rowData[rowKey] : rowIndex
    const $tr = $('<tr></tr>').attr('data-row-key', rowId as string)

    columns.forEach((column) => {
      const { dataIndex, render, align, className } = column
      const cellValue = dataIndex ? rowData[dataIndex] : undefined
      const $td = $('<td></td>')

      if (align) {
        $td.addClass(styles[`align-${align}`])
      }

      if (className) {
        $td.addClass(className)
      }

      TableUtils.renderCellContent($td, cellValue, rowData, rowIndex, render)
      $tr.append($td)
    })

    $tbody.append($tr)
  })

  return $tbody
}

export const TableElementCreator = {
  createHeader: createHeaderElement,
  createBody: createBodyElement,
  createColGroup: createColGroup,
  createTable: (dataSource: any[] = [], optionsProp: TablePropsVertical): JQuery => {
    const options = $.extend(instanceTableDefaultOptions(t), optionsProp)

    const $table = $('<table></table>').addClass(styles.table)

    if (options.className) {
      $table.addClass(options.className)
    }
    $table.addClass(styles.bordered)

    // Note: rowClassName in Ant Design is for individual rows, not the table itself.
    // If mergedOptions.rowClassName is meant for the table, this is fine.
    // If it's for rows, it should be handled in createBodyElement.
    // Current BasicTable applies it to the table, so we follow that.
    if (options.rowClassName) {
      $table.addClass(options.rowClassName)
    }

    const $colgroup = createColGroup(options)
    $table.append($colgroup)

    const $thead = createHeaderElement(options)
    if ($thead) {
      $table.append($thead)
    }

    const $tbody = createBodyElement(dataSource, options)
    $table.append($tbody)

    return $table
  },
}
