/**
 * 表格处理模块
 * 专门处理PDFPage中的表格相关功能
 */

import { createRowFromData } from './CellSplitter/createRowFromData'
import { extractCellsData } from './CellSplitter/extractCellsData'
import { splitForSingleLineFit } from './CellSplitter/splitForSingleLineFit'
import { CheckOverflowFn } from './CellSplitter/type'
import { PDFPage } from './index'
import { TableOptions } from './types'
import { PDFPageUtils } from './utils'

/**
 * 表格处理器类
 * 负责表格的添加、分页和渲染逻辑
 */
export class TableHandler {
  private $originalTable: JQuery
  private options: TableOptions
  private $targetTable: JQuery
  /**
   * 构造函数
   * @param pdfPage - PDFPage实例，用于访问页面方法
   */
  constructor(private pdfPage: PDFPage) {}

  /**
   * 创建表格框架（包含表头但清空表体）
   * 克隆原始表格的结构以保留样式和基本布局，但清空表体内容
   */
  private createTableFramework(): string {
    const $newTable = this.$originalTable.clone()
    $newTable.find(this.options.bodySelector).empty()
    return this.pdfPage.addContent($newTable)
  }

  /**
   * 在新页面创建表格
   * 创建新表格（包含表头）并添加到新页面，返回相关元素引用
   */
  private createTableOnNewPage() {
    // 直接调用 createTableFramework 来创建表格框架
    const newTableId = this.createTableFramework()
    const $newPage = this.pdfPage.findCurrentPage()
    this.$targetTable = $newPage.find(`#${newTableId}`)
  }

  /**
   * 检查当前表格是否为空表体
   */
  private isCurrentTableEmpty(): boolean {
    return this.getCurrentTableBody().children().length === 0
  }

  /**
   * 获取当前表格的表体
   */
  private getCurrentTableBody(): JQuery {
    return this.$targetTable.find(this.options.bodySelector)
  }

  /**
   * 处理表格的添加
   * @param table - 表格内容
   * @param options - 表格选项
   * @returns 生成的表格ID
   */
  addTable(table: JQuery, options: TableOptions = {}): string {
    try {
      // 步骤 1: 标准化表格选项
      // 如果用户没有提供选项，则使用默认值
      // 确保表格ID、表头选择器、表体选择器和行选择器都有定义
      this.options = PDFPageUtils.getTableOptions(options)

      // 步骤 2: 获取表格的jQuery对象
      // 无论输入是HTML字符串还是jQuery对象，都统一转换为jQuery对象
      // 如果表格没有ID，则使用 tableOptions 中的 tableId
      this.$originalTable = PDFPageUtils.getTableElement(table, this.options.tableId)

      // 步骤 3: 分析表格结构
      // 提取表格的表头、表体和所有数据行
      // 判断表格是否包含实际的表头内容
      const { $rows, hasHeader } = PDFPageUtils.analyzeTableStructure(this.$originalTable, this.options)
      this.options.hasHeader = hasHeader

      // 步骤 4: 处理空表格
      // 如果表格没有任何数据行，则直接将当前表格结构添加到PDF页面
      // 这是对简单情况的快速处理，这类型表格无法再拆分
      if ($rows.length === 0) {
        return this.pdfPage.addContent(this.$originalTable)
      }

      // 步骤 5: 创建并添加表格框架
      // 先将包含表头（如果存在）的表格框架添加到页面，然后再逐行填充内容
      const addedTableId = this.createTableFramework()
      if (!addedTableId) {
        console.error('PDFPage: 表格添加失败', table, options)
        return ''
      }

      // 步骤 6: 逐行添加表格数据行
      // addTableRows 会处理分页逻辑，如果行内容超出当前页面，会自动创建新页面并继续添加
      this.$targetTable = this.pdfPage.findCurrentPage().find(`#${addedTableId}`)

      // 将 jQuery 对象转换为数组，便于切片操作
      const rowsArray = $rows.toArray().map((row) => $(row))

      // 步骤 7: 处理表格行的添加
      this.processTableRows(rowsArray)

      return addedTableId
    } catch (error) {
      console.error('PDFPage: 表格添加失败', error)
      return ''
    }
  }

  /**
   * 处理表格行的添加逻辑
   * 根据当前页面状态决定如何添加表格行
   *
   * @param rowsArray - 所有需要添加的表格行
   * @param $addedTable - 已添加到页面的表格
   */
  private processTableRows(rowsArray: JQuery[]): void {
    try {
      // 如果当前页面不是空白页，需要特殊处理第一行
      if (!this.pdfPage.isCurrentPageBlank()) {
        const firstRowResult = this.tryAddFirstRow(rowsArray)

        if (firstRowResult.shouldMoveToNewPage) {
          // 第一行导致溢出，需要移动到新页面处理所有行
          this.moveTableToNewPageAndAddRows(rowsArray)
          return
        }

        // 第一行添加成功，继续添加剩余行
        this.addTableRows(rowsArray.slice(1))
      } else {
        // 当前页面是空白页，直接添加所有行
        this.addTableRows(rowsArray)
      }
    } catch (error) {
      console.error('PDFPage: 表格行处理失败' + JSON.stringify(error))
    }
  }

  /**
   * 尝试添加第一行到非空白页面
   *
   * @param rowsArray - 所有表格行
   * @param $addedTable - 目标表格
   * @returns 添加结果信息
   */
  private tryAddFirstRow(rowsArray: JQuery[]): {
    shouldMoveToNewPage: boolean
  } {
    if (rowsArray.length === 0) {
      return { shouldMoveToNewPage: false }
    }

    // 克隆第一行并添加到表格体
    const $clonedRow = rowsArray[0].clone()
    this.getCurrentTableBody().append($clonedRow)

    // 检查添加后是否超过页面高度
    if (this.pdfPage.isCurrentPageHeightOverflow()) {
      // 移除刚添加的行，准备移动到新页面
      $clonedRow.remove()
      return { shouldMoveToNewPage: true }
    }

    return { shouldMoveToNewPage: false }
  }

  /**
   * 将表格移动到新页面并添加所有行
   *
   * @param rowsArray - 所有表格行
   * @param $addedTable - 当前表格（将被移除）
   */
  private moveTableToNewPageAndAddRows(rowsArray: JQuery[]): void {
    // 移除整个表格，并创建新页面
    this.$targetTable.remove()
    this.pdfPage.addPage()

    // 在新页面创建新表格
    this.createTableOnNewPage()
    // 并添加所有行
    this.addTableRows(rowsArray)
  }

  /**
   * 递归添加表格行
   * 尽可能多地添加行到当前表格，超出页面高度时创建新页面并继续添加
   *
   * 工作流程：
   * 1. 遍历所有需要添加的表格行
   * 2. 逐行添加到目标表格，每次添加后检查页面高度
   * 3. 如果添加某行后页面高度超过限制，则处理溢出情况
   * 4. 溢出处理会移除溢出行，创建新页面，并继续递归处理剩余行
   *
   * @param $rowsToAdd - 需要添加的表格行数组
   * @param $targetTable - 当前目标表格
   */
  addTableRows($rowsToAdd: JQuery[]): void {
    // 终止条件：如果没有行需要添加，直接返回
    // 防止无限递归的关键检查点
    if ($rowsToAdd.length === 0) {
      return
    }

    for (let i = 0; i < $rowsToAdd.length; i++) {
      // 使用通用的添加行方法
      this.handleAppendRow($rowsToAdd[i])
    }
    // 如果所有行都成功添加到当前页面，循环正常结束，函数返回
  }

  /**
   * 处理极端过高的行，通过尝试在当前页面适配单行内容
   * 并在新页面递归处理剩余内容。
   * 当一行即使在空白页面也会导致溢出时调用此方法。
   *
   * @param $originalOverflowingRow - 导致溢出的原始行的jQuery元素，即使在空白页面也会溢出。
   */
  private handleExtremelyTallRow($originalOverflowingRow: JQuery): void {
    const originalCellsData = extractCellsData($originalOverflowingRow)
    const $testTableBody = this.getCurrentTableBody() // This is the context for DOM operations

    // Define the checkOverflow callback, capturing necessary context from TableHandler
    const checkOverflow: CheckOverflowFn = ($elementToCheck: JQuery): boolean => {
      $testTableBody.append($elementToCheck)
      const overflows = this.pdfPage.isCurrentPageHeightOverflow()
      $elementToCheck.remove()
      return overflows
    }

    const { firstLineData, remainingData } = splitForSingleLineFit(
      originalCellsData,
      checkOverflow // Pass the callback
    )

    // 添加适配到第一行的内容
    if (firstLineData.some((cell) => cell.content.length > 0)) {
      const $firstFitRow = createRowFromData(firstLineData)
      // $testTableBody 应该是来自 this.getCurrentTableBody() 的正确表格体
      $testTableBody.append($firstFitRow)
    } else {
      console.log('PDFPage: 过高行的内容无法适配到当前页面的第一行。')
    }

    // 处理剩余数据
    if (remainingData.length > 0 && remainingData.some((cell) => cell.content.length > 0)) {
      this.pdfPage.addPage() // 创建新页面
      this.createTableOnNewPage() // 在新页面创建新的表格框架（表头 + 空表体）

      // 将剩余的 CellData[] 转换回 JQuery 行以使用现有的 handleAppendRow 逻辑
      const $remainingRowAsJQuery = createRowFromData(remainingData)

      // 将剩余数据作为新行添加到新页面的新表格中。
      // 如果 $remainingRowAsJQuery 仍然过高，这也会处理进一步的拆分。
      this.handleAppendRow($remainingRowAsJQuery)
    } else {
      console.log('PDFPage: 过高行没有剩余数据需要处理。')
    }
  }

  /**
   * 处理单行的添加。如果溢出，将管理分页。
   * 如果行即使在新的空白页面也过高，则调用 handleExtremelyTallRow。
   * @param $row - 要添加的 JQuery 行。
   */
  private handleAppendRow($row: JQuery): void {
    try {
      const $currentTableBody = this.getCurrentTableBody()
      const $clonedRow = $row.clone()
      $currentTableBody.append($clonedRow)

      if (this.pdfPage.isCurrentPageHeightOverflow()) {
        $clonedRow.remove() // 移除导致溢出的行

        if (this.isCurrentTableEmpty()) {
          // 表格体为空，表示此单行本身就溢出了空白页
          // 这是"极端过高行"的定义
          // debugger; // 用户添加的调试断点
          this.handleExtremelyTallRow($row) // 传递原始 $row
        } else {
          // 表格已有内容，此行导致了溢出
          // 检查当前页面在添加此行"之前"是否已接近满
          // 为此，我们需要一个方法来获取"不包含"$clonedRow的页面填充度，
          // 或者，更简单地，如果页面"现在"快满了（即使我们移除了$clonedRow），
          // 并且不是因为$clonedRow本身填满了一个空页，那么就认为原页面已满。
          // 当前的 isCurrentPageNearingFull 判断的是移除 $clonedRow 后的情况，
          // 但如果不是空表体溢出，那说明移除 $clonedRow 后，页面本身可能就已经有内容了。

          // 关键决策点：
          // 1. 如果页面【在尝试添加此行之前】就快满了，则将【整行】移至新页面。
          // 2. 如果页面【在尝试添加此行之前】有足够空间，但此行【本身太大】无法完全容纳，
          //    则尝试在【当前页面】对【此行】进行单行拆分。

          // 模拟：如果移除$clonedRow后，页面高度没有溢出，但接近满，则认为是情况1
          // 注意：isCurrentPageHeightOverflow 此时应该是 false，因为我们已经移除了 $clonedRow
          // 我们需要的是添加 $clonedRow *之前* 的状态。
          // 由于我们已经添加并移除了，所以 $currentTableBody 的状态是添加前的状态。
          // this.pdfPage.isCurrentPageNearingFull() 将检查这个添加前的状态。

          if (this.pdfPage.isCurrentPageNearingFull()) {
            // 情况1：原页面已接近满，将此【完整行】移至新页面
            this.handleRowOverflow($row) // 传递原始 $row
          } else {
            // 情况2：原页面有空间，但此行本身太大。尝试在【当前页】拆分此行。

            this.handleExtremelyTallRow($row) // 对溢出行在当前页进行精细拆分
          }
        }
      } else {
        // 行成功添加且未溢出
      }
    } catch (error) {
      console.error('PDFPage: 表格行添加失败' + JSON.stringify(error))
    }
  }

  /**
   * 处理表格已有内容时的标准行溢出。
   * 将溢出的行移动到新页面的新表格中。
   * @param $overflowingRow - 导致溢出的 JQuery 行。
   */
  private handleRowOverflow($overflowingRow: JQuery) {
    this.pdfPage.addPage()
    this.createTableOnNewPage()
    this.handleAppendRow($overflowingRow) // 重新将行添加到新表格
  }
}
