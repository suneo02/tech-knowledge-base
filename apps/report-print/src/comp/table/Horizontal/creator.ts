import { TablePropsHorizontal } from '@/types/table'
import { t } from '@/utils/lang'
import { instanceTableDefaultOptions } from 'report-util/table'
import { TableUtils } from '../shared/tableUtils'
import { createNoDataElement } from '../tableComp'
import styles from './index.module.less'

/**
 * 将数组分成指定大小的块
 */
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  if (size <= 0) {
    return [array] // Avoid infinite loop or error for non-positive size
  }
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

function createTableRows(dataSource: any, options: TablePropsHorizontal): JQuery[] {
  const $rows: JQuery[] = []
  const { columns } = options
  columns.forEach((rowColumns) => {
    // Horizontal tables typically have a fixed number of label/value pairs per visual row (e.g., 3 pairs = 6 cells).
    // The chunking logic here seems to assume rowColumns is a flat list for a single visual table row.
    const maxPairsPerVisualRow = 3 // Assuming 3 label-value pairs max, so 6 columns total

    // Each item in `rowColumns` is a column definition for the current logical row.
    // The HorizontalTableColProps[][] structure means `columns` is an array of logical rows,
    // and each logical row (`rowColumns`) is an array of column configurations for that logical row.
    // A single logical row can map to multiple visual rows if it has more than `maxPairsPerVisualRow` items.

    const visualRowsChunks = chunkArray(rowColumns, maxPairsPerVisualRow)

    visualRowsChunks.forEach((chunk) => {
      const $visualTr = $('<tr></tr>').addClass(styles['horizontalTable-TR']) // Create a new <tr> for each visual chunk
      let usedCells = 0

      chunk.forEach((column, colIndex) => {
        const $labelCell = $('<td></td>').addClass(styles.labelCell).addClass(styles.cell)
        if (column.className) {
          $labelCell.addClass(column.className)
        }
        $labelCell.html(column.title || '')
        $visualTr.append($labelCell)
        usedCells++

        const $valueCell = $('<td></td>').addClass(styles.valueCell).addClass(styles.cell)
        if (column.valueClassName) {
          $valueCell.addClass(column.valueClassName)
        }

        const value = dataSource && column.dataIndex ? dataSource[column.dataIndex] : undefined
        TableUtils.renderCellContent($valueCell, value, dataSource, colIndex, column.render)

        const colSpan = column.colSpan && column.colSpan > 1 ? column.colSpan : 1
        if (colSpan > 1) {
          $valueCell.attr('colspan', colSpan)
        }
        $visualTr.append($valueCell)
        usedCells += colSpan
      })

      // Fill remaining cells in the visual row to maintain structure (total maxPairsPerVisualRow * 2 cells)
      const totalCellsPerVisualRow = maxPairsPerVisualRow * 2
      for (let i = usedCells; i < totalCellsPerVisualRow; i += 2) {
        // Add an empty label cell
        $visualTr.append($('<td></td>').addClass(styles.labelCell).addClass(styles.cell))
        // Add an empty value cell
        if (i + 1 < totalCellsPerVisualRow) {
          // ensure not to add a lonely label cell if totalCells is odd after colspan
          $visualTr.append($('<td></td>').addClass(styles.valueCell).addClass(styles.cell))
        } else if (totalCellsPerVisualRow - usedCells === 1) {
          // if only one cell is missing, it should be a value cell if the last one was a label
          // but this case implies an odd number of cells, which is unusual for label-value pairs
          // For safety, make the last cell span if it's a single remaining cell
          const $lastActualCell = $visualTr.children().last()
          if ($lastActualCell.is('.' + styles.valueCell)) {
            const currentValColspan = parseInt($lastActualCell.attr('colspan') || '1', 10)
            $lastActualCell.attr('colspan', currentValColspan + 1)
          } else {
            // This case should ideally not happen with paired label/value
            // $visualTr.append($('<td></td>').addClass(styles.valueCell).addClass(styles.cell));
          }
        }
      }
      $rows.push($visualTr)
    })
  })
  return $rows
}

export const HorizontalTableElementCreator = {
  createTable: (dataSource: any = null, optionsProps: Omit<TablePropsHorizontal, 'type'>): JQuery => {
    const options = $.extend(instanceTableDefaultOptions(t), optionsProps)
    const { columns, className, noDataText, loading } = options

    const $table = $('<table></table>')
      .addClass(styles.horizontalTable)
      .addClass(className || '')

    $table.addClass(styles.bordered)

    const $tbody = $('<tbody></tbody>')

    if (loading) {
    } else if (!columns || columns.length === 0 || !dataSource || Object.keys(dataSource).length === 0) {
      const $noDataTr = $('<tr></tr>')
      const $noDataTd = $('<td></td>').attr('colspan', 6)
      $noDataTd.append(createNoDataElement(noDataText))
      $noDataTr.append($noDataTd)
      $tbody.append($noDataTr)
    } else {
      const $tableRowElements = createTableRows(dataSource, options)
      $tbody.append($tableRowElements)
    }

    $table.append($tbody)
    return $table
  },
}
