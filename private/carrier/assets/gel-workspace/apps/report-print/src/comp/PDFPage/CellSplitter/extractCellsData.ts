import { CellData } from './type'

/**
 * 从jQuery行元素提取单元格数据
 * @param $row - 表格行 (jQuery对象)
 * @returns 单元格数据 (CellData) 数组
 */

export function extractCellsData($row: JQuery): CellData[] {
  try {
    const cellsData: CellData[] = []

    $row.find('td, th').each((_index, cell) => {
      const $cell = $(cell)
      const attributes: Record<string, string> = {}

      // 保存单元格的所有属性
      if (cell.attributes) {
        for (let i = 0; i < cell.attributes.length; i++) {
          const attr = cell.attributes[i]
          attributes[attr.name] = attr.value
        }
      }

      cellsData.push({
        content: $cell.text().trim(), // 保存纯文本内容，用于长度计算
        attributes,
        html: $cell.html() || '', // 保存原始HTML内容
      })
    })

    return cellsData
  } catch (error) {
    console.error('PDFPage: extractCellsData 错误' + JSON.stringify(error))
    return []
  }
}
