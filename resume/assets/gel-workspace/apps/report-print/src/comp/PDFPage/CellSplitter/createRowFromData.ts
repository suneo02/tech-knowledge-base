import { CellData } from './type'

/**
 * 创建jQuery表格行元素
 * @param rowData - 行数据 (CellData[])
 * @returns jQuery 行元素
 */

export function createRowFromData(rowData: CellData[]): JQuery {
  try {
    const $row = $('<tr>')

    rowData.forEach((cellData) => {
      const $cell = $('<td>')

      // 设置属性
      for (const key in cellData.attributes) {
        if (cellData.attributes.hasOwnProperty(key)) {
          const value = cellData.attributes[key]
          if (key !== 'class' || value) {
            // 保留有意义的属性
            $cell.attr(key, value)
          }
        }
      }

      // 设置内容 - 使用 cellData.html 来保留HTML标签
      $cell.html(cellData.html)
      $row.append($cell)
    })

    return $row
  } catch (error) {
    console.error('PDFPage: createRowFromData 错误' + JSON.stringify(error))
    return $()
  }
}
